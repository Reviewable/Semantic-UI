const eleventy = require("@11ty/eleventy");

module.exports = function (grunt) {

  var

    defaultTasks = [
      'copy:readme',

      'build',

      'build-docs',

      'connect',

      'watch'
    ],

    buildTasks = [
      'clean:build',

      'copy:srcToBuild',

      'less:buildCSS',

      'autoprefixer:prefixBuild',

      'concat:createCSSPackage',

      'concat:createLofiPackage',

      'concat:createDarkPackage',

      'concat:createJSPackage',
    ],

    watchTasks = [
      'build',

      'build-docs',
    ],

    resetTasks = [
      'clean:build',

      'clean:release'
    ],

    releaseTasks = [
      'build',

      'uglify:createMinJSPackage',

      'cssmin:createMinCSSPackage',

      'clean:release'
    ],

    setWatchFiles = function (action, filePath) {
      var
        buildPath = filePath.replace('src/', 'docs/build/uncompressed/').replace('less', 'css')
        ;
      if (filePath.search('.less') !== -1) {
        grunt.config('autoprefixer.prefixFile.src', buildPath);
      }
      else {
        grunt.config('autoprefixer.prefixFile.src', 'non/existant/path');
      }
    },

    // this allows filenames with multiple extensions to be preserved
    preserveFileExtensions = function (folder, filename) {
      return folder + filename.substring(0, filename.lastIndexOf('.')) + '.css';
    },

    config
    ;

  config = {

    package: grunt.file.readJSON('package.json'),

    /*******************************
                 Watch
    *******************************/

    watch: {
      options: {
        livereload: 1337
      },
      src: {
        files: [
          'static/**/*.njk',
          'build/examples/**/*',
          'src/**/*.less',
          'src/**/*.js'
        ],
        tasks: watchTasks
      }
    },

    connect: {
      options: {
        livereload: true,
        hostname: 'localhost',
        base: 'docs',
        port: 9000
      },
      livereload: {
        options: {
          open: true
        }
      }
    },

    /*******************************
                Build
    *******************************/
    autoprefixer: {
      options: {
        browsers: [
          'last 2 version',
          '> 1%',
          'opera 12.1',
          'ff >= 10',
          'safari 6',
          'ie 9',
          'bb 10',
          'android 3'
        ]
      },
      prefixBuild: {
        expand: true,
        cwd: 'build/',
        dest: 'build/',
        src: [
          '**/*.less',
          '**/*.css',
          '!historical/*'
        ]
      }
    },

    clean: {
      options: {
        force: true
      },
      build: [
        'build/packaged',
        'build/uncompressed'
      ],
      release: [
        'docs/build',
      ]
    },

    less: {
      options: {
        paths: ['src'],
        compress: false,
        optimization: 2
      },
      buildCSS: {
        expand: true,
        cwd: 'src',
        src: [
          '**/*.less'
        ],
        dest: 'build/uncompressed/',
        rename: preserveFileExtensions
      }
    },

    copy: {

      readme: {
        files: [{
          expand: true,
          cwd: '.',
          src: 'README.md',
          dest: 'static/'
        }]
      },

      srcToBuild: {

        files: [
          // copy everything but less files for uncompressed release
          {
            expand: true,
            cwd: 'src/',
            src: [
              '**/*.js',
              'images/*',
            ],
            dest: 'build/uncompressed'
          },
          // copy assets only for packaged version
          {
            expand: true,
            cwd: 'src/',
            src: [
              'images/*',
            ],
            dest: 'build/packaged'
          }
        ]
      },

    },

    compress: {
      options: {
        archive: 'docs/build/semantic.zip'
      },
      everything: {
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: [
              '**'
            ]
          }
        ]
      }
    },

    concat: {
      options: {},
      createCSSPackage: {
        src: ['build/uncompressed/**/*.css',
          '!build/uncompressed/lofi.theme.css',
          '!build/uncompressed/sample.dark.css'
        ],
        dest: 'build/packaged/css/semantic.css'
      },
      createLofiPackage: {
        src: ['build/uncompressed/lofi.theme.css'],
        dest: 'build/packaged/css/semantic.lofi.css'
      },
      createDarkPackage: {
        src: ['build/uncompressed/sample.dark.css'],
        dest: 'build/packaged/css/semantic.dark.css'
      },
      createJSPackage: {
        src: ['build/uncompressed/**/*.js'],
        dest: 'build/packaged/javascript/semantic.js'
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0,
        report: 'min',
        banner: '' +
          '/*\n' +
          '* # <%= package.title %>\n' +
          '* Version: <%= package.version %>\n' +
          '* http://github.com/jlukic/semantic-ui\n' +
          '*\n' +
          '*\n' +
          '* Copyright <%= grunt.template.today("yyyy") %> Contributors\n' +
          '* Released under the MIT license\n' +
          '* http://opensource.org/licenses/MIT\n' +
          '*\n' +
          '* Released: <%= grunt.template.today("mm/dd/yyyy") %>\n' +
          '*/\n'
      },

      // add comment banner to css release
      createMinCSSPackage: {
        files: {
          'build/packaged/css/semantic.min.css': [
            'build/uncompressed/**/*.css'
          ]
        }
      }
    },

    uglify: {

      createMinJSPackage: {
        options: {
          mangle: true,
          compress: true,
          banner: '' +
            '/*' +
            '* # <%= package.title %>\n' +
            '* Version: <%= package.version %>\n' +
            '* http://github.com/jlukic/semantic-ui\n' +
            '*\n' +
            '*\n' +
            '* Copyright <%= grunt.template.today("yyyy") %> Contributors\n' +
            '* Released under the MIT license\n' +
            '* http://opensource.org/licenses/MIT\n' +
            '*\n' +
            '* Release Date: <%= grunt.template.today("mm/dd/yyyy") %>\n' +
            '*/\n'
        },
        files: {
          'build/packaged/javascript/semantic.min.js': [
            'build/uncompressed/**/*.js'
          ]
        }
      }
    }

  };

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-clear');

  grunt.initConfig(config);

  grunt.registerTask('default', defaultTasks);
  grunt.registerTask('release', releaseTasks);
  grunt.registerTask('build', buildTasks);
  grunt.registerTask('reset', resetTasks);

  grunt.registerTask('build-docs', async function () {
    const done = this.async();
    let ssg = new eleventy("static", "docs", {
      quietMode: true,
      configPath: ".eleventy.js",
    });
    await ssg.write();
    done();
  })

  // compiles only changed less files <https://npmjs.org/package/grunt-contrib-watch>
  grunt.event.on('watch', setWatchFiles);
};
