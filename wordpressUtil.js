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

	wp.posts().post({title:data.tite,excerpt:data.excerpt,status:'draft',content:data.content}).then(function (err,data)
	{
		console.log(JSON.stringify(data));
		console.log(JSON.stringify(err));
	});
}