// Based on https://github.com/chadly/requirejs-web-workers
/**
 * This RequireJS plugin allows loading of web workers identified by
 * the string passed to the plugin. If the url defining the worker
 * script is accessible (on the same domain), then it is loaded. If
 * this is a cross-domain request, an attempt is made to retrieve
 * the worker and construct it. In either case, a Promise object is
 * returned which will have the asyncronously-loaded worker 
 * available. Set the relevant callbacks using the `then` function of
 * the returned Promise object.
 */
define(function (text, ko) {

  /**
   * Retrieve the web worker at the given URL. If the worker can be
   * loaded then a Promise is returned. The Promise is fulfilled when
   * the worker is loaded. If the worker cannot be loaded, and the
   * conditions are known on execution of this function, then false
   * is returned.
   * @param {string} url - The url to the web worker script.
   * @return {Promise} - The Promise object holding the future
   *   web worker, or false if it cannot be loaded.
   */
  function getWorkerPromise(url) {
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
                var blob = new Blob(
                  [request.responseText],
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
      onLoad(getWorkerPromise(url));
    }
  };
});
