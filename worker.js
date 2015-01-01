// Based on https://github.com/chadly/requirejs-web-workers
define(function (text, ko) {
  return {
    version: "1.0.0",
    load: function (name, req, onLoad, config) {
      if (config.isBuild) {
        //don't do anything if this is a build, can't inline a web worker
        onLoad();
        return;
      }

      var url = req.toUrl(name);

      if (!!window.Worker) {
        try {
          onLoad(new Worker(url));
        } catch (e) {
          // SecurityException if cross-domain request
          if (e.name == "SecurityError") {
            console.log("Security Error!");
            var request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send(null);
            if (request.status === 200) {
              var blob = new Blob(
                [request.responseText],
                {type: 'application/javascript'}
              );
              try {
                var worker = new Worker(URL.createObjectURL(blob));
                onLoad(worker);
              } catch (e) {
                // SytaxError exception.
                onLoad(false);
              }
            } else {
              onLoad(false);
            }
          }
        }
      } else {
        onload(false);
      }
    }
  };
});
