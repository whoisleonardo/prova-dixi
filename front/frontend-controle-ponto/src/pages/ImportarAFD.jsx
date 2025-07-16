import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import '../styles/ImportarAFD.css';

export default function ImportarAFD() {
  const [arquivo, setArquivo] = useState(null);
  const [importando, setImportando] = useState(false);
  const [erro, setErro] = useState(null);
  const [resultado, setResultado] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setArquivo(e.target.files[0]);
  };

  const handleImportar = async () => {
    if (!arquivo) return;

    setImportando(true);
    setErro(null);
    setResultado(null);

    const formData = new FormData();
    formData.append('file', arquivo);

    try {
      const response = await fetch('http://localhost:8080/api/afd/importar', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Erro ao importar');
      }

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setImportando(false);
    }
  };

  return (
    <div className="importafd-layout">
      <Sidebar />

      <main className="importafd-main">
        <h1 className="page-title">Importação AFD</h1>

        <div className="employee-list-container importafd-container">
          {/* Seção Seleção de Arquivo e Botões */}
          <div className="importafd-file-section">
            <label htmlFor="fileUpload" className="importafd-file-label">
              Clique para selecionar um arquivo
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg>
            </label>
            <input
              type="file"
              id="fileUpload"
              accept=".txt"
              onChange={handleFileChange}
              className="importafd-file-input"
            />

            <button
              onClick={handleImportar}
              disabled={importando || !arquivo}
              className="importafd-import-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
              {importando ? 'Importando...' : 'Importar'}
            </button>
          </div>

          {erro && <div className="importafd-error"><strong>Erro:</strong> {erro}</div>}

          {resultado && (
            <>
              <div className="importafd-result">
                <p className="importafd-success">
                  <strong>Nº Apropriados:</strong> {resultado.apropriadas.length}
                </p>
                <p className="importafd-failure">
                  <strong>Nº Não Apropriados:</strong> {resultado.naoApropriadas.length}
                </p>
              </div>

              {resultado.naoApropriadas.length > 0 && (
                <section className="importafd-nao-importadas">
                  <h3>Marcações Não Importadas</h3>
                  <div className="importafd-scroll">
                    <table className="employee-table importafd-table">
                      <thead>
                        <tr>
                          <th>Dados da Marcação</th>
                          <th>Motivo do Erro</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultado.naoApropriadas.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.data} {item.hora}</td>
                            <td>{item.motivo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
