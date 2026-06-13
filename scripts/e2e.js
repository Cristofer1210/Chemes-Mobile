const puppeteer = require('puppeteer');
const path = require('path');

async function run(){
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  const url = process.argv[2] || process.env.URL || 'http://localhost:5173/';
  console.log('Opening', url);
  await page.goto(url, { waitUntil: 'networkidle2' });

  // go to import
  await page.click('a[href="/import"]');
  await page.waitForSelector('input[type=file]');
  const input = await page.$('input[type=file]');
  const filePath = path.resolve(__dirname, '..', 'sample_products.xlsx');
  console.log('Uploading', filePath);
  const [dialogPromise] = [new Promise(res=> page.once('dialog', res))];
  await input.uploadFile(filePath);
  // wait for alert
  const dialog = await dialogPromise;
  console.log('Dialog message:', dialog.message());
  await dialog.accept();

  // go to search
  await page.click('a[href="/search"]');
  await page.waitForSelector('input[placeholder]');

  // search by code
  const codeToSearch = 'P000100';
  await page.type('input[placeholder]', codeToSearch);
  const t0 = Date.now();
  await page.click('button.btn');
  await page.waitForSelector('.list-item');
  const t1 = Date.now();
  const resultsHtml = await page.$$eval('.list-item', els => els.slice(0,10).map(e=>e.innerText));
  console.log('Search by code results (sample):', resultsHtml.slice(0,3));
  console.log('Search time ms:', t1-t0);

  // open first item to finance
  await page.click('.list-item');
  await page.waitForSelector('.product-code');
  const financeText = await page.$eval('.card', el=>el.innerText);
  console.log('Finance card text:', financeText.split('\n').slice(0,6).join(' | '));

  // goto compare
  await page.click('button.btn');
  await page.waitForSelector('h3');
  const compareHtml = await page.$$eval('h4', els => els.map(e=>e.innerText));
  console.log('Compare headers sample:', compareHtml.slice(0,5));

  // Persistence: reload and search again
  await page.reload({ waitUntil: 'networkidle2' });
  await page.click('a[href="/search"]');
  await page.waitForSelector('input[placeholder]');
  await page.type('input[placeholder]', codeToSearch);
  await page.click('button.btn');
  await page.waitForSelector('.list-item');
  const resultsAfter = await page.$$eval('.list-item', els => els.map(e=>e.innerText));
  console.log('Results after reload count:', resultsAfter.length);

  // responsive screenshots
  const viewports = [ [360,800],[390,844],[412,915],[1024,768] ];
  for(const vp of viewports){
    await page.setViewport({width:vp[0],height:vp[1]});
    await page.screenshot({path: `screenshot_${vp[0]}x${vp[1]}.png`, fullPage:true});
    console.log('Captured screenshot', `screenshot_${vp[0]}x${vp[1]}.png`);
  }

  await browser.close();
}

run().then(()=>console.log('E2E done')).catch(e=>{console.error('E2E error', e); process.exit(1)});
