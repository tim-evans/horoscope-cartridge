/* global require, module, process */
function Cartridge() {
  var Funnel = require('broccoli-funnel');
  var concat = require('broccoli-concat');
  var mergeTrees = require('broccoli-merge-trees');
  var esTranspiler = require('broccoli-babel-transpiler');
  var env = process.env.ENV;
  var fs = require('fs');
  var yaml = require('yaml-js');
  var manifest = yaml.load(fs.readFileSync('./cartridge.yml'));

  var transpile = function (tree, opts) {
    return esTranspiler(tree, {
      stage: 0,
      moduleIds: true,
      modules: opts.modules,
      loose: ['es6.classes', 'es6.modules'],

      // Transforms /index.js files to use their containing directory name
      getModuleId: function (name) {
        name = manifest.name + '/' + name;
        return name.replace(/\/index$/, '');
      },

      // Fix relative imports inside /index's
      resolveModuleSource: function (source, filename) {
        var match = filename.match(/(.+)\/index\.\S+$/i);

        // is this an import inside an /index file?
        if (match) {
          var path = match[1];
          return source
            .replace(/^\.\//, path + '/')
            .replace(/^\.\.\//, '');
        } else {
          return source;
        }
      }
    });
  };

  var js = concat(transpile('assets', { modules: 'umd' }), {
    inputFiles: [
      '**/*.js'
    ],
    outputFile: '/main.amd.js'
  });

  var css = concat('assets', {
    inputFiles: [
      '**/*.css'
    ],
    outputFile: '/' + manifest.name + '.css'
  });

  var bowerDependencies = Object.keys(require('./bower.json').dependencies);
  var bowerDependencyFiles = bowerDependencies.map(function (module) {
    return module + '/' + require('./bower_components/' + module + '/bower.json').main;
  });

  var vendor = concat(new Funnel('bower_components', { include: bowerDependencyFiles, }), {
    inputFiles: [
      '**/*.js'
    ],
    outputFile: '/vendor.js'
  });
  var uglify = require('broccoli-uglify-js');
  vendor = uglify(vendor);

  return concat(mergeTrees([vendor, js]), {
    inputFiles: [
      '**/*.js'
    ],
    outputFile: '/' + manifest.name + '.js'
  });
}

module.exports = new Cartridge();
