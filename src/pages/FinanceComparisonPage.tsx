import React from 'react'
import { useLocation } from 'react-router-dom'
import { AVAILABLE_TERMS } from '../services/creditoChemes'
import { compareAllCards } from '../services/cardCalculator'

export default function FinanceComparisonPage(){
  const loc:any = useLocation()
  const p = loc.state?.product
  if(!p) return <div>No hay producto seleccionado</div>

  const terms = AVAILABLE_TERMS

  return (
    <div>
      <div className="card">
        <h3>Comparador - {p.CODIGO}</h3>
        {terms.map(t => (
          <div key={t} className="card">
            <h4>{t} meses</h4>
            {compareAllCards(p, t).map(c => (
              <div key={c.id} className="list-item">
                <div>{c.name}: Total {c.totalFinanced.toFixed(2)} — Cuota {c.monthlyPayment.toFixed(2)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
