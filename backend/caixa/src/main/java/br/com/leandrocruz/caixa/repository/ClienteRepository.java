package br.com.leandrocruz.caixa.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.leandrocruz.caixa.entity.Cliente;



@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
}