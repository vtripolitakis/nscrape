var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));


app.get('/', function (req, res) {
  res.send('Hello World!');
  console.log('moufa');
});


app.get('/scrape', function (req,res) {

	var out='';
	var FeedParser = require('feedparser')
	  , request = require('request');

	var req1 = request(req.query.link)
	  , feedparser = new FeedParser();
	req1.on('error', function (error) {
	  // handle any request errors
	});
	req1.on('response', function (res1) {
	  var stream = this;

	  if (res1.statusCode != 200) return this.emit('error', new Error('Bad status code'));

	  stream.pipe(feedparser);
	});

	feedparser.on('error', function(error) {
	  // always handle errors
	});
	feedparser.on('readable', function() {
	    var post;
	    
	    while (post = this.read()) {
	      //out=out+(JSON.stringify(post.title+"@"+post.guid+"<br/>", ' ', 4));      
	      out=out+post.description;
	      out=out+"<br/>";
	    }
	});

	feedparser.on('end', function() {
	    res.send(out);
	});
});

app.listen((process.env.PORT || 5000),function () {
});
