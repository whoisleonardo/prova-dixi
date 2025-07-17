package com.controleponto.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class EspelhoPontoDTO {
    private Long funcionarioId;
    private String funcionarioNome;
    private LocalDate data;
    private double horasTrabalhadas;
    private double horasNormais;
    private double horasExtras;
    private double faltas;
    private double atrasos;
    private double adicionalNoturno;
    private List<String> marcacoes;
}
