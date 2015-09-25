/* global require, module, process */
function Cartridge() {
  var Plugin = require('broccoli-plugin');
  var Funnel = require('broccoli-funnel');
  var concat = require('broccoli-concat');
  var mergeTrees = require('broccoli-merge-trees');
  var esTranspiler = require('broccoli-babel-transpiler');
  var env = process.env.ENV;
  var fs = require('fs');
  var path = require('path');
  var yaml = require('yaml-js');
  var manifest = yaml.load(fs.readFileSync('./cartridge.yml'));

  EmbedAssets.prototype = Object.create(Plugin.prototype);
  EmbedAssets.prototype.constructor = EmbedAssets;
  function EmbedAssets(inputNodes, options) {
    if (!(this instanceof EmbedAssets)) { return new EmbedAssets(inputNodes, options); }
    Plugin.call(this, [inputNodes]);

    this.outputFile = options.outputFile;
  }
  EmbedAssets.prototype.build = function () {
    var tree = this.inputPaths[0];
    var script = fs.readFileSync(tree + '/main.js');
    var index = fs.readFileSync('index.html').toString();

    fs.writeFileSync(path.join(this.outputPath, this.outputFile),
                     index.replace('{{script}}', script)
                          .replace(/\{\{name\}\}/g, manifest.name));
  }

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

  var js = concat(transpile('assets', { modules: 'amd' }), {
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

  return new EmbedAssets(concat(mergeTrees([vendor, js]), {
    inputFiles: [
      'vendor.js',
      'main.amd.js'
    ],
    outputFile: '/main.js'
  }), {
    outputFile: '/index.html'
  });
}

module.exports = new Cartridge();
