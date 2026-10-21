import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
(async () => {
 const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
 try {
 await mkdir('artifacts/browser', { recursive: true });
 const page = await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
 const assert=(v,m)=>{if(!v)throw Error(m)};
 const choose = async name => { await page.getByRole('button',{name,exact:true}).click(); };
 await page.goto(process.env.BASE_URL || 'http://127.0.0.1:5173/'); await page.locator('canvas').waitFor();
 await page.waitForFunction(()=>document.querySelector('canvas')?.width>0);
 await page.getByRole('tab',{name:'Reto',exact:true}).click();
 await choose('B. Para limitar la corriente y proteger el LED');
 assert(await page.getByRole('button',{name:'Completar lección',exact:true}).isDisabled(),'LED activity gate');
 await choose('Ejecutar simulación');
 await page.waitForFunction(()=>document.querySelector('.logs').textContent.includes('HIGH')&&document.querySelector('.logs').textContent.includes('LOW'));
 await page.getByRole('slider').nth(0).fill('100');await page.getByRole('slider').nth(1).fill('2000');
 assert((await page.locator('.code-view').innerText()).includes('delay(100);'),'min time');
 assert((await page.locator('.code-view').innerText()).includes('delay(2000);'),'max time');
 for(const [resistance,current] of [['220','13.64'],['1000','3.00'],['10000','0.30']]) {
  await page.getByRole('combobox').selectOption(resistance);assert((await page.locator('.current-note').innerText()).includes(current),'current '+resistance);
 }
 await choose('Detener simulación');
 const logs=await page.locator('.logs').innerText();await page.waitForTimeout(350);
 assert((await page.locator('.logs').innerText())===logs,'stop cancels timer');
 await page.getByRole('tab',{name:'Reto',exact:true}).click();await choose('Completar lección');
 assert((await page.locator('.progress-meta').innerText()).includes('1/11'),'LED progress');
 await page.reload();await page.locator('canvas').waitFor();
 assert(await page.getByRole('slider').nth(0).inputValue()==='100','settings persisted');
 assert(await page.getByRole('combobox').inputValue()==='10000','resistance persisted');
 await choose('Restablecer valores');assert(await page.getByRole('slider').nth(0).inputValue()==='500','reset');
 await choose('Ejecutar simulación');await choose('1. Conoce Arduino');
 assert(await page.getByRole('button',{name:'Detener simulación',exact:true}).count()===0,'board hides LED controls');
 assert(await page.getByRole('combobox').count()===0,'board hides resistance');
 await page.getByRole('tab',{name:'Reto',exact:true}).click(); await choose('B. El microcontrolador ATmega328P');
 assert(await page.getByRole('button',{name:'Completar lección',exact:true}).isDisabled(),'board exploration gate');
 const parts=['Puerto USB','Microcontrolador','Entradas analógicas','Pines digitales','Alimentación'];
 for(const name of parts) {
  await choose('Explorar '+name);
  assert(await page.locator('.part-description h4').innerText()===name,'3D point '+name);
 }
 assert((await page.locator('.information-inner').innerText()).includes('Partes exploradas: 5/5'),'all parts');
 await page.getByRole('tab',{name:'Aprender',exact:true}).focus(); await page.keyboard.press('ArrowRight');
 assert(await page.getByRole('tab',{name:'Partes',exact:true}).getAttribute('aria-selected')==='true','keyboard tabs');
 const usb=page.locator('.part-buttons button').first(); await usb.focus(); await page.keyboard.press('Enter');
 assert(await page.locator('.part-description h4').innerText()==='Puerto USB','keyboard selection');
 assert(await usb.evaluate(e=>getComputedStyle(e).outlineStyle)==='solid','visible keyboard focus');
 await page.getByRole('tab',{name:'Reto',exact:true}).click();await choose('Completar lección');
 assert((await page.locator('.progress-meta').innerText()).includes('2/11'),'board progress');
 await page.screenshot({path:'artifacts/browser/placa-escritorio.png',fullPage:true});
 await page.reload();await page.locator('canvas').waitFor();assert((await page.locator('.progress-meta').innerText()).includes('2/11'),'both persisted');
 await page.setViewportSize({width:390,height:844});
 await choose('1. Conoce Arduino');await choose('Explorar Microcontrolador');
 assert(await page.locator('.part-description h4').innerText()==='Microcontrolador','mobile marker');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no mobile horizontal page overflow');
 await page.screenshot({path:'artifacts/browser/placa-movil.png',fullPage:true});
 await choose('2. Enciende un LED');await choose('Ejecutar simulación');await choose('Detener simulación');
 await page.screenshot({path:'artifacts/browser/led-movil.png',fullPage:true});
 await page.evaluate(()=>localStorage.setItem('arduino-lab-es-settings-v1','{invalid'));await page.reload();await page.locator('canvas').waitFor();
 assert(await page.getByRole('slider').nth(0).inputValue()==='500','corrupt settings fallback');
 const blocked=await browser.newPage();await blocked.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new DOMException('Bloqueado','SecurityError')}});await blocked.goto(process.env.BASE_URL || 'http://127.0.0.1:5173/');
 await blocked.getByText('El navegador no permite guardar tu avance.',{exact:false}).waitFor();await blocked.getByRole('button',{name:'Ejecutar simulación',exact:true}).click();await blocked.close();
 assert(errors.length===0,errors.join('\n'));
 console.log('PASS: 2 lecciones; 5 puntos 3D y alternativa por teclado; pestañas y foco; HIGH/LOW; límites 100/2000 ms; 3 resistencias; stop/reset/cambio de lección; retos con actividad; persistencia; almacenamiento corrupto/bloqueado; móvil 390×844 sin desbordamiento; sin errores de consola.');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
