var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  svgSprite = require('gulp-svg-sprite'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio');

var settings = {
  assetsDir: './assets/',
  outDir: './dist/',
  sassFiles: './assets/sass/**/*.scss'
}

gulp.task('sass', ["svgSpriteBuild"], function () {
  return gulp.src(settings.sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(settings.outDir + 'css'))
    .pipe(browserSync.reload({stream: true}));
});

/**
 * Wait for jade and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass'], function () {
  browserSync.init({
    server: {
      baseDir: './',
      index: "index.html"
    },
    notify: false
  });
});

gulp.task('watch', function () {
  gulp.watch(settings.sassFiles, ['sass']);
});

gulp.task('svgSpriteBuild', function () {
  return gulp.src(settings.assetsDir + 'i/icons/*.svg')
    // minify svg
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    // remove all fill, style and stroke declarations in out shapes
    .pipe(cheerio({
      run: function ($) {
        //$('[fill]').removeAttr('fill');
        //$('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      }
      , parserOptions: {
        xmlMode: true
      }
    }))
    // build svg sprite
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "sprite.svg",
          render: {
            scss: {
              dest: '../../assets/sass/_sprite.scss',
              template: settings.assetsDir + "sass/templates/_sprite_template.scss"
            }
          }
        }
      }
    }))
    .pipe(gulp.dest(settings.outDir));
});

gulp.task("default", ["svgSpriteBuild", "sass"]);

gulp.task("server", ["browser-sync", "watch"]);
