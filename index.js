var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));


app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});


app.get('/scrape', function (req,res) {
	var link = req.query.link;
	var theSelector = req.query.selector;
	var theToRemove = req.query.toRemove;
	var parseUtil = require('./parseUtil.js');
	parseUtil.getFeed(link,function(data){
		res.render('articleList',{title:'ArticleList',message:'Article List',posts:data,selector:theSelector,toRemove:theToRemove});
	});
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

app.get('/addToMongo/:title', function (req,res) {
	var mongoStuff = require('./mongoStuff.js');
	var parseUtil = require('./parseUtil.js');
	var link = req.query.link;
	var selector = req.query.selector;
	var toRemove = req.query.toRemove;
	var postTitle = req.params.title;

	parseUtil.getBody(link,selector,toRemove,function(data){
			console.log(data);
			//ToDo: do it better with callback... anyway
			var toAdd={};
			toAdd.title=postTitle;
			toAdd.content=data;
			mongoStuff.addToMongo(toAdd);
		});
	res.send("OK");
});



app.get('/show/:articleId', function(req,res){
	var mongoStuff = require('./mongoStuff.js');
	var debug = require('debug');
	mongoStuff.getArticle(req.params.articleId,
		function(err,doc){
			res.render('article',{post:doc});});	
});

app.listen((process.env.PORT || 5000),function () {
});
