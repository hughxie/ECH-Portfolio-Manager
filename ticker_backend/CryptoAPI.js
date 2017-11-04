var https = require('https'); //need to http
var http = require('http');
var crypto = ['BTC','ETH','BCH','XRP','LTC','ETC'];
http.createServer(function (request,response){
	getCryptoData('INTRADAY',crypto[0],0);
	timer = setInterval(middleFunc, 60000);

}).listen(3000);

function middleFunc(){
	getCryptoData('INTRADAY',crypto[0],0);

}
function getCryptoData(timeRange,symb,p){
	var options = {
		host: 'www.alphavantage.co',
		path: '/query?function=DIGITAL_CURRENCY_' + timeRange + '&symbol=' + symb + '&market=USD'+'&apikey=9RXP94XNJ6BMS8GL',
		port: 443,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	var req = https.get(options, function(res) {

		var content = ''
		res.on("data", function (chunk) {
			content += chunk;
		})
		res.on("end",function (){

			var messageKey = 'Time Series (Digital Currency Intraday)';
			var obj = JSON.parse(content);
			if(obj != null) {
				var currentPrice = obj[messageKey][Object.keys(obj[messageKey])[0]]['1a. price (USD)'];
				console.log(symb + ' is currently ' + currentPrice);
				p++;
				if(p == crypto.length){
					console.log('_________');
				}
				else {
				getCryptoData('INTRADAY',crypto[p],p);
			}
			}
		})

	}).on('error', function(e) {
		console.log("Got error: " + e.message);
		console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
	});
	req.end();
}
