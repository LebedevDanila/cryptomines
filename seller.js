const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');
const axios     = require('axios').default;

const config = require('./config.js');

async function getPrice(level, page = 3) {
	const response = await axios.get(`https://api.cryptomines.app/api/spaceships?level=${level}&page=${page}&limit=8&sort=eternal`);
	const items    = await response.data;
	const data     = items.data;

	return data[0].eternal;
}

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

	// парсинг своих кораблей
	await page.goto('https://play.cryptomines.app/game/spaceships');

	while(true) {
		// ждем загрузки контейнера
		try {
			await page.waitForSelector('.relative.group.min-w-full');
		} catch(e) {
			console.log('Ваши корабли не загрузились, идет перезагрузка...');
			await page.reload();
			break;
		}

		const spaceships = await page.evaluate(() => {
			const response = [];
			const items    = document.querySelectorAll('.relative.group.min-w-full');
			
			items.forEach(row => {
				const data = {
					name : row.querySelectorAll('.grid.grid-flow-row span.flex span')[0].innerText + ' ' + row.querySelectorAll('.grid.grid-flow-row span.flex span')[1].innerText,
					level: row.querySelectorAll('span.py-3').length,
				}
				response.push(data);
			});

			return response;
		});

		await spaceships.forEach(async (row) => {
			const buy_price  = await getPrice(row.level);
			const sale_price = (buy_price + (buy_price * 0.15)).toPrecision(3);
			console.log(row.name, sale_price);
		});
		
		await page.waitForTimeout(6000);
		await page.reload();
	}
})();