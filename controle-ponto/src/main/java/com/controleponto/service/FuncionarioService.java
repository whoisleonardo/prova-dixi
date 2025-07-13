package com.controleponto.service;

import com.controleponto.dto.FuncionarioDTO;
import com.controleponto.exception.BusinessException;
import com.controleponto.mapper.FuncionarioMapper;
import com.controleponto.model.Funcionario;
import com.controleponto.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public Funcionario cadastrar(FuncionarioDTO dto) {
        String cpf = (dto.getCpf() != null && !dto.getCpf().isBlank()) ? dto.getCpf().replaceAll("\\D", "") : null;
        String pis = (dto.getPis() != null && !dto.getPis().isBlank()) ? dto.getPis().replaceAll("\\D", "") : null;

        if (cpf != null && funcionarioRepository.existsByCpf(cpf)) {
            throw new BusinessException("CPF já cadastrado.");
        }
        if (pis != null && funcionarioRepository.existsByPis(pis)) {
            throw new BusinessException("PIS já cadastrado.");
        }
        if (funcionarioRepository.existsByMatricula(dto.getMatricula())) {
            throw new BusinessException("Matrícula já cadastrada.");
        }

        dto.setCpf(cpf);
        dto.setPis(pis);

        Funcionario funcionario = FuncionarioMapper.toEntity(dto);
        return funcionarioRepository.save(funcionario);
    }

    public void inativar(Long id) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Funcionário não encontrado"));
        funcionario.setSituacaoCadastro("Inativo");
        funcionarioRepository.save(funcionario);
    }

    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    public List<Funcionario> buscar(String nome, String cpf, String pis, String matricula) {
        if (nome != null && !nome.isEmpty()) {
            return funcionarioRepository.findByNomeCompletoContainingIgnoreCase(nome);
        }
        if (cpf != null && !cpf.isEmpty()) {
            return funcionarioRepository.findByCpf(cpf.replaceAll("\\D", ""));
        }
        if (pis != null && !pis.isEmpty()) {
            return funcionarioRepository.findByPis(pis.replaceAll("\\D", ""));
        }
        if (matricula != null && !matricula.isEmpty()) {
            return funcionarioRepository.findByMatricula(matricula);
        }
        return funcionarioRepository.findAll();
    }

    public Funcionario buscarPorId(Long id) {
        return funcionarioRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Funcionário não encontrado"));
    }

    public Funcionario editar(Long id, FuncionarioDTO dto) {
        Funcionario funcionarioExistente = funcionarioRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Funcionário não encontrado"));

        String novoCpf = (dto.getCpf() != null && !dto.getCpf().isBlank()) ? dto.getCpf().replaceAll("\\D", "") : null;
        String novoPis = (dto.getPis() != null && !dto.getPis().isBlank()) ? dto.getPis().replaceAll("\\D", "") : null;

        if (novoCpf != null && !novoCpf.equals(funcionarioExistente.getCpf()) && funcionarioRepository.existsByCpf(novoCpf)) {
            throw new BusinessException("CPF já cadastrado.");
        }

        if (novoPis != null && !novoPis.equals(funcionarioExistente.getPis()) && funcionarioRepository.existsByPis(novoPis)) {
            throw new BusinessException("PIS já cadastrado.");
        }

        if (!dto.getMatricula().equals(funcionarioExistente.getMatricula()) && funcionarioRepository.existsByMatricula(dto.getMatricula())) {
            throw new BusinessException("Matrícula já cadastrada.");
        }

        funcionarioExistente.setNomeCompleto(dto.getNomeCompleto());
        funcionarioExistente.setCpf(novoCpf);
        funcionarioExistente.setPis(novoPis);
        funcionarioExistente.setMatricula(dto.getMatricula());
        funcionarioExistente.setDataAdmissao(dto.getDataAdmissao());
        funcionarioExistente.setSituacaoCadastro(dto.getSituacaoCadastro());

        return funcionarioRepository.save(funcionarioExistente);
    }
}
