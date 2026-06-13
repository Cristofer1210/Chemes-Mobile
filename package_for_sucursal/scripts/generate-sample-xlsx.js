const XLSX = require('xlsx');
const fs = require('fs');

function generate(n=2000){
  const data = [];
  for(let i=1;i<=n;i++){
    data.push({
      CODIGO: 'P'+String(i).padStart(6,'0'),
      DESCRIPCION: 'Producto de prueba ' + i,
      DESC_ADICIONAL: 'Extra ' + i,
      RUBRO: 'Rubro'+(i%10),
      SUB_RUBRO: 'Sub'+(i%5),
      SUCURSAL: 'Central',
      SALDO: Math.floor(Math.random()*100),
      DEPOSITO: 'D'+(i%3),
      PENDIENTE: 0,
      LISTA_1: (100 + i%50),
      LISTA_2: (90 + i%50),
      LISTA_3: (95 + i%50),
      LISTA_4: (110 + i%50),
      LISTA_6: (130 + i%50)
    })
  }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'sample_products.xlsx');
  console.log('sample_products.xlsx written, records=', n);
}

generate(2000);
