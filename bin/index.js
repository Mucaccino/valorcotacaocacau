const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // require browser
  const browser = await puppeteer.launch();
  // new page
  const page = await browser.newPage();
  // goto webadress
  await page.goto('https://www.mercadodocacau.com.br/cotacoes');
  // read page
  const data = await page.evaluate(() => {
    // find all html elements
    return document.querySelector('*').outerHTML;
  });
  if (process.env.npm_config_html) {
    // log entire html
    console.log(data);
  }

  // replace all enter keywords
  var simpleData = data.replace(/\n/g, "");
  // create a regexp find data
  var myRegexp = new RegExp(`<span>BA</span></li>(.*?)<li class="box box-4 left b-right-1-dashed">(.*?)<span>(.*?)</span></li>`, 'gm');
  // execute regexp
  var match = myRegexp.exec(simpleData);

  // removel older screenshot
  fs.rmSync("html.png", {
    force: true,
  });
  // print a screenshot
  if (process.env.npm_config_print) {
    // log entire html
    await page.screenshot({ path: `html.png`, fullPage: true });
  }
  // close browser
  await browser.close();

  // show final info
  console.log(`${match[3]}`);
})();