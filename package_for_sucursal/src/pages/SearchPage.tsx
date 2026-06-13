import React, { useState } from 'react'
import { searchProducts } from '../services/sqliteService'
import { useNavigate } from 'react-router-dom'
import { Product } from '../models/Product'

export default function SearchPage(){
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const navigate = useNavigate()

  const handleSearch = async () => {
    if (!q || q.trim().length === 0) return setResults([])
    const r = await searchProducts(q.trim())
    setResults(r)
  }

  return (
    <div>
      <div className="card">
        <input placeholder="Buscar por código o descripción" value={q} onChange={e=>setQ(e.target.value)} style={{padding:8,width:'100%'}} />
        <div style={{height:12}} />
        <button className="btn" onClick={handleSearch}>Buscar</button>
      </div>

      <div className="card">
        <h4>Resultados: {results.length}</h4>
        {results.map(p => (
          <div key={p.CODIGO} className="list-item" onClick={() => navigate('/finance', { state: { product: p } })}>
            <div className="product-code">{p.CODIGO} — {p.DESCRIPCION}</div>
            <div>Precio: {p.LISTA_2 ?? 0} — Stock: {p.SALDO ?? 0}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
