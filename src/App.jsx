import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VariablesPage from './pages/VariablesPage';
import VariableDetailPage from './pages/VariableDetailPage';
import './App.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="variables" element={<VariablesPage />} />
          <Route path="variables/:variableId" element={<VariableDetailPage />} />
          <Route path="*" element={<p>Такої вкладки немає.</p>} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
