const puppeteer = require('puppeteer');
const path = require('path');
const XLSX = require('xlsx');

async function run(){
  const url = process.argv[2] || process.env.URL || 'http://localhost:5173/';
  console.log('Opening', url);
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  await page.goto(url, { waitUntil: 'networkidle2' });

  // go to import
  await page.click('a[href="/import"]');
  await page.waitForSelector('input[type=file]');
  const input = await page.$('input[type=file]');
  const filePath = path.resolve(__dirname, '..', 'sample_products.xlsx');
  console.log('Uploading', filePath);
  const [dialogPromise] = [new Promise(res=> page.once('dialog', res))];
  await input.uploadFile(filePath);
  const dialog = await dialogPromise;
  console.log('Dialog message:', dialog.message());
  await dialog.accept();

  // small wait for storage updates
  await page.waitForTimeout(1200);

  // dump localStorage key
  const dump = await page.evaluate(()=>{
    const STORAGE_KEY = 'chemes_products_v1';
    const raw = localStorage.getItem(STORAGE_KEY) || '[]';
    let items = [];
    try { items = JSON.parse(raw); } catch(e){ items = []; }
    return { first: items[0] || null, length: items.length, keys: Object.keys(items[0] || {}) };
  });

  console.log('Cantidad en localStorage:', dump.length);
  console.log('Primer registro (keys):', dump.keys);
  console.log('Primer registro completo:', JSON.stringify(dump.first, null, 2));
  console.log('items[0]:', JSON.stringify(dump.first));
  console.log('items.length:', dump.length);

  // Read XLSX headers from disk
  try{
    const wb = XLSX.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json(sheet, {defval:null, blankrows:false});
    const headers = Object.keys(raw[0] || {});
    const normalize = h => h.toString().trim().toUpperCase().replace(/\s+/g,'_').replace(/[^A-Z0-9_]/g,'');
    console.log('XLSX original headers sample:', headers.slice(0,30));
    console.log('XLSX normalized headers sample:', headers.map(normalize).slice(0,30));
  } catch(e){ console.error('XLSX read error', e && e.message ? e.message : e); }

  // search first product via UI
  if(dump.first && dump.first.CODIGO){
    const code = dump.first.CODIGO;
    console.log('Searching for first CODIGO via UI:', code);
    await page.click('a[href="/search"]');
    await page.waitForSelector('input[placeholder]');
    await page.type('input[placeholder]', code);
    await page.click('button.btn');
    await page.waitForSelector('.list-item');
    const resultsHtml = await page.$$eval('.list-item', els => els.map(e=>e.innerText));
    console.log('UI search results for first code (count):', resultsHtml.length);
    console.log('UI search first result:', resultsHtml[0]);
  } else {
    console.log('No CODIGO found in first item to search.');
  }

  await browser.close();
}

run().then(()=>console.log('DEBUG done')).catch(e=>{ console.error('DEBUG error', e); process.exit(1); });
