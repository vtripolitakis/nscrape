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

	var tmpReq = request(req.query.link)
	  , feedparser = new FeedParser();
	tmpReq.on('error', function (error) {
	  // handle any request errors
	  res.send('error detected - see logs');
	});
	tmpReq.on('response', function (tmpRes) {
	  var stream = this;

	  if (tmpRes.statusCode != 200) return this.emit('error', new Error('Bad status code'));

	  stream.pipe(feedparser);
	});

	feedparser.on('error', function(error) {
	  // always handle errors
	  res.send('error detected - see logs');
	});

	feedparser.on('readable', function() {
	    var post;    
	    while (post = this.read()) {
	      //out=out+(JSON.stringify(post.title+"@"+post.guid+"<br/>", ' ', 4));      
	      out=out+post.guid;
	      out=out+"<br/>";
	      out=out+post.title;
	      out=out+"<br/>";
	      out=out+post.description;
	      out=out+"<br/>";
	    }
	});

	feedparser.on('end', function() {
	    res.send(out);
	});
});

app.get('/parse', function (req,res) {
	var link = req.query.link;
	var selector = req.query.selector;
	var toRemove = req.query.toRemove;

	var out='';
	var request = require('request');
	var tmpReq = request(req.query.link);
	
	tmpReq.on('error', function (error) {
	  // handle any request errors
	  res.send('error detected - see logs');
	});

	tmpReq.on('response', function (tmpRes) {
	  if (tmpRes.statusCode != 200) return this.emit('error', new Error('Bad status code'));	  	
		var body = '';
		  tmpRes.on('data', function (chunk) {
		    body += chunk;
		  });
		  tmpRes.on('end', function () {
		    	var cheerio = require('cheerio');
		    	$ = cheerio.load(body,{xmlMode: true,normalizeWhitespace: true});		    	
		    	$(toRemove).remove();				
		    	res.send($(selector).html());
		  });
	});
});


app.listen((process.env.PORT || 5000),function () {
});
