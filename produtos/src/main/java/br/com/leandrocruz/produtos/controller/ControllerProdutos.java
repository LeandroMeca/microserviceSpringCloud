package br.com.leandrocruz.produtos.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.leandrocruz.produtos.model.Produtos;
import br.com.leandrocruz.produtos.service.ServicoProdutos;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("v1")
public class ControllerProdutos {

    @Autowired
    private ServicoProdutos servico;

    @PostMapping("/p")
    public Produtos saveProdutos(@RequestBody Produtos produtos) {
       Produtos save = servico.salvar(produtos);
       return save;
    }

    @GetMapping
    public List<Produtos> getProdutos() {
        List<Produtos> pegarProdutos = servico.pegarProdutos();
        return pegarProdutos;
    }

    @PutMapping("/produtos/{id}")
    public ResponseEntity<Produtos> atualizarProduto(@PathVariable int id, @RequestBody Produtos entity) {
        ResponseEntity<Produtos> atualizarProduto = servico.atualizarProduto(id, entity);
        return atualizarProduto;
    }
    
    @DeleteMapping("/delete/{id}")
    public void deletarProduto(@PathVariable int id){
        servico.deletarProduto(id);
    }
    
}
