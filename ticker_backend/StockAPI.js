var https = require('https'); //need to http
var http = require('http');
var stocks = ['CYBR', 'SHOP', 'IBM', 'AAPL', 'ANF', 'TWX', 'T', 'SNAP', 'P','AMZN','AMD','PYPL','UA','WFC','JCP','M','MRO','BAC','GOOG'];
http.createServer(function (request,response){

	getStockData('INTRADAY',stocks[0],1,0);
	timer = setInterval(middleFunc, 60000);
}).listen(3000);
function getStockData(timeRange,symb,interval, p){
	//timeRange is either 'INTRADAY', 'DAILY', 'DAILY_ADJUSTED', 'WEEKLY', 'WEEKLY_ADJUSTED', 'MONTHLY', 'MONTHLY_ADJUSTED'
	//interval is either 1,5,15,30,60

	var options = {
		host: 'www.alphavantage.co',
		path: '/query?function=TIME_SERIES_' + timeRange + '&symbol=' + symb + '&interval=' + interval + 'min&apikey=9RXP94XNJ6BMS8GL',
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

			var messageKey = 'Time Series (' + interval+'min)';

			var obj = JSON.parse(content);

			if(obj != null) {
				var currentPrice = obj[messageKey][Object.keys(obj[messageKey])[0]]['1. open'];
				console.log(symb + ' is currently ' + currentPrice);
				p++;
				if(p == stocks.length){
					console.log('DONE');
				}
				else {
				getStockData('INTRADAY',stocks[p],1, p);
			}
			}
		})

	}).on('error', function(e) {
		console.log("Got error: " + e.message);
		console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
	});
	req.end();
}
