// Canvas drawing utility functions for example scripts.
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else {
        // Browser global.
        root.DrawUtils = factory();
    }
}(this, function() {
  var DrawUtils = {};

  // Takes in an array of x, y objects
  DrawUtils.drawShape = function(shapeInfo, canvas) {
    var context = canvas.getContext('2d');
    context.beginPath();
    var start = shapeInfo.shift();
    context.moveTo(start.x, start.y);
    for (var i = 0; i < shapeInfo.length; i++) {
      context.lineTo(shapeInfo[i].x, shapeInfo[i].y);
    }
    context.lineTo(start.x, start.y);
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();
  }

  DrawUtils.drawPoint = function(point, canvas) {
    var context = canvas.getContext('2d');
    var radius = 5;
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#003300';
    context.stroke();
  }

  DrawUtils.drawPath = function(pathInfo, canvas) {
    var context = canvas.getContext('2d');
    context.beginPath();
    var start = pathInfo.shift();
    context.moveTo(start.x, start.y);
    for (var i = 0; i < pathInfo.length; i++) {
      context.lineTo(pathInfo[i].x, pathInfo[i].y);
    }
    //context.lineTo(start.x, start.y);
    context.lineWidth = 1;
    context.strokeStyle = 'blue';
    context.stroke();
    context.closePath();
    pathInfo.forEach(function(p) {
      DrawUtils.drawPoint(p, canvas);
    });
  }

  // Takes in a polygon, canvas element, and [optional] color string.
  DrawUtils.drawPoly = function(poly, canvas, color) {
    if (typeof color == 'undefined') color = 'black';
    var context = canvas.getContext('2d');
    context.beginPath();
    var start = poly.getPoint(0);
    context.moveTo(start.x, start.y);
    for (var i = 1; i < poly.numpoints; i++) {
      context.lineTo(poly.getPoint(i).x, poly.getPoint(i).y);
    }
    context.lineTo(start.x, start.y);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
  }

  DrawUtils.initCanvasForTiles = function(canvas, tiles) {
    canvas.width = tiles.length * 40;
    canvas.height = tiles[0].length * 40;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#dd0';
  }

  // Draw outlines on canvas.
  DrawUtils.drawOutline = function(shapes, canvas, colorFn) {
    if (typeof colorFn == 'undefined') colorFn = false;
    for (var i = 0; i < shapes.length; i++) {
      if (shapes[i] instanceof Array) {
        DrawUtils.drawShape(shapes[i], canvas);
      } else {
        if (colorFn) {
          var color = colorFn(shapes[i]);
          DrawUtils.drawPoly(shapes[i], canvas, color);
        } else {
          DrawUtils.drawPoly(shapes[i], canvas);
        }
      }
    }
  }
  
  return DrawUtils;
}));
