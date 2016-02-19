var gulp   = require( 'gulp' ),
    print  = require( 'gulp-util'   ),
    notify = require( 'gulp-notify' ),
    plumber= require( 'gulp-plumber'),
    jshint = require( 'gulp-jshint' ),
    stylish= require( 'jshint-stylish'),
    stylus = require( 'gulp-stylus' ),
    csslint= require( 'gulp-csslint'),
    watch  = require( 'gulp-watch'  ),
    connect= require( 'gulp-connect'),
    open   = require( 'gulp-open'   ),
    clean  = require( 'gulp-clean'  ),
    htmlmin= require( 'gulp-htmlmin'),
    uglify = require( 'gulp-uglify' ),
    minicss= require( 'gulp-minify-css'),
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
    connect.server({
        port: 8888,
        livereload: true
    })
});

gulp.task( 'srv:deploy', function() {
    connect.server({
        root: paths.dest,
        port: 8888,
        livereload: true
    })
});

gulp.task( 'open', function() {
    gulp.src( __filename ).pipe( open({ uri: 'http://localhost:8888' }));
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
            lint( path ).pipe( connect.reload() );
        }
        else if ( restyl.test( path )) {
            stylcss( path ).pipe( gulp.dest( paths.csssrc ) ).pipe( connect.reload() );
        }
        else if ( rehtml.test( path )) {
            gulp.src( path ).pipe( connect.reload() );
        }
    });
});

gulp.task( 'default', [ 'srv:develop', 'jshint', 'csslint', 'watch', 'open' ] );

gulp.task( 'clean', function() {
    return gulp.src( paths.dest ).pipe( clean() );
})

gulp.task( 'html', function() {
    gulp.src( paths.html ).pipe( htmlmin({collapseWhitespace: true}) ).pipe( gulp.dest( paths.dest ) );
});

gulp.task( 'css', function() {
    gulp.src( paths.styl )
    .pipe( stylus()  )
    .pipe( minicss() )
    .pipe( gulp.dest( paths.dest + paths.csssrc ) );
});

gulp.task( 'copy', function() {
    gulp.src( paths.icon             ).pipe( gulp.dest( paths.dest               ));
    gulp.src( paths.image + '*.*'    ).pipe( gulp.dest( paths.dest + paths.image ));
    gulp.src( paths.font  + '*.*'    ).pipe( gulp.dest( paths.dest + paths.font  ));
    gulp.src( paths.local + '**/*.*' ).pipe( gulp.dest( paths.dest + paths.local ));
});

gulp.task( 'js', function() {
    gulp.src( paths.js )
        .pipe( jshint() )
        .pipe( jshint.reporter( stylish ))
        .pipe( uglify() )
        .pipe( gulp.dest( paths.dest + 'js' ) );
});

gulp.task( 'publish', [ 'clean' ], function() {
    gulp.start( 'html', 'css', 'js', 'copy', 'srv:deploy', 'open' );
});
