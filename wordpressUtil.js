var config = require('./config.js');

exports.addToWordpress = function(data,fn)
{
	var id=-1;
	var WP = require( 'wordpress-rest-api' );
	var config = require('./config.js');
	var wp = new WP({ 
		endpoint: config.configData.wpEndpoint,
		username: config.configData.wpUsername,
		password: config.configData.wpPassword 
	});

	wp.posts().post({title:data.title,excerpt:data.excerpt,status:'draft',content:data.content,categories:data.categories},function(err,data)
		{
			fn(data.id);
		});

}

exports.downloadFile = function(uri, filename, callback)
{	
	var request = require('request');
	var config = require('./config.js');
	var fs = require('fs');
	//console.log("URI IS:");
	//console.log(uri);
	//console.log("END URI IS");

   	request.head(uri, function(err, res, body){
   	//console.log(err);
   	//console.log(res);
   	//console.log(body);
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}

exports.uploadMedia = function(data,fn)
{
	var request = require('request');
	var config = require('./config.js');
	var fs = require('fs');

	var formData = {
  		file: fs.createReadStream(data.filename)
	};

	request.post({url:config.configData.wpEndpoint+'media', formData: formData}, 
		function optionalCallback(err, httpResponse, body) {	
		  if (err) {
		    return console.error('upload failed:', err);
		  }
		  
		  //console.log('Upload successful!  Server responded with:', body);
		  fn(body);
		})
	.auth(config.configData.wpUsername,config.configData.wpPassword,true);
}

exports.setFeaturedImage = function(data)
{
	var WP = require( 'wordpress-rest-api' );
	var config = require('./config.js');
	var wp = new WP({ 
		endpoint: config.configData.wpEndpoint,
		username: config.configData.wpUsername,
		password: config.configData.wpPassword 
	});

	
	//console.log("==");
	//console.log(data.featured_media);
	//console.log("==");
	wp.posts().id(data.id).post({featured_media:data.featured_media}).then(function (data)
	{
		//console.log(JSON.stringify(data));
	});

}