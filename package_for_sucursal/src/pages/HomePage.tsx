import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProductsStore } from '../store/useStore'

export default function HomePage(){
  const navigate = useNavigate()
  const products = useProductsStore(s => s.products)

  return (
    <div>
      <div className="card">
        <h2 className="large">Chemes Mobile (Web)</h2>
        <div style={{marginTop:8}}>
          <button className="btn" onClick={() => navigate('/search')}>Buscar producto</button>
          <Link to="/import" style={{marginLeft:12}}>Importar Excel</Link>
        </div>
      </div>

      <div className="card">
        <h3>Productos recientes</h3>
        {products.length === 0 ? <div>No hay productos. Importa uno.</div> : (
          <div>
            {products.slice(0,10).map(p => (
              <div key={p.CODIGO} className="list-item">
                <div className="product-code">{p.CODIGO} — {p.DESCRIPCION}</div>
                <div>Precio: {p.LISTA_2 ?? 0} — Stock: {p.SALDO ?? 0}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
