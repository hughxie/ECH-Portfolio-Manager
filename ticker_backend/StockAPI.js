var https = require('https'); //need to http
var http = require('http');
var admin = require("firebase-admin");
var serviceAccount = require("ECH-Portfolio-Manager-989fb0879c82.json");
var arrayOfInfo = [];
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://ech-portfolio-manager.firebaseio.com/"
});
var db = admin.database();
var ref = db.ref("/");
var hottestStock;


var stocks = ['CYBR', 'SHOP', 'IBM', 'AAPL', 'ANF', 'TWX', 'T', 'SNAP', 'P','AMZN','AMD','PYPL','UA','WFC','JCP','M','MRO','BAC','GOOG','NFLX','MSFT','NOK','VMW','GE','CBS','F', 'FB', 'TSLA', 'TWTR','TWTR'];

getStockData('INTRADAY',stocks[0],1,0);
var hottestStock = {
	name: 'name',
	price: 0,
	high: 0,
	low: 0,
	close: 0,
	volume: 0,
	change: 0
}
//timer = setInterval(middleFunc, 60000);
http.createServer(function (request,response){


}).listen(3000);

function middleFunc(){
	arrayOfInfo = [];
	var hottestStock = {
		name: name,
		price: 0,
		high: 0,
		low: 0,
		close: 0,
		volume: 0,
		change: 0
	}
	getStockData('INTRADAY',stocks[0],1,0);

}
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
				var message =  obj[messageKey][Object.keys(obj[messageKey])[0]];
				var currentPrice = message['1. open'];
				var currentHigh = message['2. high'];
				var currentLow = message['3. low'];
				var currentClose = message['4. close'];
				var currentVolume = message['5. volume'];
				console.log(symb + ' is currently ' + currentPrice);

				if(p == stocks.length-1){
					console.log('DONE');
					for(var y = 0; y < stocks.length-1; y++){
						retrieveNameFromSymbol(stocks[y], y);

					}
					console.log('done');
				}
				else {
					p++;
					var tempObj = {};
					tempObj.symb = symb;
					tempObj.price = currentPrice;
					tempObj.high = currentHigh;
					tempObj.low = currentLow;
					tempObj.close = currentClose;
					tempObj.volume = currentVolume;
					var options2 = {
						host: 'www.alphavantage.co',
						path: '/query?function=TIME_SERIES_DAILY&symbol=' + symb + '&interval=' + interval + 'min&apikey=9RXP94XNJ6BMS8GL',
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
							var message1 =  obj1['Time Series (Daily)'][Object.keys(obj1['Time Series (Daily)'])[0]];
							var closing = message1['4. close'];
							var change = (currentPrice - closing)/closing * 100;
							tempObj.change = change;
							arrayOfInfo.push(tempObj);
							getStockData('INTRADAY',stocks[p],1, p);
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

function retrieveNameFromSymbol(symb, y){
	var options = {
		host: 'finance.yahoo.com',

		port: 443,
		path: '/quote/' + symb
	};
	var content = "";
	https.get(options, function(res) {
		res.on("data", function (chunk) {
			content += chunk;
		})
		res.on("end",function (){
			var tempArray0 = content.split("<h1 class=\"D(ib) Fz(18px)\" data-reactid=\"7\">");
			var tempArray = tempArray0[1].split("(");
			var name = tempArray[0];
			writeToServer(symb,arrayOfInfo[y],name);
		})

	}).on('error', function(e) {
		console.log("Got error: " + e.message);
		console.log("Error! User may not exist or there is a problem with the connection. Returning error to the client");
	});
}

function writeToServer(symb, currentStock, name){
	if(currentStock.change > hottestStock.change){
		hottestStock = currentStock;
	}
	//var hottestRef = ref.child("hottestStock/");
	// hottestRef.set({
	// 	name: hottestStock.name,
	// 	price: hottestStock.price,
	// 	high: hottestStock.high,
	// 	low: hottestStock.low,
	// 	close: hottestStock.close,
	// 	volume: hottestStock.volume,
	// 	change: hottestStock.change
	// });
	var symbolsRef = ref.child("symbols/" + symb);
	symbolsRef.set({
		name: name,
		price: parseFloat(currentStock.price).toFixed(2),
		high: parseFloat(currentStock.high).toFixed(2),
		low: parseFloat(currentStock.low).toFixed(2),
		close: parseFloat(currentStock.close).toFixed(2),
		volume: currentStock.volume,
		change: parseFloat(currentStock.change).toFixed(2),
	});
}
