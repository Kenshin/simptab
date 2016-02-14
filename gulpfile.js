var gulp   = require( 'gulp' ),
    print  = require( 'gulp-util'   ),
    uglify = require( 'gulp-uglify' ),
    jshint = require( 'gulp-jshint' ),
    stylish= require( 'jshint-stylish'),
    stylus = require( 'gulp-stylus' ),
    watch  = require( 'gulp-watch'  ),
    connect= require( 'gulp-connect'),
    combin = require('stream-combiner2'),
    combined, colors,
    paths  = {
        src  : 'js/',
        html : '*.html',
        js   : 'js/gallery.js',
        csssrc: 'assets/css/',
        styl : 'assets/css/gallery.styl',
        dest : 'dest-www/'
    };


gulp.task( 'server', function() {
    connect.server({
        port: 8888,
        livereload: true
    })
});

/*
gulp.task( 'js', function() {
    gulp.src( paths.js )
        .pipe( jshint() )
        .pipe( jshint.reporter( stylish ))
        .pipe( uglify() )
        .pipe( gulp.dest( paths.dest + 'js' ) );
});
*/

gulp.task( 'watchhtml', function() {
    gulp.watch( paths.html, function() {
        gulp.src( paths.html ).pipe( connect.reload() );
    });
});

gulp.task( 'jshint', function() {
    gulp.src( paths.js )
        .pipe( jshint() )
        .pipe( jshint.reporter( stylish ))
});

gulp.task( 'watchjs', function() {
    gulp.watch( paths.js, function( event ) {
        print.log( print.colors.green( event.type ) + ' ' + event.path );

        combined = combin.obj([
            gulp.src( event.path ),
            jshint(),
            jshint.reporter( stylish ),
            connect.reload()
        ]);
        combined.on( 'error', function( err ) {
            colors = print.colors;
            console.log('\n')
            print.log( colors.red('Error!'))
            print.log( 'fileName: '   + colors.red(err.fileName))
            print.log( 'lineNumber: ' + colors.red(err.lineNumber))
            print.log( 'message: '    + err.message)
            print.log( 'plugin: '     + colors.yellow(err.plugin))
        });
    });
});

gulp.task( 'stylus', function() {
    gulp.src( paths.styl )
        .pipe( stylus() )
        .pipe( gulp.dest( paths.dest + 'assets/css' ) )
});

gulp.task( 'watchstyl', function() {
    gulp.watch( paths.styl, function( event ) {
        print.log( print.colors.green( event.type ) + ' ' + event.path );

        gulp.src( event.path )
        .pipe( stylus() )
        .pipe( gulp.dest( paths.csssrc ) )
        .pipe( connect.reload() );
    });
});

gulp.task( 'default', [ 'server', 'watchhtml', 'jshint', 'watchjs', 'stylus', 'watchstyl' ] );