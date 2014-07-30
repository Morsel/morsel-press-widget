module.exports = function ( grunt ) {
  
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-execute');

  var userConfig = require( './build.config.js' );

  var taskConfig = {
    pkg: grunt.file.readJSON("package.json"),

    meta: {
      banner: 
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    bump: {
      options: {
        files: [
          "package.json", 
          "bower.json"
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          "package.json", 
          "client/bower.json"
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },    

    clean: [ 
      '<%= build_dir %>', 
      '<%= compile_dir %>'
    ],

    copy: {
      build_app_assets: {
        files: [
          { 
            src: [ '**' ],
            dest: '<%= build_dir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
       ]   
      },
      build_vendor_assets: {
        files: [
          { 
            src: [ '<%= vendor_files.assets %>' ],
            dest: '<%= build_dir %>/assets/',
            cwd: '.',
            expand: true,
            flatten: true
          }
       ]   
      },
      build_appjs: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: [
              '<%= vendor_files.js %>'
            ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      //copy our package.json for deployment
      build_package_json: {
        files: [
          {
            src: [ 'package.json' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= compile_dir %>/assets',
            cwd: '<%= build_dir %>/assets',
            expand: true
          }
        ]
      },
      build_server: {
        files: [
          {
            src: [ '*' ],
            dest: '<%= build_dir %>',
            cwd: '<%= server_config_dir %>',
            expand: true
          }
        ]
      },
      compile_server: {
        files: [
          {
            src: [ '*' ],
            dest: '<%= compile_dir %>',
            cwd: '<%= server_config_dir %>',
            expand: true
          }
        ]
      },
      compile_deploy: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= compile_deploy_dir %>',
            cwd: '<%= compile_dir %>',
            expand: true
          }
        ]
      },
      //copy our package.json for deployment
      compile_package_json: {
        files: [
          {
            src: [ 'package.json' ],
            dest: '<%= compile_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      }
    },
    
    concat: {
      build_css: {
        src: [
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/main.css'
        ],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      build_parent_js: {
        src: [
          '<%= parent_files.js %>'
        ],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>_parent-<%= pkg.version %>.js'
      },
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [ 
          '<%= vendor_files.js %>', 
          'module.prefix', 
          '<%= build_dir %>/src/**/*.js', 
          '<%= html2js.app.dest %>', 
          '<%= html2js.common.dest %>', 
          'module.suffix' 
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      },
      compile_parent_js: {
        src: [
          '<%= parent_files.js %>'
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>_parent-<%= pkg.version %>.js'
      }
    },
    
    ngmin: {
      compile: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },
    
    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>',
          mangle: false
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>',
          '<%= concat.compile_parent_js.dest %>': '<%= concat.compile_parent_js.dest %>'
        }
      }
    },
    
    compass: {
      build: {
        options: {
          sassDir: 'src/sass',
          cssDir: '<%= build_dir %>/assets',
          trace: true,
          outputStyle: 'expanded',
          debugInfo: true,
          assetCacheBuster: false,
          imagesDir: '<%= build_dir %>/assets/images',
          relativeAssets: true
        }
      },
      compile: {
        options: {
          sassDir: 'src/sass',
          cssDir: '<%= compile_dir %>/assets',
          trace: false,
          outputStyle: 'compressed',
          debugInfo: false,
          assetCacheBuster: true,
          imagesDir: '<%= compile_dir %>/assets/images',
          relativeAssets: true
        }
      }
    },
    
    jshint: {
      src: [ 
        '<%= app_files.js %>'
      ],
      test: [
        '<%= app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },
    
    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: [ '<%= app_files.atpl %>' ],
        dest: '<%= build_dir %>/templates-app.js'
      },
      common: {
        options: {
          base: 'src/common'
        },
        src: [ '<%= app_files.ctpl %>' ],
        dest: '<%= build_dir %>/templates-common.js'
      }
    },
    
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma-unit.js'
      },
      unit: {
        port: 9019,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },
    
    views: {
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_js.dest %>',
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },
      compile_parent: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_parent_js.dest %>'
        ]
      }
    },

    mrsl_parent: {
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= concat.build_parent_js.dest %>'
        ]
      },
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_parent_js.dest %>'
        ]
      }
    },
    
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [ 
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          '<%= test_files.js %>'
        ]
      }
    },
    
    delta: {
      options: {
        livereload: true
      },
      
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },
      
      jssrc: {
        files: [ 
          '<%= app_files.js %>'
        ],
        tasks: [ 'jshint:src', 'karma:unit:run', 'copy:build_appjs' ]
      },
      
      assets: {
        files: [ 
          'src/assets/**/*'
        ],
        tasks: [ 'copy:build_app_assets', 'copy:build_vendor_assets' ]
      },
      
      hbs: {
        files: [ '<%= app_files.hbs %>' ],
        tasks: [ 'views:build' ]
      },
      
      tpls: {
        files: [ 
          '<%= app_files.atpl %>', 
          '<%= app_files.ctpl %>'
        ],
        tasks: [ 'html2js' ]
      },
      
      compass: {
        files: [ 'src/**/*.scss' ],
        tasks: [ 
          'compass:build',
          'concat:build_css'
        ]
      },
      
      jsunit: {
        files: [
          '<%= app_files.jsunit %>'
        ],
        tasks: [ 'jshint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon:dev', 'delta'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          env: {
            PORT: '<%= dev_server_port %>'
          },
          cwd: '<%= build_dir %>'
        }
      },
      prod: {
        script: 'server.js',
        options: {
          env: {
            PORT: '<%= dev_server_port %>'
          },
          cwd: '<%= compile_dir %>'
        }
      }
    },

    shell: {
      production_deploy_init: {
        command: 'sh <%= scripts_dir %>/server_init.sh <%= compile_deploy_dir %> <%= prod_repo %> push_prod',
        options: {
          stdout: true
        }
      },
      production_deploy_push: {
        command: [
          'git add .',
          'git commit -a -m "automatically pushed to production"',
          'git push push_prod master -f'
        ].join('&&'),
        options: {
          stdout: true,
          execOptions: {
            cwd: '<%= compile_deploy_dir %>'
          }
        }
      }
    },

    execute: {
      cache: {
        src: [
          '<%= scripts_dir %>/cache.js'
        ]
      }
    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );
  
  grunt.renameTask( 'watch', 'delta' );
  
  grunt.registerTask( 'watch', [ 'build', 'karma:unit', 'concurrent:dev' ] );
  
  grunt.registerTask( 'default', [ 'build', 'compile' ] );
  
  grunt.registerTask( 'build', [
    'clean', 'html2js', 'jshint', 'copy:build_app_assets', 'compass:build', 'concat:build_css', 'copy:build_vendor_assets', 'copy:build_appjs', 'copy:build_vendorjs', 'copy:build_server', 'concat:build_parent_js', 'views:build', 'mrsl_parent:build', 'karmaconfig', 'karma:continuous', 'copy:build_package_json'
  ]);
  
  grunt.registerTask( 'compile', [
    'copy:compile_assets', 'compass:compile', 'ngmin', 'concat:compile_js', 'concat:compile_parent_js', 'uglify', 'copy:compile_server', 'copy:compile_package_json', 'views:compile', 'mrsl_parent:compile'
  ]);

  /**
   * The `dev-server` task runs development code on local server
   */
  grunt.registerTask( 'dev-server', [ 'nodemon:dev']);

  /**
   * The `prod-server` task runs production-ready code on the local server
   */
  grunt.registerTask( 'prod-server', [ 'nodemon:prod']);

  /**
   * The `push-production` task pushes the site to heroku (morsel-press-widget.eatmorsel.com)
   */
  grunt.registerTask( 'push-production', [ 'shell:production_deploy_init', 'copy:compile_deploy', 'shell:production_deploy_push' ]);

  /**
   * The `cache` task caches all morsel data and pushes it to s3
   */
  grunt.registerTask('cache', ['execute:cache']);
  
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }
  
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }

  grunt.registerMultiTask( 'views', 'Process frame templates', function () {
    var dirRE = new RegExp( '^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g' );
    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });

    grunt.file.copy(grunt.config('view_dir') + '/place.hbs', this.data.dir + '/' + grunt.config('view_dir') + '/place.hbs', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config( 'pkg.version' )
          }
        });
      }
    });

    grunt.file.copy(grunt.config('view_dir') + '/404.hbs', this.data.dir + '/' + grunt.config('view_dir') + '/404.hbs', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config( 'pkg.version' )
          }
        });
      }
    });
  });

  grunt.registerMultiTask( 'mrsl_parent', 'Process parent templates', function () {
    var dirRE = new RegExp( '^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g' );
    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });

    grunt.file.copy(grunt.config('view_dir') + '/parent.hbs', this.data.dir + '/' + grunt.config('view_dir') + '/parent.hbs', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config( 'pkg.version' )
          }
        });
      }
    });
  });

  grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS( this.filesSrc );
    
    grunt.file.copy( 'karma/karma-unit.tpl.js', grunt.config( 'build_dir' ) + '/karma-unit.js', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

};
