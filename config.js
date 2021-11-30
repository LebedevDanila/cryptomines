const config = {
	secret_phase: 'maple door mind roast barely parrot know input any fiction motion hidden',
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
		min_price: 0.02,
		level: 3,
		init_page: 2,
		max_page: 4,
	},
}

module.exports = config;