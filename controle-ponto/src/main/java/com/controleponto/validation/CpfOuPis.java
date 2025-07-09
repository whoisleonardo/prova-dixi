package com.controleponto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = CpfOuPisValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface CpfOuPis {

    String message() default "CPF ou PIS deve ser informado";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
