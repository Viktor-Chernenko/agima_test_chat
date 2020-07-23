const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
// const uglify = require('gulp-uglify-es').default;
// const babel = require("gulp-babel");
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const beautify = require('gulp-jsbeautifier');
const reload = browserSync.reload;

// === Пути ===

const src = {
   script: {
      all: './src/js/**/*',
      input: './src/js/**/*.js',
      output: {
         we: './js'
      },
   
      output_name: 'script.js'
   },

   style: {
      input: {
         basis: './src/scss/style.scss',
         all: './src/scss/**/*.scss',
         css: './src/css/**/*.css',
      },

      output: {
         we: './css',
      },

      output_name: 'style.css',
      s_maps: './'
   },

   html: {
      input: {
         basis:'./index.html',
         all: './src/pages/**/*',
         beautify: './**/*.html'
      }
   },

   fonts: {
      input: './src/fonts/**/*',
      output: {
         we: './fonts'
      },
   },

   img: {
      input: './src/images/**',
      output: {
         we: './images'
      },
   },

   pug: {
      input_pug: './src/templates/pug/**/*.pug',
      input_pages: './src/pages/**/*.pug',
      input_index: './src/index.pug',

      output_templates: './templates/',
      output_pages: './pages/',
      output_index: './'
   }
};

// === task ===

gulp.task('beautify', function() {
  gulp.src('./**/*.html')
    .pipe(beautify())
    .pipe(gulp.dest('./'))
});

 gulp.task('pug_index', function() {
   return gulp.src(src.pug.input_index)
   .pipe(pug({pretty: true}))
   .on('error', function (err) {
      console.log(err);
      this.emit('end');
   })
   .pipe(beautify(this))
   .pipe(gulp.dest(src.pug.output_index))
   .pipe(reload({ stream: true }))
 });

gulp.task('styles', () => {
   return gulp.src(src.style.input.basis)
   .pipe(sourcemaps.init())
   .pipe(sass())
   .on('error', function (err) {
      console.log(err);
      this.emit('end');
   })
   .pipe(concat(src.style.output_name))
   .pipe(autoprefixer({
      overrideBrowserslist: ['last 4 versions'], 
      cascade: false
   }))
   // Сжатие CSS
   .pipe(cleanCSS({
      level: 2
   }))
   .pipe(sourcemaps.write(src.style.s_maps))
   .pipe(gulp.dest(src.style.output.we))
   .pipe(reload({ stream: true }))
});

gulp.task('fonts', () => {
   return gulp.src(src.fonts.input)
   .pipe(gulp.dest(src.fonts.output.we))
   .pipe(reload({ stream: true }))
});

gulp.task('del', () => {
   return del([src.style.output.we, src.fonts.output.we, src.img.output.we, './index.html']);
});

gulp.task('img-compress', () => {
   return gulp.src(src.img.input)
   .pipe(imagemin({
      progressive: true
   }))
   .on('error', function (err) {
      console.log(err);
      this.emit('end');
   })
   .pipe(gulp.dest(src.img.output.we))
   .pipe(reload({ stream: true }))
});

gulp.task('watch', () => {
   browserSync.init({
      server: {
         baseDir: "./"
      }
   });
});

gulp.watch(([src.pug.input_pug, src.pug.input_index]), gulp.series('pug_index'));
gulp.watch(src.img.input, gulp.series('img-compress'));
gulp.watch((src.style.input.all), gulp.series('styles'));
gulp.watch(src.fonts.input, gulp.series('fonts'));

gulp.task('default', gulp.series('del', gulp.parallel('fonts', 'img-compress', 'styles', 'pug_index'), 'watch'));