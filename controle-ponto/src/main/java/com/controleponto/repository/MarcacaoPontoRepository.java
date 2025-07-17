package com.controleponto.repository;

import com.controleponto.model.MarcacaoPonto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MarcacaoPontoRepository extends JpaRepository<MarcacaoPonto, Long> {

    List<MarcacaoPonto> findByFuncionarioId(Long funcionarioId);

    List<MarcacaoPonto> findByFuncionarioIdAndDataBetween(Long funcionarioId, LocalDate start, LocalDate end);

    List<MarcacaoPonto> findByData(LocalDate data);

    List<MarcacaoPonto> findByApropriada(boolean apropriada);

    List<MarcacaoPonto> findByFuncionarioIdAndDataBetweenAndApropriadaTrue(Long funcionarioId, LocalDate dataInicio, LocalDate dataFim);

}
