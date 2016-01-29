var config = require('./config.js');

exports.addToWordpress = function(data)
{
	var WP = require( 'wordpress-rest-api' );
	var config = require('./config.js');
	var wp = new WP({ 
		endpoint: config.configData.wpEndpoint,
		username: config.configData.wpUsername,
		password: config.configData.wpPassword 
	});

	wp.posts().post({title:data.title,excerpt:data.excerpt,status:'draft',content:data.content,categories:data.categories,featured_media:data.featured_media}).then(function (err,data)
	{
		console.log(JSON.stringify(data));
		console.log(JSON.stringify(err));
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