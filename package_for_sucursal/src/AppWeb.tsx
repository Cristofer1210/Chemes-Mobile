import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ImportPage from './pages/ImportPage'
import SearchPage from './pages/SearchPage'
import FinancePage from './pages/FinancePage'
import FinanceComparisonPage from './pages/FinanceComparisonPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <Link to="/" className="brand">Chemes</Link>
          <nav>
            <Link to="/search">Buscar</Link>
            <Link to="/import">Importar</Link>
          </nav>
        </header>
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/compare" element={<FinanceComparisonPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
