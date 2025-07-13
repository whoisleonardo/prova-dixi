package com.controleponto.validation;

import com.controleponto.dto.FuncionarioDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfOuPisValidator implements ConstraintValidator<CpfOuPis, FuncionarioDTO> {

    @Override
    public boolean isValid(FuncionarioDTO dto, ConstraintValidatorContext context) {
        boolean cpfValido = dto.getCpf() != null && !dto.getCpf().isBlank();
        boolean pisValido = dto.getPis() != null && !dto.getPis().isBlank();

        if (cpfValido || pisValido) {
            return true;
        }

        context.disableDefaultConstraintViolation();
        context
                .buildConstraintViolationWithTemplate("Informe ao menos CPF ou PIS")
                .addPropertyNode("cpf")
                .addConstraintViolation();

        return false;
    }
}
