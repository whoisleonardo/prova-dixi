package com.controleponto.controller;

import com.controleponto.dto.ResultadoImportacaoAFDDTO;
import com.controleponto.service.AfdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/afd")
@CrossOrigin(origins = "http://localhost:3000")
public class AFDController {

    @Autowired
    private AfdService afdService;

    @PostMapping("/importar")
    public ResponseEntity<?> importarAFD(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Arquivo AFD não informado");
        }

        try {
            ResultadoImportacaoAFDDTO resultado = afdService.processarAFD(file);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar arquivo AFD: " + e.getMessage());
        }
    }
}

