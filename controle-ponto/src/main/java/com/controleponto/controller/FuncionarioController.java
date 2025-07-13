package com.controleponto.controller;

import com.controleponto.dto.FuncionarioDTO;
import com.controleponto.model.Funcionario;
import com.controleponto.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    @PostMapping
    public ResponseEntity<Funcionario> cadastrar(@Valid @RequestBody FuncionarioDTO dto) {
        Funcionario funcionario = funcionarioService.cadastrar(dto);
        return ResponseEntity.ok(funcionario);
    }

    @GetMapping
    public ResponseEntity<List<Funcionario>> listarTodos() {
        return ResponseEntity.ok(funcionarioService.listarTodos());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Funcionario>> buscar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cpf,
            @RequestParam(required = false) String pis,
            @RequestParam(required = false) String matricula
    ) {
        return ResponseEntity.ok(funcionarioService.buscar(nome, cpf, pis, matricula));
    }

    @PutMapping("/{id}/inativar")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        funcionarioService.inativar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(funcionarioService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> editar(
            @PathVariable Long id,
            @Valid @RequestBody FuncionarioDTO dto
    ) {
        Funcionario atualizado = funcionarioService.editar(id, dto);
        return ResponseEntity.ok(atualizado);
    }
}
