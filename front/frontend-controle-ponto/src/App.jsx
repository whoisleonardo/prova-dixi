import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Funcionarios from './pages/Funcionarios';
import FormularioFuncionario from './components/FormularioFuncionario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route path="/funcionarios/novo" element={<FormularioFuncionario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;