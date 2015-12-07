
exports.getFeed = function(link,successCallback)
{
	var out=[];
	var FeedParser = require('feedparser')
	  , request = require('request');

	var tmpReq = request(link)
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
	  console.log('error detected - see logs');
	});

	feedparser.on('readable', function() {
	    var post;    
	    while (post = this.read()) {
	      //out=out+(JSON.stringify(post.title+"@"+post.guid+"<br/>", ' ', 4));      
	      //out=out+post.guid;
	      //out=out+"<br/>";
	      //out=out+post.title;
	      //out=out+"<br/>";
	      //out=out+post.description;
	      //out=out+"<br/>";
	      out.push(post);
	    }
	});

	feedparser.on('end', function() {
	    successCallback(out);
	});
}




exports.getBody = function(link,selector,toRemove,successCallback)
{
	var out='';
	var request = require('request');
	var tmpReq = request(link);
	
	tmpReq.on('error', function (error) {
	  // handle any request errors
	  console.log('error detected - see logs');
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
		    	successCallback($(selector).html());
		  });
	});
}


