package com.controleponto.mapper;

import com.controleponto.dto.FuncionarioDTO;
import com.controleponto.model.Funcionario;

public class FuncionarioMapper {

    public static Funcionario toEntity(FuncionarioDTO dto) {
        Funcionario funcionario = new Funcionario();
        funcionario.setNomeCompleto(dto.getNomeCompleto());
        funcionario.setCpf(dto.getCpf() != null ? dto.getCpf().replaceAll("\\D", "") : null);
        funcionario.setPis(dto.getPis() != null ? dto.getPis().replaceAll("\\D", "") : null);
        funcionario.setMatricula(dto.getMatricula());
        funcionario.setDataAdmissao(dto.getDataAdmissao());
        funcionario.setSituacaoCadastro(dto.getSituacaoCadastro());
        return funcionario;
    }
}
