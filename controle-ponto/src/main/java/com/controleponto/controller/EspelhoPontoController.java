package com.controleponto.controller;

import com.controleponto.dto.EspelhoPontoDTO;
import com.controleponto.service.EspelhoPontoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/espelho-ponto")
@CrossOrigin(origins = "http://localhost:3000")
public class EspelhoPontoController {

    @Autowired
    private EspelhoPontoService espelhoPontoService;

    @GetMapping
    public ResponseEntity<?> getEspelhoPonto(
            @RequestParam Long funcionarioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {

        if (funcionarioId == null || funcionarioId <= 0) {
            return ResponseEntity.badRequest().body("Funcionário inválido.");
        }

        if (dataFim.isBefore(dataInicio)) {
            return ResponseEntity.badRequest().body("A data fim deve ser maior ou igual à data início.");
        }

        try {
            List<EspelhoPontoDTO> espelho = espelhoPontoService.calcularEspelho(funcionarioId, dataInicio, dataFim);
            if (espelho.isEmpty()) {
                return ResponseEntity.ok(List.of());
            }
            return ResponseEntity.ok(espelho);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao buscar espelho de ponto: " + e.getMessage());
        }
    }
}

