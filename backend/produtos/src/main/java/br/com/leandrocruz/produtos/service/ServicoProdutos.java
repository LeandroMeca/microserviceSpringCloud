package br.com.leandrocruz.produtos.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import br.com.leandrocruz.produtos.model.Produtos;
import br.com.leandrocruz.produtos.repository.RepositoryProdutos;

@Service
public class ServicoProdutos {

  @Autowired
  RepositoryProdutos repositoryProdutos;

  public Produtos salvar(Produtos produtos) {
    return repositoryProdutos.save(produtos);
  }

  public List<Produtos> pegarProdutos() {
    return repositoryProdutos.findAll();
  }

  public void deletarProduto(int id) {
      repositoryProdutos.deleteById(id);
  }

 
  public ResponseEntity<Produtos> atualizarProduto(int id, Produtos produtos) {
    
    Produtos produtoToUp = repositoryProdutos.findById(id).orElseThrow();

    produtoToUp.setNome(produtos.getNome());
    produtoToUp.setDescricao(produtos.getDescricao());
    produtoToUp.setPreco(produtos.getPreco());
    Produtos produtoSave = repositoryProdutos.save(produtoToUp);
    return ResponseEntity.ok(produtoSave);
  }


}
