import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/FormularioFuncionario.css';

function maskCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
    .slice(0, 14);
}

function maskPIS(value) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{5})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{5})\.(\d{2})(\d)/, '$1.$2.$3-$4')
    .slice(0, 14);
}

export default function EditarFuncionario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    cpf: '',
    pis: '',
    registration: '',
    admissionDate: '',
    active: true,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/funcionarios/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.nomeCompleto || '',
          cpf: data.cpf || '',
          pis: data.pis || '',
          registration: data.matricula || '',
          admissionDate: data.dataAdmissao || '',
          active: data.situacaoCadastro === 'Ativo',
        });
        setLoading(false);
      })
      .catch(() => {
        alert('Erro ao buscar funcionário!');
        navigate('/funcionarios');
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    if (name === 'cpf') newValue = maskCPF(value);
    if (name === 'pis') newValue = maskPIS(value);

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : newValue,
    }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSwitch = () => {
    setForm((prev) => ({
      ...prev,
      active: !prev.active,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = true;
    if (!form.registration.trim()) newErrors.registration = true;
    if (!form.admissionDate.trim()) newErrors.admissionDate = true;
    if (!form.cpf.trim() && !form.pis.trim()) {
      newErrors.cpf = true;
      newErrors.pis = true;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      nomeCompleto: form.name,
      cpf: form.cpf,
      pis: form.pis,
      matricula: form.registration,
      dataAdmissao: form.admissionDate,
      situacaoCadastro: form.active ? 'Ativo' : 'Inativo',
    };

    try {
      const response = await fetch(`http://localhost:8080/api/funcionarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        alert('Erro ao editar funcionário!');
      }
    } catch (error) {
      alert('Erro de conexão com o backend!');
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Carregando funcionário...</p>;

  return (
    <div className="form-funcionario-container">
      <h1 className="form-title">Editar Funcionário</h1>

      {success && (
        <div className="success-message">
          Sucesso ao editar
          <span className="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="white"
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
              />
            </svg>
          </span>
        </div>
      )}

      <form className="form-funcionario" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field full">
            <label>Nome do Funcionário<span className="required">*</span></label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'error-input' : ''}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>CPF</label>
            <input
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              maxLength={14}
              className={errors.cpf ? 'error-input' : ''}
            />
          </div>
          <span className="ou">ou</span>
          <div className="form-field">
            <label>PIS</label>
            <input
              name="pis"
              value={form.pis}
              onChange={handleChange}
              maxLength={14}
              className={errors.pis ? 'error-input' : ''}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Matrícula<span className="required">*</span></label>
            <input
              name="registration"
              value={form.registration}
              onChange={handleChange}
              className={errors.registration ? 'error-input' : ''}
            />
          </div>
          <div className="form-field">
            <label>Data de Admissão<span className="required">*</span></label>
            <input
              type="date"
              name="admissionDate"
              value={form.admissionDate}
              onChange={handleChange}
              className={errors.admissionDate ? 'error-input' : ''}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Situação Cadastro</label>
            <div
              className="switch-field"
              onClick={handleSwitch}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleSwitch()}
              role="button"
              aria-pressed={form.active}
            >
              <div className={`switch-toggle${form.active ? ' active' : ''}`}>
                <div className="switch-knob" />
              </div>
              <span className={`switch-text${form.active ? '' : ' inactive'}`}>
                {form.active ? 'ATIVO' : 'INATIVO'}
              </span>
            </div>
          </div>
          <div className="form-field" style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            {errors.cpf && errors.pis && (
              <div className="global-error">
                <span style={{ color: '#e53935', fontWeight: 600 }}>
                  Campos obrigatórios <span className="required">*</span><br />
                  Preencha CPF ou PIS.
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="cancel" onClick={() => navigate('/')}>
            Cancelar
          </button>
          <button type="submit" className="save">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
