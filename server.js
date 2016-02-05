var express = require('express'),
    app = express(),
    idx,
    mongo = require('mongodb').MongoClient,
    root = 'https://urlshortener-bch679.c9users.io/';

mongo.connect('mongodb://localhost:27017/test', function (err, db) {
  if (err) throw err;
  console.log('successfully connected to test database');
  var col = db.collection('myurlbch679');
  col.find({'idx': {$exists: true}}).toArray(function(err, result) {
    if (err) throw err;
    if (result.length) {
      idx = result[0].idx;
    }
    else {
      col.insert({'idx': 1});
      idx = 1;
    }});
  app.get('/new/:url', function(req, res) {
      var url = req.params.url;
      col.find({'url': 'http://' + url}).toArray(function(err, result) {
        if (err) {throw err};
	if (result[0]) {
          res.json({'original_url': result[0].url, 'short_url': root + result[0].id});
	}
	else {
          col.insert({'id': idx, 'url': 'http://' + url});
	  idx ++;
          col.update({'idx': {$exists: true}}, {$inc: {'idx': 1}});
	  res.json({'original_url': 'http://' + url, 'short_url': root + (idx - 1).toString()});
	}
      })});
  app.get('/:id', function(req, res) {
      var id = req.params.id;
      col.find({'id': Number(id)}).toArray(function(err, result) {
        if (err) throw err;
	if (result[0]){
	  res.redirect(result[0].url);
	}
	else {
	  res.json({"error":"No short url found for given input"});
	}})});
  app.listen(8080, function() {
    console.log('listening on port 8080...');
  });
});
