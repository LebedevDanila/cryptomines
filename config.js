const config = {
	secret_phase: 'maple door mind roast barely parrot know input any fiction motion hidden', // секретная фраза
	networks: {
		bsc: {
			networkName: 'Binance Smart Chain Mainnet',
	  		rpc: 'https://bsc-dataseed1.ninicoin.io',
	  		chainId: '56',
	  		symbol: 'bnb',
	  		explorer: 'https://bscscan.com/',
		}
	},
	item: {
		min_price: null, // (null - отключить), (значение с плавающей точкой - базовая цена в eternal)
		level: 1, // левел spaceships
		init_page: 2, // начальная страница
		max_page: 5, // последняя страница
	},
}

module.exports = config;