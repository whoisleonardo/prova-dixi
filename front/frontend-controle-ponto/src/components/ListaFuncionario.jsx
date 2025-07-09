import React, { useState } from 'react';
import '../styles/ListaFuncionarios.css';

const initialFilters = {
  name: '',
  cpf: '',
  pis: '',
  registration: '',
  admissionDate: '',
};

export default function ListaFuncionario({ employees, onEdit, onSearch, onAdd }) {
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <>
      <h1 className="page-title">Funcionário</h1>
      <div className="employee-list-container">
        <div className="filters">
          <div className="filter-field">
            <label htmlFor="name">Nome do Funcionário</label>
            <input
              id="name"
              name="name"
              placeholder="Nome do Funcionário"
              value={filters.name}
              onChange={handleChange}
            />
          </div>
          <div className="filter-field">
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              name="cpf"
              placeholder="000.000.000-00"
              value={filters.cpf}
              onChange={handleChange}
              maxLength={14}
            />
          </div>
          <div className="filter-field">
            <label htmlFor="pis">PIS</label>
            <input
              id="pis"
              name="pis"
              placeholder="000.00000.00-0"
              value={filters.pis}
              onChange={handleChange}
              maxLength={14}
            />
          </div>
          <div className="filter-field">
            <label htmlFor="registration">Matrícula</label>
            <input
              id="registration"
              name="registration"
              placeholder="Matrícula"
              value={filters.registration}
              onChange={handleChange}
            />
          </div>
          <div className="filter-field">
            <label htmlFor="admissionDate">Data de Admissão</label>
            <input
              id="admissionDate"
              name="admissionDate"
              placeholder="00/00/0000"
              value={filters.admissionDate}
              onChange={handleChange}
              maxLength={10}
            />
          </div>
          <button onClick={handleSearch}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="9" r="7" />
              <line x1="16" y1="16" x2="13.5" y2="13.5" />
            </svg>
            Pesquisar
          </button>
          <button onClick={onAdd}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="10" y1="4" x2="10" y2="16" />
              <line x1="4" y1="10" x2="16" y2="10" />
            </svg>
            Adicionar
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Editar</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>PIS</th>
              <th>Matrícula</th>
              <th>Data de admissão</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr>
                <td colSpan={6}>Nenhum funcionário encontrado.</td>
              </tr>
            )}
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <button onClick={() => onEdit(emp)} title="Editar funcionário">
                    <span role="img" aria-label="editar">✏️</span>
                  </button>
                </td>
                <td>{emp.nomeCompleto}</td>
                <td>{emp.cpf}</td>
                <td>{emp.pis}</td>
                <td>{emp.matricula}</td>
                <td>{emp.dataAdmissao ? new Date(emp.dataAdmissao).toLocaleDateString('pt-BR') : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
