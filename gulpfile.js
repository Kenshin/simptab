var gulp   = require( 'gulp' ),
    print  = require( 'gulp-util'   ),
    notify = require( 'gulp-notify' ),
    plumber= require( 'gulp-plumber'),
    jshint = require( 'gulp-jshint' ),
    stylish= require( 'jshint-stylish'),
    stylus = require( 'gulp-stylus' ),
    csslint= require( 'gulp-csslint'),
    watch  = require( 'gulp-watch'  ),
    server = require( 'browser-sync').create(),
    clean  = require( 'gulp-clean'  ),
    htmlmin= require( 'gulp-htmlmin'),
    uglify = require( 'gulp-uglify' ),
    minicss= require( 'gulp-minify-css'),
    runsyn = require( 'run-sequence'),
    colors = print.colors,
    message= function( type, file ) {
         if (type.success) return false;
         return file.relative + " ( " + type.results.length + " errors )";
    },
    lint   = function( filepaths ) {
        return gulp.src( filepaths )
                   .pipe( jshint() )
                   .pipe( jshint.reporter( stylish ))
                   .pipe( notify({ title: 'Jshint Error', message: function ( file ) {
                        return message( file.jshint, file );
                   }, sound: 'Frog' }));
    },
    stylcss= function ( filepaths ) {
        return gulp.src( filepaths )
                   .pipe( plumber())
                   .pipe( stylus() )
                   .pipe( csslint())
                   .pipe( csslint.reporter())
                   .pipe( notify({ title: 'CSSLint Error', message: function ( file ) {
                        return message( file.csslint, file );
                   }, sound: 'Frog' }));
    },
    paths  = {
        src  : 'js/',
        dest : 'dest-www/',
        port : 8888,
        html : '*.html',
        js   : 'js/*.js',
        styl : 'assets/css/*.styl',
        icon : 'favicon.ico',
        local: 'locales/',
        csssrc: 'assets/css/',
        font : 'assets/font/',
        image: 'assets/image/'
    };

gulp.task( 'srv:develop', function() {
    server.init({
        server: { baseDir: './' },
        port: paths.port
    });
});

gulp.task( 'srv:deploy', function() {
    server.init({
        server: { baseDir: paths.dest },
        port: paths.port
    });
});

gulp.task( 'jshint', function() { lint( paths.js ); });

gulp.task( 'csslint', function() {
    stylcss( paths.styl ).pipe( gulp.dest( paths.csssrc ) );
});

gulp.task( 'watch', function() {
    gulp.watch( [ paths.html, paths.js, paths.styl ] , function( event ) {
        print.log( colors.bgYellow( 'Watch file: ' ) + event.path + ' ' + print.colors.green( event.type ));
        var rejs   = /\.js$/g,
            restyl = /\.styl/g,
            rehtml = /\.html/g,
            path   = event.path;
        if ( rejs.test( path )) {
            lint( path ).pipe( server.stream() );
        }
        else if ( restyl.test( path )) {
            stylcss( path ).pipe( gulp.dest( paths.csssrc ) ).pipe( server.stream() );
        }
        else if ( rehtml.test( path )) {
            gulp.src( path ).pipe( server.stream() );
        }
    });
});

gulp.task( 'default', [ 'jshint', 'csslint', 'watch', 'srv:develop' ] );

gulp.task( 'clean', function() {
    return gulp.src( paths.dest ).pipe( clean() );
});

gulp.task( 'copy', function( cb ) {
    gulp.src( paths.icon           ).pipe( gulp.dest( paths.dest               ));
    gulp.src( paths.image + '*'    ).pipe( gulp.dest( paths.dest + paths.image ));
    gulp.src( paths.font  + '*'    ).pipe( gulp.dest( paths.dest + paths.font  ));
    gulp.src( paths.local + '**/*' ).pipe( gulp.dest( paths.dest + paths.local ));
    cb();
});

gulp.task( 'html', function() {
    gulp.src( paths.html ).pipe( plumber() ).pipe( htmlmin({collapseWhitespace: true}) ).pipe( gulp.dest( paths.dest ) );
});

gulp.task( 'css', function() {
    gulp.src( paths.styl )
    .pipe( plumber() )
    .pipe( stylus()  )
    .pipe( minicss() )
    .pipe( gulp.dest( paths.dest + paths.csssrc ) );
});

gulp.task( 'js', function() {
    gulp.src( paths.js )
        .pipe( plumber())
        .pipe( jshint() )
        .pipe( jshint.reporter( stylish ))
        .pipe( uglify() )
        .pipe( gulp.dest( paths.dest + 'js' ) );
});

gulp.task( 'publish', [ 'clean' ], function() {
    gulp.start( 'html', 'css', 'js', 'copy' );
});

gulp.task( 'deploy', function( cb ) {
    runsyn(
        'clean',
        'copy',
        [ 'html', 'css', 'js' ],
        'srv:deploy',
        cb
    )
});
