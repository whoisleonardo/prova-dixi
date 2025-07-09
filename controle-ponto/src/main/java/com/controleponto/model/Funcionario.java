package com.controleponto.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeCompleto;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf; 

    @Column(nullable = false, unique = true, length = 11)
    private String pis; 

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false)
    private LocalDate dataAdmissao;

    @Column(nullable = false)
    private String situacaoCadastro; 
}