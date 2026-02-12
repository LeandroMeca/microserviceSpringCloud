package br.com.leandrocruz.caixa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.leandrocruz.caixa.entity.Cliente;
import br.com.leandrocruz.caixa.entity.Produto;
import br.com.leandrocruz.caixa.repository.ClienteRepository;
import br.com.leandrocruz.caixa.repository.ProdutoRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    private static final Logger logger = LoggerFactory.getLogger(ProdutoController.class);

    // URL do webhook do n8n, configurável em application.properties
    @Value("${n8n.webhook.url:}")
    private String n8nWebhookUrl;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    // cliente simples para chamadas HTTP para o n8n
    private final RestTemplate restTemplate = new RestTemplate();

    // Endpoint para salvar um único produto
    @PostMapping("/single")
    public ResponseEntity<Produto> createProduto(@RequestBody Produto produto) {
        // Valida se o cliente existe antes de salvar o produto
        if (produto.getCliente() != null && produto.getCliente().getId() != null) {
            Optional<Cliente> clienteExistente = clienteRepository.findById(produto.getCliente().getId());
            if (clienteExistente.isPresent()) {
                produto.setCliente(clienteExistente.get());
                Produto produtoSalvo = produtoRepository.save(produto);

                // tenta enviar payload ao n8n, se configurado
                /*
                 * if (n8nWebhookUrl != null && !n8nWebhookUrl.isBlank()) {
                 * try {
                 * Map<String, Object> payload = new HashMap<>();
                 * payload.put("event", "produto_created");
                 * payload.put("produto", produtoSalvo);
                 * logger.debug("Payload para n8n (single): {}", payload);
                 * try {
                 * String json = MAPPER.writeValueAsString(payload);
                 * HttpHeaders headers = new HttpHeaders();
                 * headers.setContentType(MediaType.APPLICATION_JSON);
                 * HttpEntity<String> entity = new HttpEntity<>(json, headers);
                 * restTemplate.postForEntity(n8nWebhookUrl, entity, String.class);
                 * logger.info("Enviado payload para n8n: {}", n8nWebhookUrl);
                 * } catch (JsonProcessingException e) {
                 * logger.error("Erro ao serializar payload para n8n: {}", e.getMessage());
                 * }
                 * } catch (RestClientException ex) {
                 * logger.error("Falha ao enviar webhook para n8n: {}", ex.getMessage());
                 * }
                 * } else {
                 * logger.debug("n8n.webhook.url não configurado; pulando envio para webhook");
                 * }
                 */

                return ResponseEntity.ok(produtoSalvo);
            }
        }
        // Se o cliente não for encontrado, retorna uma resposta de erro.
        return ResponseEntity.badRequest().body(null);
    }

    // NOVO ENDPOINT: para salvar uma lista de produtos
    @PostMapping
    public ResponseEntity<BigDecimal> createProdutos(@RequestBody List<Produto> produtos) {
        List<Produto> produtosSalvos = new ArrayList<>();
        Optional<Cliente> clienteExistente = null;
        BigDecimal valorTotal = BigDecimal.ZERO;

        for (Produto produto : produtos) {
            if (produto.getCliente() != null && produto.getCliente().getId() != null) {
                clienteExistente = clienteRepository.findById(produto.getCliente().getId());
                if (clienteExistente.isPresent()) {
                    produto.setCliente(clienteExistente.get());
                    produtosSalvos.add(produto);
                    valorTotal = valorTotal.add(produto.getPreco());
                } else {
                    System.out.println("Cliente com ID " + produto.getCliente().getId()
                            + " não encontrado. Produto não será salvo.");
                }
            } else {
                System.out.println("Produto sem ID de cliente. Produto não será salvo.");
            }
        }
        if (produtosSalvos.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        // Salva todos os produtos válidos de uma vez
        produtoRepository.saveAll(produtosSalvos);

        // tenta enviar payload resumido ao n8n, se configurado
        if (n8nWebhookUrl != null && !n8nWebhookUrl.isBlank()) {
            try {
                Map<String, Object> payload = new HashMap<>();
                payload.put("event", "produtos_batch_created");
                payload.put("valorTotal", valorTotal);
                payload.put("nome", clienteExistente.get().getNome());
                payload.put("celular", clienteExistente.get().getCelular());
                payload.put("produtos", produtosSalvos);

                logger.debug("Payload para n8n (batch): {}", payload);
                try {
                    String json = MAPPER.writeValueAsString(payload);
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    HttpEntity<String> entity = new HttpEntity<>(json, headers);
                    restTemplate.postForEntity(n8nWebhookUrl, entity, String.class);
                    logger.info("Enviado batch de produtos para n8n: {}", n8nWebhookUrl);
                } catch (JsonProcessingException e) {
                    logger.error("Erro ao serializar payload batch para n8n: {}", e.getMessage());
                }
            } catch (RestClientException ex) {
                logger.error("Falha ao enviar webhook batch para n8n: {}", ex.getMessage());
            }
        } else {
            logger.debug("n8n.webhook.url não configurado; pulando envio batch para webhook");
        }

        return ResponseEntity.ok(valorTotal);
    }

    @GetMapping
    public List<Produto> getAllProdutos() {
        return produtoRepository.findAll();
    }

    // Endpoint para buscar um produto por ID
    @GetMapping("/{id}")
    public ResponseEntity<List<Produto>> getProdutoById(@PathVariable Integer id) {
        Optional<Produto> produtoOptional = produtoRepository.findById(id);

        if (produtoOptional.isPresent()) {
            List<Produto> listaDeUmProduto = new ArrayList<>();
            listaDeUmProduto.add(produtoOptional.get());
            return ResponseEntity.ok(listaDeUmProduto);
        }

        return ResponseEntity.notFound().build();
    }

}