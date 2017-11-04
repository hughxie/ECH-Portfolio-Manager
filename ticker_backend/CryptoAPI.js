var https = require('https'); //need to http
var http = require('http');
var crypto = ['BTC','ETH','BCH','XRP','LTC','ETC'];
var admin = require("firebase-admin");
var serviceAccount = require("ECH-Portfolio-Manager-989fb0879c82.json");
var arrayOfInfo = [];
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://ech-portfolio-manager.firebaseio.com/"
});
var db = admin.database();
var ref = db.ref("/");
getCryptoData('INTRADAY',crypto[0],0);
timer = setInterval(middleFunc, 300000);
http.createServer(function (request,response){


}).listen(3000);

function middleFunc(){
	arrayOfInfo = [];
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
				var message =  obj[messageKey][Object.keys(obj[messageKey])[0]];
				var currentPrice = message['1a. price (USD)'];
				var currentVolume = message['2. volume'];
				var currentMarketCap = message['3. market cap (USD)'];
				console.log(symb + ' is currently ' + currentPrice);
				p++;
				if(p == crypto.length){
					console.log('_________');
					for(var q = 0; q < crypto.length-1;q++){
						writeToServer(arrayOfInfo[q]);
					}
				}
				else {
					var tempObj = {};
					tempObj.price = currentPrice;
					tempObj.volume = currentVolume;
					tempObj.marketCap = currentMarketCap;
					tempObj.symb = symb;

					var options2 = {
						host: 'www.alphavantage.co',
						path: '/query?function=DIGITAL_CURRENCY_DAILY&symbol=' + symb + '&market=USD'+'&apikey=9RXP94XNJ6BMS8GL',
						port: 443,
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					};

					var req1 = https.get(options2, function(res1) {
						var content1 = ''
						res1.on("data", function (chunk1) {
							content1 += chunk1;
						})
						res1.on("end",function (){
							var obj1 = JSON.parse(content1);
							var message1 =  obj1['Time Series (Digital Currency Daily)'][Object.keys(obj1['Time Series (Digital Currency Daily)'])[0]];
							var closing = message1['4b. close (USD)'];
							var change = (currentPrice - closing)/closing * 100;
							tempObj.change = change;
							arrayOfInfo.push(tempObj);
							getCryptoData('INTRADAY',crypto[p],p);
						})

					});


			}
			}
		})

	}).on('error', function(e) {
		console.log("Got error: " + e.message);
		console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
	});
	req.end();
}

function writeToServer(currentCoin){
	var symbolsRef = ref.child("crypto/" + currentCoin.symb);
	symbolsRef.set({
		price: currentCoin.price,
		volume: currentCoin.volume,
		change: currentCoin.change,
		marketCap : currentCoin.marketCap
	});
}
