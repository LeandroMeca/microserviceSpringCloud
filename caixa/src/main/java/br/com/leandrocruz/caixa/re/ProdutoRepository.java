package br.com.leandrocruz.caixa.re;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.leandrocruz.caixa.en.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
}