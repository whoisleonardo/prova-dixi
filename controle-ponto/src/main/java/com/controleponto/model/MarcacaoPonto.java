package com.controleponto.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "marcacao")
@Data
public class MarcacaoPonto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;

    private LocalTime hora;

    @Column(length = 13)
    private String pis;

    @Column(length = 13)
    private String cpf;

    @Column(name = "tipo_registro", length = 3)
    private String tipoRegistro;

    @Column(name = "origem_arquivo", length = 255)
    private String origemArquivo;

    private boolean apropriada;

    @Column(name = "motivo_rejeicao", length = 255)
    private String motivoRejeicao;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;
}
