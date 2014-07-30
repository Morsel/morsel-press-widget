// index.js
var express = require("express");
var logfmt = require("logfmt");
var _ = require('underscore');
var app = express();
var port = Number(process.env.PORT || 5000);
var nodeEnv = process.env.NODE_ENV || 'local';
var apiUrl = nodeEnv === 'production' ? 'http://api.eatmorsel.com' : 'http://api-staging.eatmorsel.com';
var siteDomain = nodeEnv === 'production' ? 'http://morsel-press-widget.herokuapp.com' : 'http://localhost:' + port;

app.use(logfmt.requestLogger());

//enable gzip
var compress = require('compression');
app.use(compress());

//static files
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

//use hbs for templates
var hbs = require('hbs');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/src/views');

//if/else handlebars helper
hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

//TEMPLATES
app.get('/templates-common.js', function(req, res){
  res.sendfile('templates-common.js');
});

app.get('/templates-app.js', function(req, res){
  res.sendfile('templates-app.js');
});

app.get('/places/:id', function(req, res){
  var request = require('request');

  request(apiUrl+'/places/'+req.params.id+'.json', function (error, response, body) {
    var place = JSON.parse(body).data;

    if (!error && response.statusCode == 200) {
      if(place) {
        res.render('place', {
          placeId: req.params.id,
          nodeEnv: nodeEnv,
          apiUrl: apiUrl,
          siteDomain: siteDomain
        });
      } else {
        res.send('Something went wrong. Please contact support@eatmorsel.com');
      }
    } else {
      res.send('Something went wrong. Please contact support@eatmorsel.com');
    }
  });
});

app.get('/parent/:id', function(req, res){
  res.render('parent', {
    placeId: req.params.id,
    nodeEnv: nodeEnv,
    apiUrl: apiUrl,
    siteDomain: siteDomain
  });
});

app.get('/robots.txt', function(req, res){
  res.sendfile('robots.txt');
});

app.get('/', function(req, res){
  res.redirect('http://www.eatmorsel.com');
});

app.get('*', function(req, res){
  render404(res);
});

httpServer = app.listen(port, function() {
  console.log("Listening on " + port);
});

function render404(res) {
  res.status(404).render('404');
}