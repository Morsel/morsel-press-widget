var hbs = require('hbs');
var snippetPath = 'bin/src/views/partials/snippet.hbs';
var fs = require('fs');

if(typeof process.argv[2] != 'undefined') {
  var placeId = process.argv[2];
} else {
  console.log('no placeId provided');
  process.exit(1);
}

var templateData = {
  "morselDomain": "http://widget.eatmorsel.com",
  "nodeEnv":"production",
  "placeId":placeId
};

//if/else handlebars helper
hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

fs.readFile(snippetPath, function (err, fileData) {
  if (err) throw err;
  var template = hbs.compile(fileData.toString());
  var result = template(templateData);
  var outputPath = 'snippets/'+placeId+'.html';

  fs.writeFile(outputPath, result, function (err) {
    if (err) throw err;
    console.log(outputPath+' saved');
  });
});


