package br.com.leandrocruz.caixa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import br.com.leandrocruz.caixa.entity.Cliente;
import br.com.leandrocruz.caixa.repository.ClienteRepository;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    private static final Logger logger = LoggerFactory.getLogger(ClienteController.class);

    @Value("${n8n.webhook.url:}")
    private String n8nWebhookUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @PostMapping
    public ResponseEntity<Cliente> createCliente(@RequestBody Cliente cliente) {
        Cliente clienteSalvo = clienteRepository.save(cliente);

        // envia webhook para n8n
        if (n8nWebhookUrl != null && !n8nWebhookUrl.isBlank()) {
            try {
                Map<String,Object> payload = new HashMap<>();
                payload.put("event", "cliente_created");
                payload.put("cliente", clienteSalvo);
                logger.debug("Payload para n8n (cliente): {}", payload);

                String json = MAPPER.writeValueAsString(payload);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<String> entity = new HttpEntity<>(json, headers);
                restTemplate.postForEntity(n8nWebhookUrl, entity, String.class);
                logger.info("Enviado payload de cliente para n8n: {}", n8nWebhookUrl);
            } catch (JsonProcessingException e) {
                logger.error("Erro ao serializar payload cliente para n8n: {}", e.getMessage());
            } catch (RestClientException ex) {
                logger.error("Falha ao enviar webhook cliente para n8n: {}", ex.getMessage());
            }
        } else {
            logger.debug("n8n.webhook.url não configurado; pulando envio para webhook (cliente)");
        }

        return ResponseEntity.ok(clienteSalvo);
    }

    @GetMapping
    public List<Cliente> getAllClientes() {
        return clienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Integer id) {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        if (cliente.isPresent()) {
            return ResponseEntity.ok(cliente.get());
        }
        return ResponseEntity.notFound().build();
    }
}