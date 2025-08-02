package br.com.leandrocruz.produtos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.leandrocruz.produtos.model.Produtos;

@Repository
public interface RepositoryProdutos extends JpaRepository<Produtos,Integer>{

}
