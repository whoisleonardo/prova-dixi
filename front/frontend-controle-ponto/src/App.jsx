import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Funcionarios from './pages/Funcionarios';
import FormularioFuncionario from './components/FormularioFuncionario';
import EditarFuncionario from './components/EditarFuncionario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Funcionarios />} />
        <Route path="/funcionarios/novo" element={<FormularioFuncionario />} />
        <Route path="/funcionarios/:id/editar" element={<EditarFuncionario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;