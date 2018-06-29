//*** Установленные заваисимости ***
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

//************************************************

gulp.task('browser-sync', function () {    
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    })
});


//*** Файлы scss в css ***

gulp.task('sass', function () {                   
    return gulp.src('src/sass/main.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 10 versions']
    }))
    .pipe(csso())
    .pipe(rename({
        suffix: "-min"
    }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream())
});


//*** Сбор всех файлов JS в папке js-components в один файл ***

gulp.task('scripts', function () {
    return gulp.src('src/js/components/*.js')
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.stream())
});


//*** Сжатие картинок ***

gulp.task('images', function () {
    return gulp.src('src/img/*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest('dist/img'))
});

//*** Отслеживание изменений в файлах ***

gulp.task('watch', ['browser-sync', 'sass', 'scripts'], function () {
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', ['scripts'], browserSync.reload);
});


//===========================================================================//


//*** Удаление папки dist ***
gulp.task('clean', function () {
    return del.sync('dist');  
});

//*** Сбор файлов в продакшн в папку dist ***
gulp.task('build', ['clean', 'images', 'sass', 'scripts'], function () {
    const buildCss = gulp.src('src/css/main-min.css')
    .pipe(plumber())
    .pipe(gulp.dest('dist/css'))
    
    const buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
           
    const buildJs = gulp.src('src/js/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    
    const buildHtml = gulp.src('src/index.html')
    .pipe(gulp.dest('dist'))
    
});

//*** Делает вызов - watch просто через команду gulp ***
gulp.task('default', ['watch']);   
