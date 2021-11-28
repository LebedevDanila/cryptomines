const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');

const config = require('./config.js');

(async () => {
	const browser  = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.1.1' });
	const metamask = await dappeteer.setupMetamask(browser, { seed: config.secret_phase });

	await metamask.addNetwork(config.networks.bsc);

	const page = await browser.newPage();
	await page.goto('https://play.cryptomines.app/');

	// Удаление пустой вкладки
	const first_tab = await browser.pages();
  	await first_tab[0].close();

	// Одобрение авторизации через metamask
	await metamask.approve();

	// Назад на сайт
	await page.bringToFront();

	// await page.type('.grid.grid-flow-col.gap-2.justify-start input[type="number"]', '0.01');
})();
