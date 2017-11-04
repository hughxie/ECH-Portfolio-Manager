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


var stocks = ['CYBR', 'SHOP', 'IBM', 'AAPL', 'ANF', 'TWX', 'T', 'SNAP', 'P','AMZN','AMD','PYPL','UA','WFC','JCP','M','MRO','BAC','GOOG','NFLX','NFLX'];

getStockData('INTRADAY',stocks[0],1,0);
//timer = setInterval(middleFunc, 60000);
http.createServer(function (request,response){


}).listen(3000);

function middleFunc(){
	arrayOfInfo = [];
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
					var tempObj = {}
					tempObj.symb = symb;
					tempObj.price = currentPrice;
					tempObj.high = currentHigh;
					tempObj.low = currentLow;
					tempObj.close = currentClose;
					tempObj.volume = currentVolume;
					arrayOfInfo.push(tempObj);
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
	var symbolsRef = ref.child("symbols/" + symb);
	symbolsRef.set({
		name: name,
		price: currentStock.price,
		high: currentStock.high,
		low: currentStock.low,
		close: currentStock.close,
		volume: currentStock.volume
	});
}
