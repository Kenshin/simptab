var gulp   = require( 'gulp' ),
	print  = require( 'gulp-util'   ),
	uglify = require( 'gulp-uglify' ),
	jshint = require( 'gulp-jshint' ),
	stylish= require( 'jshint-stylish'),
	stylus = require( 'gulp-stylus' ),
	watch  = require( 'gulp-watch'  ),
	watchP = require( 'gulp-watch-path'),
	combiner = require('stream-combiner2'),
	changes, combined, colors,
	paths  = {
		src  : 'js/',
		js   : 'js/gallery.js',
		styl : 'assets/css/gallery.styl',
		dest : 'dest-www/'
	};


gulp.task( 'js', function() {
	gulp.src( paths.js )
		.pipe( jshint() )
		.pipe( jshint.reporter( stylish ))
		.pipe( uglify() )
		.pipe( gulp.dest( paths.dest + 'js' ) );
});

gulp.task( 'stylus', function() {
	gulp.src( paths.styl )
		.pipe( stylus() )
		.pipe( gulp.dest( paths.dest + 'assets/css' ) )
});

gulp.task( 'jshint', function() {
	gulp.src( paths.js )
		.pipe( jshint() )
		.pipe( jshint.reporter( stylish ))
});

gulp.task( 'watch', function() {
	gulp.watch( paths.js, function( event ) {
		changes = watchP( event, paths.src, paths.dest );

		print.log( print.colors.green( event.type ) + ' ' + changes.srcPath );
        print.log( 'Dest ' + changes.distPath );

		combined = combiner.obj([
	        gulp.src( changes.srcPath ),
			jshint(),
	        jshint.reporter( stylish )
		]);
		combined.on( 'error', function( err ) {
			colors = print.colors;
			console.log('\n')
		    print.log(colors.red('Error!'))
		    print.log('fileName: ' + colors.red(err.fileName))
		    print.log('lineNumber: ' + colors.red(err.lineNumber))
		    print.log('message: ' + err.message)
		    print.log('plugin: ' + colors.yellow(err.plugin))
		});
	});
});

gulp.task( 'default', [ 'jshint', 'watch' ] );