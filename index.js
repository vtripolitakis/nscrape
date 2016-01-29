var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));


app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});

app.get('/testwp', function (req, res) {
	var WP = require('./wordpressUtil.js');
	WP.addToWordpress({title:'aaa23',excerpt:'aa24',status:'draft',content:'bbbb6sdf2',categories:[4,6]});
	res.send("OK");
});


app.get('/testwpimage', function (req, res) {
  
	var WP = require('./wordpressUtil.js');
	WP.uploadMedia({filename:'/home/vaggelis/Desktop/karvouna.jpg'},
		function(data)
		{
			var body=JSON.parse(data);
			WP.setFeaturedImage({id:2223,featured_media:body.id});
		}
	);
	res.send("OK");

});


app.get('/updatedfeaturedimage', function (req, res) {
  
	var WP = require('./wordpressUtil.js');
	WP.setFeaturedImage({id:2223,featured_media:2228});
	res.send("OK");

});


app.get('/scrapeToWordpress', function (req,res) {
	var debug=require('debug');
	var parseUtil = require('./parseUtil.js');
	var WP = require('./wordpressUtil.js');
	var feedLink = req.query.link;
	var theSelector = req.query.selector;
	var theToRemove = req.query.toRemove;

	parseUtil.getFeed(feedLink,function(data){
		for (i in data)
		{			
			var other={};
			var id=-1;
			//get image from description
			var descriptionImage = parseUtil.getImageinRssDescription(data[i].description);
			
			var theLink =data[i].link;
			other.link=theLink;
			other.title=data[i].title;
			other.date=data[i].date;
			other.descriptionImage=descriptionImage;

			var fixedLink = other.link.replace(/\/+$/, "");
			//console.log(fixedLink);
			parseUtil.getBody(fixedLink,theSelector,theToRemove,other,function(theData,other){
				//console.log("inserting")	
				
				WP.addToWordpress({title:other.title,excerpt:'',status:'draft',content:theData,categories:[4,6]},other,function(data)
					{
						console.log(data);
					});
			});
		}
		res.send("Job Dispatched");
	});
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

app.get('/scrapeToMongo', function (req,res) {
	var debug=require('debug');
	var parseUtil = require('./parseUtil.js');
	var mongoStuff = require('./mongoStuff.js');
	var feedLink = req.query.link;
	var theSelector = req.query.selector;
	var theToRemove = req.query.toRemove;

	parseUtil.getFeed(feedLink,function(data){
		for (i in data)
		{			
			var other={};
			var theLink =data[i].link;
			other.link=theLink;
			other.title=data[i].title;
			other.date=data[i].date;
			console.log("checking: "+ data[i].title);

			mongoStuff.findArticle(data[i].link,other,function(data,other){
				console.log(data);
				if (data==0)
				{
					var fixedLink = other.link.replace(/\/+$/, "");
					console.log(fixedLink);
					parseUtil.getBody(fixedLink,theSelector,theToRemove,other,function(theData,other){
						//ToDo: do it better with callback... anyway			
						//toAdd.content=theData;
						var toAdd={};
						toAdd.title=other.title;
						toAdd.link=other.link;
						toAdd.date=other.date;		
						toAdd.content=theData;	
						console.log("inserting")											
						mongoStuff.addToMongo(toAdd);
					});	
				}
				else
				{
					console.log("exists");
				}
			});
		}
		res.send("Job Dispatched");
	});
});

app.get('/parse', function (req,res) {
	var link = req.query.link;
	var selector = req.query.selector;
	var toRemove = req.query.toRemove;
	var parseUtil = require('./parseUtil.js');
	var other = {};
	parseUtil.getBody(link,selector,toRemove,other,function(data,other){res.send(data);});
});


app.get('/parseToConsole', function (req,res) {
	var link = req.query.link;
	var selector = req.query.selector;
	var toRemove = req.query.toRemove;
	var parseUtil = require('./parseUtil.js');
	parseUtil.getBody(link,selector,toRemove,null,function(data,other){console.log(data);});
	res.send("OK");
});

app.get('/addToMongo/:title', function (req,res) {
	var mongoStuff = require('./mongoStuff.js');
	var parseUtil = require('./parseUtil.js');
	var link = req.query.link;
	var selector = req.query.selector;
	var toRemove = req.query.toRemove;
	var postTitle = req.params.title;

	parseUtil.getBody(link,selector,toRemove,other,function(data,other){
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
	mongoStuff.getArticle(req.params.articleId,
		function(err,doc){
			res.render('article',{post:doc});});	
});

app.get('/all', function(req,res){
	var mongoStuff = require('./mongoStuff.js');
	mongoStuff.getAll(
		function(err,docs){
			console.log(docs);
			res.render('articles',{posts:docs});});	
});


app.listen((process.env.PORT || 5000),function () {
});
