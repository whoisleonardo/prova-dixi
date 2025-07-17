package com.controleponto.service;

import com.controleponto.dto.MarcacaoPontoDTO;
import com.controleponto.dto.ResultadoImportacaoAFDDTO;
import com.controleponto.model.Funcionario;
import com.controleponto.model.MarcacaoPonto;
import com.controleponto.repository.FuncionarioRepository;
import com.controleponto.repository.MarcacaoPontoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AfdService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private MarcacaoPontoRepository marcacaoPontoRepository;

    private final DateTimeFormatter isoOffsetFormatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
    private final DateTimeFormatter dataFormatter1510 = DateTimeFormatter.ofPattern("ddMMyyyy");
    private final DateTimeFormatter horaFormatter1510 = DateTimeFormatter.ofPattern("HHmm");

    public ResultadoImportacaoAFDDTO processarAFD(MultipartFile file) throws IOException {
        List<MarcacaoPontoDTO> apropriadas = new ArrayList<>();
        List<MarcacaoPontoDTO> naoApropriadas = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String linha;
            int linhaNum = 0;
            while ((linha = br.readLine()) != null) {
                linhaNum++;

                if (linha.length() < 22) continue;

                try {
                    if (linha.matches("^\\d{9}3.*") && !linha.contains("T")) {
                        processarLinhaLayout1510(linha, apropriadas, naoApropriadas, file.getOriginalFilename());
                    } else if (linha.matches("^\\d{9}3.*T.*") || linha.contains("T") || linha.contains("-03")) {
                        processarLinhaLayout671(linha, apropriadas, naoApropriadas, file.getOriginalFilename());
                    }
                } catch (Exception e) {
                }
            }
        }

        ResultadoImportacaoAFDDTO resultado = new ResultadoImportacaoAFDDTO();
        resultado.setApropriadas(apropriadas);
        resultado.setNaoApropriadas(naoApropriadas);
        return resultado;
    }

    private void processarLinhaLayout1510(String linha, List<MarcacaoPontoDTO> apropriadas, List<MarcacaoPontoDTO> naoApropriadas, String origemArquivo) {
        String dataStr = linha.substring(10, 18);
        String horaStr = linha.substring(18, 22);
        String identificador = linha.substring(22).replaceAll("\\D", "").trim();

        LocalDate data = LocalDate.parse(dataStr, dataFormatter1510);
        LocalTime hora = LocalTime.parse(horaStr, horaFormatter1510);

        processarMarcacao(data, hora, identificador, identificador, "3", origemArquivo, apropriadas, naoApropriadas);
    }

    private void processarLinhaLayout671(String linha, List<MarcacaoPontoDTO> apropriadas, List<MarcacaoPontoDTO> naoApropriadas, String origemArquivo) {
        String tipoRegistro = linha.substring(9, 10);
        String dataHoraStr = linha.substring(10, 35);

        if (dataHoraStr.length() == 25 && dataHoraStr.charAt(22) != ':') {
            dataHoraStr = dataHoraStr.substring(0, 22) + ":" + dataHoraStr.substring(22);
        }

        OffsetDateTime odt = OffsetDateTime.parse(dataHoraStr, isoOffsetFormatter);
        LocalDate data = odt.toLocalDate();
        LocalTime hora = odt.toLocalTime();

        String pis = linha.substring(35, 46).replaceAll("\\D", "").trim();
        String cpf = (linha.length() >= 57) ? linha.substring(46, 57).replaceAll("\\D", "").trim() : pis;

        processarMarcacao(data, hora, pis, cpf, tipoRegistro, origemArquivo, apropriadas, naoApropriadas);
    }

    private void processarMarcacao(LocalDate data, LocalTime hora, String pis, String cpf,
                                   String tipoRegistro, String origemArquivo,
                                   List<MarcacaoPontoDTO> apropriadas, List<MarcacaoPontoDTO> naoApropriadas) {

        MarcacaoPontoDTO dto = new MarcacaoPontoDTO();
        dto.setData(data.toString());
        dto.setHora(hora.toString());
        dto.setPis(pis);
        dto.setCpf(cpf);

        Optional<Funcionario> funcionarioOpt = funcionarioRepository.findByPis(pis)
                .stream().filter(f -> "Ativo".equalsIgnoreCase(f.getSituacaoCadastro())).findFirst();

        if (!funcionarioOpt.isPresent()) {
            funcionarioOpt = funcionarioRepository.findByCpf(cpf)
                    .stream().filter(f -> "Ativo".equalsIgnoreCase(f.getSituacaoCadastro())).findFirst();
        }

        if (funcionarioOpt.isPresent()) {
            Funcionario funcionario = funcionarioOpt.get();

            MarcacaoPonto mp = new MarcacaoPonto();
            mp.setData(data);
            mp.setHora(hora);
            mp.setPis(pis);
            mp.setCpf(cpf);
            mp.setFuncionario(funcionario);
            mp.setApropriada(true);
            mp.setMotivoRejeicao(null);
            mp.setTipoRegistro(tipoRegistro);
            mp.setOrigemArquivo(origemArquivo);
            marcacaoPontoRepository.save(mp);

            dto.setApropriada(true);
            apropriadas.add(dto);
        } else {
            dto.setApropriada(false);
            dto.setMotivo("Funcionário com PIS ou CPF não encontrado ou inativo");
            naoApropriadas.add(dto);
        }
    }
}
