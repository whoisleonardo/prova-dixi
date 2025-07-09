package com.controleponto.repository;

import com.controleponto.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    boolean existsByCpf(String cpf);
    boolean existsByPis(String pis);
    boolean existsByMatricula(String matricula);

    List<Funcionario> findByNomeCompletoContainingIgnoreCase(String nomeCompleto);

    List<Funcionario> findByCpf(String cpf);

    List<Funcionario> findByPis(String pis);

    List<Funcionario> findByMatricula(String matricula);

    List<Funcionario> findBySituacaoCadastro(String situacaoCadastro);
}