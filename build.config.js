
module.exports = {
  build_dir: 'build',
  compile_dir: 'bin',
  compile_deploy_dir: '../morsel-press-widget-deploy-prod',
  server_config_dir: 'server_config',
  scripts_dir: 'scripts',
  dev_server_port: '5003',
  view_dir: 'src/views',

  prod_repo: 'git@heroku.com:morsel-press-widget.git',

  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],
    
    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    hbs: [ 'src/views/frame.hbs', 'src/views/parent.hbs' ],
    sass: 'src/sass/main.scss'
  },
  parent_files: {
    js: [
      'bower_components/iframe-resizer/src/iframeResizer.js',
      'bower_components/jschannel/src/jschannel.js',
      'src/assets/js/parent.js'
    ],
    css: []
  },
  test_files: {
    js: [
      'bower_components/angular-mocks/angular-mocks.js'
    ]
  },
  vendor_files: {
    js: [
      'bower_components/angular/angular.js',
      'bower_components/angular-bindonce/bindonce.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/iframe-resizer/src/iframeResizer.contentWindow.js',
      'bower_components/imagesloaded/imagesloaded.pkgd.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/jschannel/src/jschannel.js',
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
