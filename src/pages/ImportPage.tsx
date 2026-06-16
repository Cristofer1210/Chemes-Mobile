import React, { useState } from 'react'
import { importXLSXFromFile } from '../services/xlsxImporter'
import { useProductsStore } from '../store/useStore'

export default function ImportPage(){
  const [count, setCount] = useState<number | null>(null)
  const store = useProductsStore()

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.currentTarget.files?.[0]
    if (!f) return
    try{
      const { items } = await importXLSXFromFile(f)
      console.log('Cantidad:', items.length)
      console.log('Primer producto:', items[0])
      await store.importAndSave(items)
      setCount(items.length)
      console.log(`Importados ${items.length} items`)
    }catch(err:any){
      console.error(err)
      console.error('Error importando:', err.message || String(err))
    }
  }

  return (
    <div>
      <div className="card">
        <h3>Importar Excel</h3>
        <input type="file" accept=".xlsx,.xls,.csv" onChange={onFile} />
        {count !== null && <div style={{marginTop:8}}>Registros importados: {count}</div>}
      </div>
    </div>
  )
}
