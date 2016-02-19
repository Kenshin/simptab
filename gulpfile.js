var gulp   = require( 'gulp' ),
    print  = require( 'gulp-util'   ),
    notify = require( 'gulp-notify' ),
    plumber= require( 'gulp-plumber'),
    jshint = require( 'gulp-jshint' ),
    stylish= require( 'jshint-stylish'),
    stylus = require( 'gulp-stylus' ),
    csslint= require('gulp-csslint' ),
    watch  = require( 'gulp-watch'  ),
    connect= require( 'gulp-connect'),
    open   = require( 'gulp-open'   ),
    clean  = require( 'gulp-clean'  ),
    htmlmin= require( 'gulp-htmlmin'),
    uglify = require( 'gulp-uglify' ),
    minicss= require( 'gulp-minify-css'),
    colors = print.colors,
    lint   = function( filepaths ) {
        return gulp.src( filepaths )
                   .pipe( jshint() )
                   .pipe( jshint.reporter( stylish ))
                   .pipe( notify({ title: 'Jshint Error', message: function ( file ) {
                     if (file.jshint.success) return false;
                     return file.relative + " ( " + file.jshint.results.length + " errors )";
                   }, sound: 'Frog' }));
    },
    stylcss= function ( filepaths ) {
        return gulp.src( filepaths )
                   .pipe( plumber())
                   .pipe( stylus() )
                   .pipe( csslint())
                   .pipe( csslint.reporter());
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

gulp.task( 'watchhtml', function() {
    gulp.watch( paths.html, function() {
        gulp.src( paths.html ).pipe( connect.reload() );
    });
});

gulp.task( 'jshint', function() { lint( paths.js ); });

gulp.task( 'watchjs', function() {
    gulp.watch( paths.js, function( event ) {
        print.log( colors.bgYellow( 'Watch file: ' ) + event.path + ' ' + print.colors.green( event.type ));
        lint( event.path ).pipe( connect.reload() );
    });
});

gulp.task( 'stylus', function() {
    stylcss( paths.styl ).pipe( gulp.dest( paths.dest + 'assets/css' ) );
});

gulp.task( 'watchstyl', function() {
    gulp.watch( paths.styl, function( event ) {
        print.log( colors.bgYellow( 'Watch file: ' ) + event.path + ' ' + print.colors.green( event.type ));
        stylcss( event.path )
        .pipe( gulp.dest( paths.csssrc ) )
        .pipe( connect.reload() );
    });
});

gulp.task( 'default', [ 'srv:develop', 'watchhtml', 'jshint', 'watchjs', 'stylus', 'watchstyl', 'open' ] );

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
