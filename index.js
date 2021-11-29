const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');

const config = require('./config.js');

(async () => {
	const browser  = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.1.1', args: ['--window-size=1920,1080', '--start-maximized'] });
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

	// парсинг маркета
	await page.goto('https://play.cryptomines.app/marketplace/spaceships');
	await page.type('.grid.grid-flow-col.gap-2.justify-start input[type="number"]', String(config.item.min_price));
	await page.click(`button.bg-gray-700.text-white:nth-child(${config.item.level})`);

	let pagination = 1;
	let flag       = true;
	while (flag) {
		if (pagination >= 4) {
			flag = false;
			break;
		}

		await page.waitForSelector('input[type="text"]');
		await page.evaluate(() => document.querySelector('input[type="text"]').value = '');
		await page.type('input[type="text"]', String(pagination));
		await page.click('.flex.gap-3.flex-row button');

		await page.waitForSelector('.grid.grid-cols-1.gap-6');

		pagination++;
	}
})();
