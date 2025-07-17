import React, { useState } from 'react';
import '../styles/ListaFuncionarios.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 

const initialFilters = {
  name: '',
  cpf: '',
  pis: '',
  registration: '',
  admissionDate: '',
};

export default function ListaFuncionario({ employees, onEdit, onSearch, onAdd }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 8;

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    onSearch(filters);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(employees.length / employeesPerPage);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="importafd-layout">
      <Sidebar />

      <main className="importafd-main">
        <h1 className="page-title">Funcionário</h1>
        <div className="employee-list-container">
          <div className="filters">
            {/* Filtros */}
            {['name', 'cpf', 'pis', 'registration', 'admissionDate'].map((field) => (
              <div className="filter-field" key={field}>
                <label htmlFor={field}>
                  {{
                    name: 'Nome do Funcionário',
                    cpf: 'CPF',
                    pis: 'PIS',
                    registration: 'Matrícula',
                    admissionDate: 'Data de Admissão'
                  }[field]}
                </label>
                <input
                  id={field}
                  name={field}
                  placeholder={{
                    name: 'Nome do Funcionário',
                    cpf: '000.000.000-00',
                    pis: '000.00000.00-0',
                    registration: 'Matrícula',
                    admissionDate: '00/00/0000'
                  }[field]}
                  value={filters[field]}
                  onChange={handleChange}
                  maxLength={field === 'cpf' || field === 'pis' ? 14 : field === 'admissionDate' ? 10 : undefined}
                />
              </div>
            ))}
            <button onClick={handleSearch}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
              </svg>
              Pesquisar
            </button>
            <button onClick={onAdd}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20">
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
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
              {currentEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6}>Nenhum funcionário encontrado.</td>
                </tr>
              ) : (
                currentEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <button onClick={() => navigate(`/funcionarios/${emp.id}/editar`)} title="Editar funcionário">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18">
                          <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
                        </svg>
                      </button>
                    </td>
                    <td>{emp.nomeCompleto}</td>
                    <td>{emp.cpf}</td>
                    <td>{emp.pis}</td>
                    <td>{emp.matricula}</td>
                    <td>{emp.dataAdmissao ? new Date(emp.dataAdmissao).toLocaleDateString('pt-BR') : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={handlePrev} className={currentPage === 1 ? 'disabled' : ''}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="20" height="20">
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>
              </svg>
            </button>
            <span className="page-number">{currentPage}</span>
            <button onClick={handleNext} className={currentPage === totalPages ? 'disabled' : ''}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="20" height="20">
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
