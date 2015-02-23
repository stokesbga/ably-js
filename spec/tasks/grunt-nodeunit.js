"use strict";

var fs = require('fs'),
    path = require('path'),
    shell = require('shelljs');

module.exports = function (grunt) {
  var test = grunt.option('test'),
      helpers = ['spec/support/modules_helper.js', 'spec/support/test_helper.js'],
      tearDown = ['spec/support/tear_down.js'];

  function getRelativePath(files) {
    return files.map(function(helperPath) {
      var fullPath = path.join(path.dirname(fs.realpathSync(__filename)), '../..', helperPath);
      return path.relative(process.cwd(), fullPath);
    });
  }

  function resolveTests(testString) {
    return testString.split(',').map(function(test) {
      var fullPath = path.join(process.cwd(), test);
      return path.relative(process.cwd(), fullPath);
    });
  }

  grunt.registerTask('nodeunit',
    'Run the NodeUnit test suite.\nOptions\n  --test [tests] e.g. --test test/rest/auth.js',
    function() {
      var runTests = getRelativePath(helpers).concat(['spec/**/*.test.js']).concat(getRelativePath(tearDown)).join(' ');
      grunt.log.writeln("Running NodeUnit test suite against " + (test ? test : 'all tests'));

      if (test) {
        runTests = getRelativePath(helpers).concat(resolveTests(test)).concat(getRelativePath(tearDown)).join(' ');
      }

      if (shell.exec('node_modules/nodeunit/bin/nodeunit ' + runTests).code !== 0) {
        grunt.log.error("NodeUnit tests failed!");
        shell.exit(1);
      } else {
        grunt.log.ok("NodeUnit tests passed");
      }
    });
};
