import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { calculateCredit } from '../services/creditoChemes'
import { compareAllCards } from '../services/cardCalculator'

export default function FinancePage(){
  const loc:any = useLocation()
  const p = loc.state?.product
  const navigate = useNavigate()
  if(!p) return <div>No hay producto seleccionado</div>

  const cash = Number(p.LISTA_2 ?? 0)
  const credit = calculateCredit(cash, { term:12, delivery:'con', protectionYears:0 })
  const cards = compareAllCards(p, 12)

  return (
    <div>
      <div className="card">
        <div className="product-code">{p.CODIGO} — {p.DESCRIPCION}</div>
        <div>Contado: {cash}</div>
        <div>Financiado total: {credit.totalFinanced.toFixed(2)}</div>
        <div>Cuota mensual: {credit.monthlyPayment.toFixed(2)}</div>
        <div style={{marginTop:8}}>
          <button className="btn" onClick={()=>navigate('/compare', { state: { product: p } })}>Comparar tarjetas</button>
        </div>
      </div>

      <div className="card">
        <h4>Ejemplo: Top 3 tarjetas</h4>
        {cards.slice(0,3).map(c => (
          <div key={c.id} className="list-item">
            <div>{c.name} — Total: {c.totalFinanced.toFixed(2)} — Cuota: {c.monthlyPayment.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
