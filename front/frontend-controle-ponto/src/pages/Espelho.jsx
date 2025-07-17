import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Espelho.css';

export default function EspelhoPonto() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioId, setFuncionarioId] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [espelho, setEspelho] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/funcionarios')
      .then(res => res.json())
      .then(data => setFuncionarios(data))
      .catch(() => setErro('Erro ao carregar funcionários.'));
  }, []);

  const validarFormulario = () => {
    if (!funcionarioId) {
      setErro('Selecione um funcionário.');
      return false;
    }
    if (!dataInicio || !dataFim) {
      setErro('Datas inicial e final são obrigatórias.');
      return false;
    }
    if (dataFim < dataInicio) {
      setErro('Data final deve ser maior ou igual à data inicial.');
      return false;
    }
    setErro(null);
    return true;
  };

  const handleBuscar = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    setEspelho([]);
    setErro(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/espelho-ponto?funcionarioId=${funcionarioId}&dataInicio=${dataInicio}&dataFim=${dataFim}`
      );

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Erro ao buscar espelho de ponto');
      }

      const data = await response.json();
      setEspelho(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="espelho-layout">
      <Sidebar />

      <main className="espelho-main">
        <h1 className="page-title">Espelho de Ponto</h1>

        <section className="filtros">
          <label>
            Funcionário:
            <select
              value={funcionarioId}
              onChange={(e) => setFuncionarioId(e.target.value)}
            >
              <option value="">-- Selecione --</option>
              {funcionarios.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nomeCompleto}
                </option>
              ))}
            </select>
          </label>

          <label>
            Data Início:
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </label>

          <label>
            Data Fim:
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </label>

          <button onClick={handleBuscar} disabled={loading}>
            {loading ? 'Carregando...' : 'Pesquisar'}
          </button>
        </section>

        {erro && <div className="erro-msg">{erro}</div>}

        {espelho.length > 0 && (
          <section className="resultado-espelho">
<table className="espelho-table">
  <thead>
    <tr>
      <th>Data</th>
      <th>Horas Trabalhadas</th>
      <th>Horas Normais</th>
      <th>Horas Extras</th>
      <th>Faltas</th>
      <th>Atrasos</th>
      <th>Adicional Noturno</th>
    </tr>
  </thead>
  <tbody>
    {espelho.map((item, index) => {
      const dataFormatada = new Date(item.data).toLocaleDateString('pt-BR');

      const formatarHora = (valor) => {
        const horas = Math.floor(valor);
        const minutos = Math.round((valor - horas) * 60);
        return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
      };

      const marcacoesFormatadas = (item.marcacoes || [])
        .map(h => h.padStart(5, '0')) 
        .join(', ');

      return (
        <tr key={`${item.funcionarioId}-${item.data}-${index}`}>
          <td>{dataFormatada}</td>
          <td>{formatarHora(item.horasTrabalhadas || 0)}</td>
          <td>{formatarHora(item.horasNormais || 0)}</td>
          <td>{formatarHora(item.horasExtras || 0)}</td>
          <td>{formatarHora(item.faltas || 0)}</td>
          <td>{formatarHora(item.atrasos || 0)}</td>
          <td>{formatarHora(item.adicionalNoturno || 0)}</td>
        </tr>
      );
    })}
  </tbody>
</table>
</section>
        )}
        {espelho.length === 0 && !loading && !erro && (
          <p>Nenhum dado encontrado para os filtros selecionados.</p>
        )}
      </main>
    </div>
  );
}
