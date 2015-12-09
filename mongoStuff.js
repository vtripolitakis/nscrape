var config = require('./config.js');

exports.addToMongo = function(data)
{
	var db = require('monk')(config.configData.host+':'+config.configData.port+'/'+config.configData.db);
	var posts = db.get(config.configData.collection);
	posts.insert(data);
	db.close();
}

exports.getArticle = function(articleId,fn)
{
	var db = require('monk')(config.configData.host+':'+config.configData.port+'/'+config.configData.db);
	var posts = db.get(config.configData.collection);
	console.log(articleId);
	var post = posts.findById(articleId,function(err,doc)
		{
			db.close();
			fn(err,doc);
		});
}

exports.findArticle = function(postLink,other,fn)
{
	var db = require('monk')(config.configData.host+':'+config.configData.port+'/'+config.configData.db);
	var posts = db.get(config.configData.collection);
	//console.log(postTitle);	

	posts.find({link:postLink},
		function(err,doc)
		{
			db.close();			
			fn(doc.length,other);
		});
}


exports.getAll = function(fn)
{
	var db = require('monk')(config.configData.host+':'+config.configData.port+'/'+config.configData.db);
	var posts = db.get(config.configData.collection);
	posts.find({},
		function(err,docs)
		{
			db.close();	
			fn(err,docs);
		});
}