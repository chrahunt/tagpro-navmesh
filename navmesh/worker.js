// Based on https://github.com/chadly/requirejs-web-workers
/**
 * This RequireJS plugin allows loading of web workers identified by
 * the string passed to the plugin. The `text` RequireJS plugin is used
 * to retrieve the script, so it should work even if the referenced
 * module is on a different domain. A Promise object is returned which
 * will have the asyncronously-loaded worker available. Set the desired
 * callbacks using the `then` function of the returned Promise object.
 * 
 * This plugin supports configurable Web Workers that themselves use
 * RequireJS. Set the location of RequireJS and the baseUrl to be used
 * on the config property of the object passed to `requirejs.config`.
 * Example:
 *     requirejs.config({
 *       config: {
 *         requirejsUrl: 'require.js',
 *         baseUrl: '.'
 *       }
 *     });
 * With the above config, the following will be inserted at the top of
 * the retrieved web worker, assuming you've placed the `worker` plugin
 * in a directory named `js` relative to the root of the domain.
 *     importScripts('http://example.com/js/require.js');
 *     require.config({baseUrl: 'http://example.com/js'});
 * All paths should be relative to the worker plugin script.
 * The possible configurations are:
 * requirejsUrl - template: requirejs - URL to requireJS for web
 *   workers that require it.
 * baseUrl - template: baseUrl - Base URL to use in configuration
 *   options passed to web worker RequireJS.
 */
define(['./lib/text'],
function(  text) {
  /**
   * Retrieve the web worker at the given URL. If the worker can be
   * loaded then a Promise is returned. The Promise is fulfilled when
   * the worker is loaded. If the worker cannot be loaded, and the
   * conditions are known on execution of this function, then false
   * is returned.
   * @param {string} url - The url to the web worker script.
   * @param {string} [header=""] - The header to add to the retrieved
   *   web worker script, if any.
   * @return {Promise} - The Promise object holding the future
   *   web worker, or false if it cannot be loaded.
   */
  function getWorkerPromise(url, header) {
    if (typeof header == 'undefined') header = "";
    if (typeof Promise == 'undefined') return;
    return new Promise(function(resolve, reject) {
      if (!window.Worker) {
        reject(Error("Web workers not available."));
        return;
      }
      text.get(url, function(data) {
        try {
          var worker = makeWebWorker(header + data);
          resolve(worker);
        } catch (e) {
          reject(Error("Syntax error in worker."));
        }
      });
    });
  }

  /**
   * Make a web worker from the provided string.
   * @param {string} content - The content to use as the code for the
   *   web worker.
   * @return {Worker} - The constructed web worker.
   * @throws {SyntaxError} - Thrown if the worker has a syntax error.
   */
  function makeWebWorker(content) {
    var blob = new Blob(
      [content],
      {type: 'application/javascript'}
    );
    var worker = new Worker(URL.createObjectURL(blob));
    return worker;
  }

  /**
   * Get header to be inserted at the top of the worker file prior to loading.
   */
  function getWorkerHeader(req, config) {
    var header = "";
    var rjsUrl = false;
    if (config.config.requirejsUrl) {
      rjsUrl = req.toUrl(config.config.requirejsUrl);
    }
    var baseUrl = false;
    if (config.config.baseUrl) {
      baseUrl = req.toUrl(config.config.baseUrl);
    }

    if (rjsUrl) {
      header = header + "importScripts('" + rjsUrl + "');";
    }

    if (baseUrl) {
      header = header +
        "require.config({" +
          "baseUrl: '" + baseUrl + "'" + 
        "});";
    }
    return header;
  }

  return {
    version: "1.0.0",
    load: function (name, req, onLoad, config) {
      if (config.isBuild) {
        //don't do anything if this is a build, can't inline a web worker
        onLoad();
        return;
      }

      var url = req.toUrl(name);

      var header = getWorkerHeader(req, config);

      onLoad(getWorkerPromise(url, header));
      return;
    },
    pluginBuilder: 'workerBuilder'
  };
});
