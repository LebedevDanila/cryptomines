const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');

const config = require('./config.js');

(async () => {
	const browser  = await dappeteer.launch(puppeteer, {
		metamaskVersion: 'v10.1.1',
		args: ['--window-size=1920,1080', '--start-maximized'],
		defaultViewport: null,
	});
	const metamask = await dappeteer.setupMetamask(browser, {
		seed: config.secret_phase
	});

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

	while (true) {
		// парсинг маркета
		await page.goto('https://play.cryptomines.app/marketplace/spaceships', {
			waitUntil: "networkidle0",
		});
		await page.type('.grid.grid-flow-col.gap-2.justify-start input[type="number"]', String(config.item.min_price));
		await page.waitForSelector(`button.bg-gray-700.text-white:nth-child(${config.item.level})`);
		await page.click(`button.bg-gray-700.text-white:nth-child(${config.item.level})`);

		let pagination = config.item.init_page;
		while (true) {
			if (pagination > config.item.max_page) {
				break;
			}

			await page.waitForSelector('input[type="text"]');
			await page.evaluate(() => document.querySelector('input[type="text"]').value = '');
			await page.type('input[type="text"]', String(pagination));
			await page.waitForSelector('.flex.gap-3.flex-row button');
			await page.click('.flex.gap-3.flex-row button');

			await page.waitForSelector('.grid.grid-cols-1.gap-6');

			await page.waitForSelector('.self-center.text-sm button.relative.mx-auto.flex.justify-center.undefined.bg-primary');
			const elems = await page.$$('.self-center.text-sm button.relative.mx-auto.flex.justify-center.undefined.bg-primary');
			
			console.log(elems);
			pagination++;
		}
		await page.reload();
	}
})();
