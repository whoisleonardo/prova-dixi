package com.controleponto.validation;

import com.controleponto.dto.FuncionarioDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfOuPisValidator implements ConstraintValidator<CpfOuPis, FuncionarioDTO> {

    @Override
    public boolean isValid(FuncionarioDTO dto, ConstraintValidatorContext context) {
        if (dto == null) {
            return true;
        }

        boolean cpfPreenchido = dto.getCpf() != null && !dto.getCpf().trim().isEmpty();
        boolean pisPreenchido = dto.getPis() != null && !dto.getPis().trim().isEmpty();

        return cpfPreenchido || pisPreenchido;
    }
}
