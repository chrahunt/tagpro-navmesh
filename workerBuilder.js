/**
 * Build-compatible implementation of worker plugin
 */
define(['./lib/text'],
function(text) {
  var buildMap = {};
  /**
   * Retrieve the web worker at the given URL. If the worker can be
   * loaded then a Promise is returned. The Promise is fulfilled when
   * the worker is loaded. If the worker cannot be loaded, and the
   * conditions are known on execution of this function, then false
   * is returned.
   * @param {string} content - The content of the web worker to use.
   * @return {Promise} - The Promise object holding the future
   *   web worker, or false if it cannot be loaded.
   */
  function getWorkerPromise(content) {
    return new Promise(function(resolve, reject) {
      if (!window.Worker) {
        reject(Error("Web workers not available."));
        return;
      }

      var blob = new Blob(
        [content],
        {type: 'application/javascript'}
      );
      try {
        var worker = new Worker(URL.createObjectURL(blob));
        resolve(worker);
      } catch (e) {
        reject(Error("Syntax error in worker."));
      }
    });
  }

  var workerBuilder = {
    version: "1.0.0",
    load: function (name, req, onLoad, config) {
      // This script is meant only for builds.
      if (!config.isBuild) {
        onLoad();
        return;
      }
      var url = req.toUrl(name);
      console.log(url);
      text.get(url, function(data) {
        if (config.isBuild) {
          //console.log(data);
          buildMap[name] = data;
          onLoad(data);
        }
      });
    },
    write: function(pluginName, moduleName, write) {
      if (moduleName in buildMap) {
        var content = buildMap[moduleName];
        content = text.jsEscape(content);
        write.asModule(pluginName + "!" + moduleName,
          "define(function() {" +
            "console.log('test');" +
            "var getWorkerPromise = " + getWorkerPromise.toString() + ";" +
            "return getWorkerPromise('" + content + "');" +
          "});\n"
        );
      }
    }
  };
  return workerBuilder;
});
