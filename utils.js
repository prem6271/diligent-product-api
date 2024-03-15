const axios = require("axios");

const getLatestCurrencyData = async () => {
  console.log("Calling External API...")
  var data;
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.freecurrencyapi.com/v1/latest',
    headers: {
      'apikey': 'fca_live_3qnybIOuplN9EAGEh4vG8CVzidh6411sGd3V7HZK'
    },
    params: {
      'currencies': 'EUR,CAD,GBP'
    }
  };

  await axios.request(config)
    .then((response) => {
      console.log("Latest Currency DATA from API => " + JSON.stringify(response.data));
      data = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
};


module.exports = {
  getLatestCurrencyData
}