import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function FormularioFuncionario({ onSave, onCancel, initialData = {} }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: initialData.name || '',
    cpf: initialData.cpf || '',
    pis: initialData.pis || '',
    registration: initialData.registration || '',
    admissionDate: initialData.admissionDate || '',
    active: initialData.active ?? true,
  });
  const [errors, setErrors] = useState({});
  const [showGlobalError, setShowGlobalError] = useState(false);

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
    setShowGlobalError(false);
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
      setShowGlobalError(true);
    } else {
      setShowGlobalError(false);
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const payload = {
      nomeCompleto: form.name,
      cpf: form.cpf,
      pis: form.pis,
      matricula: form.registration,
      dataAdmissao: form.admissionDate,
      situacaoCadastro: form.active ? 'Ativo' : 'Inativo',
    };

    try {
      const response = await fetch('http://localhost:8080/api/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate('/funcionarios');
      } else {
        alert('Erro ao salvar funcionário!');
      }
    } catch (error) {
      alert('Erro de conexão com o backend!');
    }
  };

  return (
    <div className="form-funcionario-container">
      <h1 className="form-title">Cadastro de Funcionário</h1>
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
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={handleChange}
              className={errors.cpf ? 'error-input' : ''}
              maxLength={14}
            />
          </div>
          <span className="ou">ou</span>
          <div className="form-field">
            <label>PIS</label>
            <input
              name="pis"
              placeholder="000.00000.00-0"
              value={form.pis}
              onChange={handleChange}
              className={errors.pis ? 'error-input' : ''}
              maxLength={14}
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
          <div className="form-field" style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            {showGlobalError && (
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
          <button type="button" className="cancel" onClick={() => navigate('/funcionarios')}>
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
