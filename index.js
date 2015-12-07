var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));


app.get('/', function (req, res) {
  res.send('Hello World!');  
});


app.get('/scrape', function (req,res) {
	var link = req.query.link;
	var parseUtil = require('./parseUtil.js');
	parseUtil.getFeed(link,function(data){res.send(data);});
});

app.get('/parse', function (req,res) {
	var link = req.query.link;
	var selector = req.query.selector;
	var toRemove = req.query.toRemove;
	var parseUtil = require('./parseUtil.js');
	parseUtil.getBody(link,selector,toRemove,function(data){res.send(data);});
});


app.get('/parseToConsole', function (req,res) {
	var link = req.query.link;
	var selector = req.query.selector;
	var toRemove = req.query.toRemove;
	var parseUtil = require('./parseUtil.js');
	parseUtil.getBody(link,selector,toRemove,function(data){console.log(data);});
	res.send("OK");
});


app.listen((process.env.PORT || 5000),function () {
});
