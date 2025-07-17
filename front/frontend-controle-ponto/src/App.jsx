import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Funcionarios from './pages/Funcionarios';
import FormularioFuncionario from './components/FormularioFuncionario';
import EditarFuncionario from './components/EditarFuncionario';
import ImportarAFD from './pages/ImportarAFD';
import Espelho from './pages/Espelho';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Funcionarios />} />
        <Route path="/funcionarios/novo" element={<FormularioFuncionario />} />
        <Route path="/funcionarios/:id/editar" element={<EditarFuncionario />} />
        <Route path="/afd" element={<ImportarAFD />} />
        <Route path="/espelhoponto" element={<Espelho />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;