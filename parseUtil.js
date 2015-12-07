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