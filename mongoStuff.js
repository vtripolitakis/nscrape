exports.addToMongo = function(data)
{
	var db = require('monk')('localhost:27017/postdb');
	var posts = db.get('posts');
	posts.insert({postData:data});
}