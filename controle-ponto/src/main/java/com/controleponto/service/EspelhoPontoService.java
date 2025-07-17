package com.controleponto.service;

import com.controleponto.dto.EspelhoPontoDTO;
import com.controleponto.model.Funcionario;
import com.controleponto.model.MarcacaoPonto;
import com.controleponto.repository.FuncionarioRepository;
import com.controleponto.repository.MarcacaoPontoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EspelhoPontoService {

    @Autowired
    private MarcacaoPontoRepository marcacaoPontoRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    private final Map<DayOfWeek, List<IntervaloHorario>> horariosPorDiaSemana = Map.of(
            DayOfWeek.MONDAY, Arrays.asList(
                    new IntervaloHorario(LocalTime.of(8, 0), LocalTime.of(12, 0)),
                    new IntervaloHorario(LocalTime.of(13, 0), LocalTime.of(17, 0))
            ),
            DayOfWeek.TUESDAY, Collections.singletonList(
                    new IntervaloHorario(LocalTime.of(8, 0), LocalTime.of(16, 0))
            ),
            DayOfWeek.WEDNESDAY, Arrays.asList(
                    new IntervaloHorario(LocalTime.of(13, 0), LocalTime.of(17, 0)),
                    new IntervaloHorario(LocalTime.of(19, 0), LocalTime.of(21, 0)),
                    new IntervaloHorario(LocalTime.of(23, 30), LocalTime.of(23, 59, 59, 999_999_999)),
                    new IntervaloHorario(LocalTime.MIDNIGHT, LocalTime.of(2, 0))
            ),
            DayOfWeek.THURSDAY, Collections.emptyList()
    );

    public List<EspelhoPontoDTO> calcularEspelho(Long funcionarioId, LocalDate dataInicio, LocalDate dataFim) {
        List<MarcacaoPonto> marcacoes = marcacaoPontoRepository
                .findByFuncionarioIdAndDataBetweenAndApropriadaTrue(funcionarioId, dataInicio, dataFim);

        Map<LocalDate, List<MarcacaoPonto>> marcacoesPorDia = marcacoes.stream()
                .collect(Collectors.groupingBy(MarcacaoPonto::getData));

        List<EspelhoPontoDTO> resultado = new ArrayList<>();

        Optional<Funcionario> funcionarioOpt = funcionarioRepository.findById(funcionarioId);
        if (funcionarioOpt.isEmpty()) {
            return resultado;
        }

        Funcionario funcionario = funcionarioOpt.get();

        for (LocalDate data = dataInicio; !data.isAfter(dataFim); data = data.plusDays(1)) {
            List<MarcacaoPonto> marcacoesDoDia = marcacoesPorDia.getOrDefault(data, Collections.emptyList());
            DayOfWeek diaSemana = data.getDayOfWeek();

            List<IntervaloHorario> horariosDia = horariosPorDiaSemana.getOrDefault(diaSemana, Collections.emptyList());

            EspelhoPontoDTO dto = new EspelhoPontoDTO();
            dto.setFuncionarioId(funcionario.getId());
            dto.setFuncionarioNome(funcionario.getNomeCompleto());
            dto.setData(data);

            dto.setHorasTrabalhadas(calcularHorasTrabalhadas(marcacoesDoDia));
            dto.setHorasNormais(calcularHorasNormais(marcacoesDoDia, horariosDia));
            dto.setHorasExtras(calcularHorasExtras(dto.getHorasTrabalhadas(), dto.getHorasNormais()));
            dto.setFaltas(calcularFaltas(horariosDia, dto.getHorasNormais()));
            dto.setAtrasos(calcularAtrasos(marcacoesDoDia, horariosDia));
            dto.setAdicionalNoturno(calcularAdicionalNoturno(marcacoesDoDia));

            resultado.add(dto);
        }

        return resultado;
    }

    private double calcularHorasTrabalhadas(List<MarcacaoPonto> marcacoes) {
        if (marcacoes.isEmpty()) return 0.0;

        List<LocalTime> horarios = marcacoes.stream()
                .map(MarcacaoPonto::getHora)
                .sorted()
                .collect(Collectors.toList());

        double totalHoras = 0.0;

        for (int i = 0; i < horarios.size() - 1; i += 2) {
            LocalTime entrada = horarios.get(i);
            LocalTime saida = horarios.get(i + 1);

            Duration intervalo = Duration.between(entrada, saida);
            if (!intervalo.isNegative() && !intervalo.isZero()) {
                totalHoras += intervalo.toMinutes() / 60.0;
            }
        }

        return totalHoras;
    }

    private double calcularHorasNormais(List<MarcacaoPonto> marcacoes, List<IntervaloHorario> horariosDia) {
        if (marcacoes.isEmpty() || horariosDia.isEmpty()) return 0.0;

        List<IntervaloHorario> intervalosTrabalhados = getIntervalosTrabalhados(marcacoes);

        double totalHorasNormais = 0.0;

        for (IntervaloHorario intervaloEsperado : horariosDia) {
            for (IntervaloHorario intervaloTrabalhado : intervalosTrabalhados) {
                totalHorasNormais += intervaloEsperado.intersecaoHoras(intervaloTrabalhado);
            }
        }

        return totalHorasNormais;
    }

    private double calcularHorasExtras(double horasTrabalhadas, double horasNormais) {
        double extras = horasTrabalhadas - horasNormais;
        return extras > 0 ? extras : 0;
    }

    private double calcularFaltas(List<IntervaloHorario> horariosDia, double horasNormais) {
        double horasEsperadas = 0.0;
        for (IntervaloHorario intervalo : horariosDia) {
            horasEsperadas += intervalo.getDuracaoHoras();
        }

        double faltas = horasEsperadas - horasNormais;
        return faltas > 0 ? faltas : 0;
    }

    private double calcularAtrasos(List<MarcacaoPonto> marcacoes, List<IntervaloHorario> horariosDia) {
        if (marcacoes.isEmpty() || horariosDia.isEmpty()) return 0.0;

        LocalTime primeiraEntrada = marcacoes.stream()
                .map(MarcacaoPonto::getHora)
                .min(LocalTime::compareTo)
                .orElse(null);

        LocalTime inicioEsperado = horariosDia.get(0).getInicio();

        if (primeiraEntrada == null || !primeiraEntrada.isAfter(inicioEsperado)) return 0.0;

        Duration atraso = Duration.between(inicioEsperado, primeiraEntrada);
        return atraso.toMinutes() / 60.0;
    }

    private double calcularAdicionalNoturno(List<MarcacaoPonto> marcacoes) {
        if (marcacoes.isEmpty()) return 0.0;

        List<IntervaloHorario> intervalosTrabalhados = getIntervalosTrabalhados(marcacoes);

        double adicional = 0.0;
        IntervaloHorario adicionalNoturnoPeriodo = new IntervaloHorario(LocalTime.of(22, 0), LocalTime.of(5, 0));

        for (IntervaloHorario intervalo : intervalosTrabalhados) {
            adicional += adicionalNoturnoPeriodo.intersecaoHoras(intervalo);
        }

        return adicional;
    }

    private List<IntervaloHorario> getIntervalosTrabalhados(List<MarcacaoPonto> marcacoes) {
        List<LocalTime> horarios = marcacoes.stream()
                .map(MarcacaoPonto::getHora)
                .sorted()
                .collect(Collectors.toList());

        List<IntervaloHorario> intervalos = new ArrayList<>();

        for (int i = 0; i < horarios.size() - 1; i += 2) {
            intervalos.add(new IntervaloHorario(horarios.get(i), horarios.get(i + 1)));
        }
        return intervalos;
    }

    private static class IntervaloHorario {
        private final LocalTime inicio;
        private final LocalTime fim;

        public IntervaloHorario(LocalTime inicio, LocalTime fim) {
            this.inicio = inicio;
            this.fim = fim;
        }

        public LocalTime getInicio() {
            return inicio;
        }

        public LocalTime getFim() {
            return fim;
        }

        public double getDuracaoHoras() {
            Duration d;
            if (fim.isAfter(inicio) || fim.equals(inicio)) {
                d = Duration.between(inicio, fim);
            } else {
                // Exemplo: intervalo passa da meia-noite
                d = Duration.between(inicio, LocalTime.MAX).plus(Duration.between(LocalTime.MIN, fim)).plusSeconds(1);
            }
            return d.toMinutes() / 60.0;
        }

        public double intersecaoHoras(IntervaloHorario outro) {
            LocalTime maxInicio = inicio.isAfter(outro.inicio) ? inicio : outro.inicio;
            LocalTime minFim = fim.isBefore(outro.fim) ? fim : outro.fim;

            if (minFim.equals(LocalTime.MIDNIGHT)) {
                minFim = LocalTime.of(23,59,59,999_999_999);
            }

            if (fim.isBefore(inicio)) {
                IntervaloHorario parte1 = new IntervaloHorario(inicio, LocalTime.MAX);
                IntervaloHorario parte2 = new IntervaloHorario(LocalTime.MIN, fim);

                return parte1.intersecaoHoras(outro) + parte2.intersecaoHoras(outro);
            }

            if (outro.fim.isBefore(outro.inicio)) {
                IntervaloHorario parte1 = new IntervaloHorario(outro.inicio, LocalTime.MAX);
                IntervaloHorario parte2 = new IntervaloHorario(LocalTime.MIN, outro.fim);

                return intersecaoHoras(parte1) + intersecaoHoras(parte2);
            }

            Duration duracao = Duration.between(maxInicio, minFim);
            return duracao.isNegative() ? 0.0 : duracao.toMinutes() / 60.0;
        }
    }
}
