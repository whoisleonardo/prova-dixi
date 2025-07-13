package com.controleponto.dto;

import com.controleponto.validation.CpfOuPis;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@CpfOuPis
@Data
public class FuncionarioDTO {

    @NotBlank(message = "Nome completo é obrigatório")
    private String nomeCompleto;

    @Pattern(regexp = "(^$|\\d{11}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2})", message = "CPF inválido")
    private String cpf;

    @Pattern(regexp = "(^$|\\d{11}|\\d{3}\\.\\d{5}\\.\\d{2}-\\d{1})", message = "PIS inválido")
    private String pis;

    @NotBlank(message = "Matrícula é obrigatória")
    private String matricula;

    @NotNull(message = "Data de admissão é obrigatória")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataAdmissao;

    @NotBlank(message = "Situação do cadastro é obrigatória")
    @Pattern(regexp = "Ativo|Inativo", message = "Situação deve ser 'Ativo' ou 'Inativo'")
    private String situacaoCadastro;
}
