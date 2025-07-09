import React, { useEffect, useState } from 'react';
import ListaFuncionario from '../components/ListaFuncionario';
import { useNavigate } from 'react-router-dom';

export default function Funcionarios() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/funcionarios')
      .then((res) => res.json())
      .then(setEmployees)
      .catch((err) => console.error('Erro ao buscar funcionários:', err));
  }, []);

  const handleSearch = (filters) => {
    const query = new URLSearchParams();

    if (filters.name) query.append('nome', filters.name);
    if (filters.cpf) query.append('cpf', filters.cpf);
    if (filters.pis) query.append('pis', filters.pis);
    if (filters.registration) query.append('matricula', filters.registration);

    fetch(`http://localhost:8080/api/funcionarios/buscar?${query.toString()}`)
      .then((res) => res.json())
      .then(setEmployees)
      .catch((err) => console.error('Erro ao buscar:', err));
  };

  const handleEdit = (emp) => {
    alert('Editar: ' + emp.nomeCompleto);
  };

  const handleAdd = () => {
    navigate('/funcionarios/novo');
  };

  return (
    <ListaFuncionario
      employees={employees}
      onEdit={handleEdit}
      onSearch={handleSearch}
      onAdd={handleAdd}
    />
  );
}
