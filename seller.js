const axios = require('axios').default;

async function getPrice(level, page = 3) {
	const response = await axios.get(`https://api.cryptomines.app/api/spaceships?level=${level}&page=${page}&limit=8&sort=eternal&etfrom=0.02&etto=`);
	const items    = await response.data;
	const data     = items.data;

	return data[0].eternal;
}

(async () => {
	const price = await getPrice(2);
	console.log(price)
})();