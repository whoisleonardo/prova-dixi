package com.controleponto.dto;

import lombok.Data;

@Data
public class MarcacaoPontoDTO {
    private String data;
    private String hora;
    private String pis;
    private String cpf;
    private boolean apropriada;
    private String motivo;
}
