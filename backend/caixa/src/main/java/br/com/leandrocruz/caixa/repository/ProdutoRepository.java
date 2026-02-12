package br.com.leandrocruz.caixa.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.leandrocruz.caixa.entity.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
}