package br.com.leandrocruz.caixa.re;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.leandrocruz.caixa.en.Cliente;



@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
}