var maxWorkers = process.env.MAX_WORKERS || 1,
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    workers = numCPUs >= maxWorkers ? maxWorkers : numCPUs,
    Logger = {},
    index = 0;

//this whole thing is copied from morsel-web. documented there and will need to be updated eventually
if (cluster.isMaster && ((process.env.NODE_ENV || 'local') !== 'local')) {
  cluster.on('exit', function (worker, code, signal) {
    if (code !== 130) {
      cluster.fork();
    }
  });

  process.on('SIGINT', function () {
    cluster.disconnect(function () {
      process.exit(1);
    });
  });

  for (index = 0; index < workers; index += 1) {
    cluster.fork();
  }

} else {
  var serverDomain = require('domain').create(),
      httpServer,
      rollbar;

  serverDomain.on('error', function (err) {
    var exceptionNotifyer = {},
        killtimer = setTimeout(function () {
           process.exit(1);
        }, 5000);

    killtimer.unref();
    try {
      if (rollbar) {
        rollbar.shutdown();
      }
      if (httpServer) {
        httpServer._connections = 0;
        httpServer.close(function () {
           cluster.worker.disconnect();
        });
      } else if (cluster.worker) {
        cluster.worker.disconnect();
      }
      console.log('Unhandled Exception in domain of cluster worker ' + process.pid);
      console.log(err.stack || err);
    } catch(er2) {

    }
  });

  serverDomain.run(function () {
    var config;
    try{
      config = require('./config');
      console.log('Config loaded');
    } catch(err) {
      console.log('Config not loaded');
    }
    var rollbarAccountKey = process.env.ROLLBAR_ACCOUNT_KEY || config.rollbarAccountKey;
    var nodeEnv = process.env.NODE_ENV || config.node_env || 'local';

    // rollbar should be the first require
    if (rollbarAccountKey) {
      rollbar = require('rollbar');
      rollbar.handleUncaughtExceptions(rollbarAccountKey, {
        environment: nodeEnv
      });
    }

    var express = require("express");
    var logfmt = require("logfmt");
    var _ = require('underscore');
    var app = express();
    var port = Number(process.env.PORT || 5000);
    var apiUrl = 'http://api.eatmorsel.com';//always use prod for this, shouldn't need staging
    var siteDomain = nodeEnv === 'production' ? 'http://morsel-press-widget.herokuapp.com' : 'http://localhost:' + port;

    app.use(logfmt.requestLogger());

    //enable gzip
    var compress = require('compression');
    app.use(compress());

    var oneDay = 86400000;

    //static files
    app.use('/assets', express.static(__dirname + '/assets', { maxAge: oneDay }));
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

    function render404(res) {
      res.status(404).render('404');
    }

    if(rollbar) {
      app.use(rollbar.errorHandler(rollbarAccountKey, {
        environment: nodeEnv
      }));
    }

    httpServer = app.listen(port, function() {
      console.log("Listening on " + port);
    });
  });
}