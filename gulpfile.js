var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    es = require('event-stream'),
    glob = require('glob'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    assign = require('lodash.assign');

var sources = 'src/navmesh.js';
var dirs = {
    dev: './build/dev',
    release: './build/release'
};

function bundle(sources, dest) {
    return glob(sources, function (err, files) {
        var streams = files.map(function (entry) {
            return browserify({
                    entries: entry,
                    debug: true,
                    standalone: "NavMesh"
                })
                .bundle()
                .pipe(source(entry.replace(/^src\//, '')))
                .pipe(gulp.dest(dest));
        });
        return es.merge(streams);
    });
}

gulp.task('build-worker', function() {

});
gulp.task('build-dev', function() {
    var bundle = glob(sources, function (err, files) {
        var streams = files.map(function (entry) {
            return browserify({
                    entries: entry,
                    debug: true,
                    standalone: "NavMesh"
                })
                .bundle()
                .pipe(source(entry.replace(/^src\//, '')))
                .pipe(gulp.dest(dirs.dev));
        });
        return es.merge(streams);
    });
    return bundle;
});

// Compile and watchify sourced file.
function watchifyFile(src, out) {
    var opts = assign({}, watchify.args, {
        entries: src,
        standalone: "NavMesh",
        debug: true
    });
    var b = watchify(browserify(opts));
    function bundle() {
        return b.transform('brfs')
            .bundle()
            .on('error', gutil.log.bind(gutil, "Browserify Error"))
            .pipe(source(src.replace(/^src\//, '')))
            .pipe(gulp.dest(out));
    }
    b.on('update', bundle);
    b.on('log', gutil.log);
    return bundle();
}

gulp.task('watch-dev', function() {
    var bundle = glob(sources, function (err, files) {
        var streams = files.map(function (entry) {
            return watchifyFile(entry, dirs.dev);
        });
        return es.merge(streams);
    });
    return bundle;
});

gulp.task('build-prod', function() {
    var bundle = glob(sources, function (err, files) {
        var streams = files.map(function (entry) {
            return browserify({
                    entries: entry,
                    standalone: "NavMesh"
                })
                .bundle()
                .pipe(source(entry.replace(/^src\//, '')))
                .pipe(gulp.dest(dirs.release));
        });
        return es.merge(streams);
    });
    return bundle;
});
