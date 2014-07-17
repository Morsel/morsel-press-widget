
module.exports = {
  build_dir: 'build',
  compile_dir: 'bin',
  server_config_dir: 'server_config',
  dev_server_port: '5003',
  view_dir: 'src/views',
  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],
    
    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    hbs: [ 'src/views/frame.hbs', 'src/views/shell.hbs' ],
    sass: 'src/sass/main.scss'
  },
  test_files: {
    js: [
      'bower_components/angular-mocks/angular-mocks.js'
    ]
  },
  vendor_files: {
    js: [
      'bower_components/angular/angular.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-ui-utils/modules/route/route.js',
      'bower_components/iframe-resizer/js/iframeResizer.contentWindow.min.js',
      'bower_components/imagesloaded/imagesloaded.pkgd.min.js',
      'bower_components/underscore/underscore.js'
    ],
    css: [
    ],
    assets: [
      'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/glyphicons-halflings-regular.eot',
      'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/glyphicons-halflings-regular.svg',
      'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/glyphicons-halflings-regular.ttf',
      'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/glyphicons-halflings-regular.woff'
    ]
  },
};
