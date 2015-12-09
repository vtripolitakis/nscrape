exports.addToMongo = function(data)
{
	var db = require('monk')('localhost:27017/postdb');
	var posts = db.get('posts');
	posts.insert(data);
}

exports.getArticle = function(articleId,successCallback)
{
	var db = require('monk')('localhost:27017/postdb');
	var posts = db.get('posts');
	console.log(articleId);
	var post = posts.findById(articleId,function(err,doc)
		{
			successCallback(err,doc);
		});
}