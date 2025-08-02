package br.com.leandrocruz.caixa.co;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.leandrocruz.caixa.en.Cliente;
import br.com.leandrocruz.caixa.en.Produto;
import br.com.leandrocruz.caixa.re.ClienteRepository;
import br.com.leandrocruz.caixa.re.ProdutoRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    // Endpoint para salvar um único produto
    @PostMapping("/single")
    public ResponseEntity<Produto> createProduto(@RequestBody Produto produto) {
        // Valida se o cliente existe antes de salvar o produto
        if (produto.getCliente() != null && produto.getCliente().getId() != null) {
            Optional<Cliente> clienteExistente = clienteRepository.findById(produto.getCliente().getId());
            if (clienteExistente.isPresent()) {
                produto.setCliente(clienteExistente.get());
                Produto produtoSalvo = produtoRepository.save(produto);
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
        
        BigDecimal valorTotal = BigDecimal.ZERO;

        for (Produto produto : produtos) {
            if (produto.getCliente() != null && produto.getCliente().getId() != null) {
                Optional<Cliente> clienteExistente = clienteRepository.findById(produto.getCliente().getId());
                if (clienteExistente.isPresent()) {
                    produto.setCliente(clienteExistente.get());
                    produtosSalvos.add(produto);
                    valorTotal = valorTotal.add(produto.getPreco());
                } else {
                    System.out.println("Cliente com ID " + produto.getCliente().getId() + " não encontrado. Produto não será salvo.");
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