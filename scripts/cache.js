var config = require('./../config');
var request = require('request');
var fs = require('fs');
var _ = require('underscore');
var jsonminify = require('jsonminify');
var AWS = require('aws-sdk');
var rootBucket = 'morsel-press-kit/cache';
var cacheDir = './cache';
var q = require('q');

var apiUrl = 'https://api.eatmorsel.com';

var AWS_ACCESS_KEY_ID = config.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = config.AWS_SECRET_ACCESS_KEY;

AWS.config.update({accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY});

var s3 = new AWS.S3();

var placeIds = [8,4,31,25,94,27];
var maxMorsels = 50;

var Qs = {};

_.each(placeIds, function(placeId) {
  Qs[placeId] = {
    grid: []
  };
});

_.each(placeIds, function(placeId) {
  console.log('getting place '+placeId+' from api');

  getGrid(placeId).then(function(minifiedGridJson){
    _.each(JSON.parse(minifiedGridJson).data, function(m){
      console.log('getting morsel '+m.id+' from api');

      request(apiUrl+'/morsels/'+m.id+'.json?client%5Bdevice%5D=pressKitCaching', function (error, response, body) {
        var morselBucket,
            morselFile,
            morselFileContents,
            morselDir = '/items/morsels',
            morselLocalCacheDir,
            minifiedMorselJson;

        if (!error && response.statusCode == 200) {
          minifiedMorselJson = JSON.minify(body);
          morselBucket = rootBucket+morselDir;
          morselFile = m.id+'.json';
          morselFileContents = 'morselCallback('+minifiedMorselJson+');';
          morselLocalCacheDir = cacheDir+morselDir;

          console.log('writing grid for morsel '+m.id+' locally');
          fs.writeFile(morselLocalCacheDir+'/'+morselFile, minifiedMorselJson, function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log('morsel '+m.id+' saved locally');
            }
          });

          console.log('writing grid for morsel '+m.id+' to s3');
          //push a copy to amazon
          s3.putObject({
            Bucket: morselBucket,
            Key: morselFile,
            ACL: 'public-read',
            Body: minifiedMorselJson,
            ContentType: 'application/json'
          }, function(err, data) {
            if (err) {
              console.log('error uploading to s3: ');
              console.log(err);
              process.exit(1);
            }
            else {
              console.log('Successfully uploaded morsel data to ' + morselBucket + '/' + morselFile);
            }
          });
        } else {
          console.log('uh ohs getting morsel '+m.id+' from api');
          process.exit(1);
        }
      });
    });
  });
});

function getGrid(placeId) {
  var gridDeferred = q.defer(),
      gridGet = q.defer(),
      gridSaveLocal = q.defer(),
      grideSaveS3 = q.defer(),
      minifiedGridJson;

  Qs[placeId].grid.push(gridGet.promise);
  Qs[placeId].grid.push(gridSaveLocal.promise);
  Qs[placeId].grid.push(grideSaveS3.promise);

  q.all(Qs[placeId].grid).then(function(){
    gridDeferred.resolve(minifiedGridJson);
  });

  request(apiUrl+'/places/'+placeId+'/morsels.json?count='+maxMorsels+'&client%5Bdevice%5D=pressKitCaching', function (error, response, body) {
    var gridBucket,
        gridFile,
        gridFileContents,
        gridDir = '/grid',
        gridLocalCacheDir;

    if (!error && response.statusCode == 200) {
      gridGet.resolve();
      minifiedGridJson = JSON.minify(body);
      gridBucket = rootBucket+gridDir;
      gridFile = placeId+'.json';
      gridFileContents = 'morselCallback('+minifiedGridJson+');';
      gridLocalCacheDir = cacheDir+gridDir;

      //save a local copy for debugging
      console.log('writing grid for place '+placeId+' locally');
      fs.writeFile(gridLocalCacheDir+'/'+gridFile, minifiedGridJson, function(err) {
        if(err) {
          console.log(err);
          gridSaveLocal.reject();
        } else {
          console.log('grid '+placeId+' saved locally');
          gridSaveLocal.resolve();
        }
      });

      console.log('writing grid for place '+placeId+' to s3');
      s3.putObject({
        Bucket: gridBucket,
        Key: gridFile,
        ACL: 'public-read',
        Body: minifiedGridJson,
        ContentType: 'application/json'
      }, function(err, data) {
        if (err) {
          grideSaveS3.reject();
          console.log('error uploading to s3: ');
          console.log(err);
          process.exit(1);
        }
        else {
          console.log('Successfully uploaded grid data to ' + gridBucket + '/' + gridFile);
          grideSaveS3.resolve();
        }
      });
    } else {
      gridGet.reject();
      console.log('uh ohs getting morsels from api...');
      console.log('error:'+error);
      console.log('response:'+response);
      console.log('response status code:'+response.statusCode);
      process.exit(1);
    }
  });

  return gridDeferred.promise;
}

process.on('uncaughtException', function(err) {
  console.log(err);
});