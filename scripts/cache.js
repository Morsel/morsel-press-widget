var config = require('./../config');
var request = require('request');
var fs = require('fs');
var _ = require('underscore');
var jsonminify = require('jsonminify');
var AWS = require('aws-sdk');
var rootBucket = 'morsel-press-kit/cache';
var cacheDir = './cache';

var apiUrl = 'http://api.eatmorsel.com';

var AWS_ACCESS_KEY_ID = config.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = config.AWS_SECRET_ACCESS_KEY;

AWS.config.update({accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY});

var s3 = new AWS.S3();

var placeIds = [8,4,31,25,94,27];
var maxMorsels = 50;

_.each(placeIds, function(placeId) {
  request(apiUrl+'/places/'+placeId+'/morsels.json?count='+maxMorsels+'&client%5Bdevice%5D=pressKitCaching', function (error, response, body) {
    var gridBucket,
        gridFile,
        gridFileContents,
        gridDir = '/grid',
        gridLocalCacheDir,
        minifiedGridJson;

    if (!error && response.statusCode == 200) {
      minifiedGridJson = JSON.minify(body);
      gridBucket = rootBucket+gridDir;
      gridFile = placeId+'.json';
      gridFileContents = 'morselCallback('+minifiedGridJson+');';
      gridLocalCacheDir = cacheDir+gridDir;

      //save a local copy for debugging
      fs.writeFile(gridLocalCacheDir+'/'+gridFile, minifiedGridJson, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('grid saved locally');
        }
      });

      s3.putObject({
        Bucket: gridBucket,
        Key: gridFile,
        ACL: 'public-read',
        Body: minifiedGridJson,
        ContentType: 'application/json'
      }, function(err, data) {
        if (err) {
          console.log('error uploading to s3: ');
          console.log(err);
          process.exit(1);
        }
        else {
          console.log('Successfully uploaded data to ' + gridBucket + '/' + gridFile);
        }
      });

      _.each(JSON.parse(minifiedGridJson).data, function(m){
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

            fs.writeFile(morselLocalCacheDir+'/'+morselFile, minifiedMorselJson, function(err) {
              if(err) {
                console.log(err);
              } else {
                console.log('morsel '+m.id+' saved locally');
              }
            });

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
                console.log('Successfully uploaded data to ' + morselBucket + '/' + morselFile);
              }
            });
          } else {
            console.log('uh ohs getting morsel '+m.id+' from api');
            process.exit(1);
          }
        });
      });
    } else {
      console.log('uh ohs getting morsels from api');
      process.exit(1);
    }
  });
});

process.on('uncaughtException', function(err) {
  console.log(err);
});