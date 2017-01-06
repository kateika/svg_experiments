var gulp = require('gulp'),
    svgSprite = require('gulp-svg-sprite'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio');

var settings = {
  assetsDir: './assets/'
}

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
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
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
          sprite: "../sprite.svg"
          , render: {
            scss: {
              dest: './dist/sass/_sprite.scss'
              , template: settings.assetsDir + "sass/templates/_sprite_template.scss"
            }
          }
        }
      }
    })).pipe(gulp.dest(settings.assetsDir + 'i/sprite/'));
});

