package com.controleponto.dto;

import lombok.Data;

import java.util.List;

@Data
public class ResultadoImportacaoAFDDTO {
    private List<MarcacaoPontoDTO> apropriadas;
    private List<MarcacaoPontoDTO> naoApropriadas;
}
