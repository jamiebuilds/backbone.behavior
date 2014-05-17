module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      banner: '// Backbone.Behavior v<%= meta.version %>\n'
    },

    preprocess: {
      behavior: {
        src: 'src/wrapper.js',
        dest: 'dist/behavior.js'
      },
      tests: {
        src: 'src/wrapper.js',
        dest: '.tmp/behavior.js'
      }
    },

    template: {
      options: {
        data: {
          version: '<%= meta.version %>'
        }
      },
      behavior: {
        src: '<%= preprocess.behavior.dest %>',
        dest: '<%= preprocess.behavior.dest %>'
      }
    },

    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      behavior: {
        src: '<%= preprocess.behavior.dest %>',
        dest: '<%= preprocess.behavior.dest %>'
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      behavior: {
        src: '<%= preprocess.behavior.dest %>',
        dest: 'dist/backbone.behavior.min.js',
        options: {
          sourceMap: true
        }
      }
    },

    jshint: {
      behavior: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['src/*.js', '!src/wrapper.js']
      },
      tests: {
        options: {
          jshintrc: 'tests/.jshintrc'
        },
        src: ['tests/unit/specs/*.js']
      }
    },

    mochaTest: {
      tests: {
        options: {
          require: 'tests/unit/setup/node.js',
          reporter: 'spec',
          clearRequireCache: true
        },
        src: 'tests/unit/specs/**/*.js'
      }
    },

    watch: {
      tests: {
        options: {
          atBegin: true,
          spawn: false
        },
        files: ['src/**/*.js', 'tests/**/*.js'],
        tasks: ['default']
      }
    }
  });

  grunt.registerTask('test', [
    'preprocess:tests',
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'test',
    'preprocess:behavior',
    'template',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'test'
  ]);
};
