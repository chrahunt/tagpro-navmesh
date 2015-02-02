// Based on https://github.com/chadly/requirejs-web-workers
/**
 * This RequireJS plugin allows loading of web workers identified by
 * the string passed to the plugin. If the url defining the worker
 * script is accessible (on the same domain), then it is loaded. If
 * this is a cross-domain request, an attempt is made to retrieve
 * the worker and construct it. In either case, a Promise object is
 * returned which will have the asyncronously-loaded worker 
 * available. Set the desired callbacks using the `then` function of
 * the returned Promise object.
 * 
 * This plugin supports configurable Web Workers that themselves use
 * RequireJS. Within the web worker file, simply place variable values
 * specified below between "{{#" and "#}}". They will be replaced with
 * the relevant configuration values. Configuration values should be
 * set on the config property of the object passed to
 * `requirejs.config`. Example:
 *     requirejs.config({
 *       config: {
 *         requirejsUrl: 'require.js',
 *         baseUrl: '.'
 *       }
 *     });
 * All paths passed via config should be relative to the worker script.
 * The possible configurations are:
 * requirejsUrl - template: requirejs - URL to requireJS for web
 *   workers that require it.
 * baseUrl - template: baseUrl - Base URL to use in configuration
 *   options passed to web worker RequireJS.
 */
define(function () {
  var requirejsPlaceholder = "requirejs";
  var baseUrlPlaceholder = "baseUrl";
  /**
   * Retrieve the web worker at the given URL. If the worker can be
   * loaded then a Promise is returned. The Promise is fulfilled when
   * the worker is loaded. If the worker cannot be loaded, and the
   * conditions are known on execution of this function, then false
   * is returned.
   * @param {string} url - The url to the web worker script.
   * @param {string} [requirejsUrl] - A URL to RequireJS that will be
   *   injected into the script in place of "{{#requirejs#}}".
   * @param {string} [baseUrl] - A baseUrl to use in the configuration
   *   parameters to RequireJS in the script. Will replace
   *   "{{#baseUrl#}}".
   * @return {Promise} - The Promise object holding the future
   *   web worker, or false if it cannot be loaded.
   */
  function getWorkerPromise(url, requirejsUrl, baseUrl) {
    return new Promise(function(resolve, reject) {
      if (!window.Worker) {
        reject(Error("Web workers not available."));
        return;
      }

      try {
        var worker = new Worker(url);
        // Worker loaded successfully.
        resolve(worker);
      } catch (e) {
        // SecurityError if cross-domain request.
        if (e.name == "SecurityError") {
          try {
            var request = new XMLHttpRequest();
            request.open('GET', url);
            request.onload = function() {
              if (request.status === 200) {
                var text = request.responseText;
                if (requirejsUrl) {
                  var rjsRegex = new RegExp("{{#" + requirejsPlaceholder + "#}}", "g");
                  text = text.replace(rjsRegex, requirejsUrl);
                }

                if (baseUrl) {
                  var buRegex = new RegExp("{{#" + baseUrlPlaceholder + "#}}", "g");
                  text = text.replace(buRegex, baseUrl);
                }
                var blob = new Blob(
                  [text],
                  {type: 'application/javascript'}
                );
                try {
                  var worker = new Worker(URL.createObjectURL(blob));
                  resolve(worker);
                } catch (e) {
                  reject(Error("Syntax error in worker."));
                }
              } else {
                reject(Error("Request status returned was: " + request.status));
              }
            }

            request.onerror = function() {
              reject(Error("Network error."));
            }

            request.send();
          } catch (e) {
            // NetworkError if loaded from file://
            reject(Error("Cannot load from file://."));
          }
        } else {
          reject(Error("Worker could not be loaded directly."));
        }
      }
    });
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
      var rjsUrl = false;
      if (config.config.requirejsUrl) {
        rjsUrl = req.toUrl(config.config.requirejsUrl);
      }
      var baseUrl = false;
      if (config.config.baseUrl) {
        baseUrl = req.toUrl(config.config.baseUrl);
      }
      onLoad(getWorkerPromise(url, rjsUrl, baseUrl));
    }
  };
});
