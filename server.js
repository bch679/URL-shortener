var express = require('express'),
    app = express.();

app.route
  .get('/new/:url', function(req, res) {
    var url = params.url;
