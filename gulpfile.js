const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const merge = require('merge-stream');

function serve() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
}

function html() {
    return gulp.src('src/**/*.html')
        .pipe(plumber())
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({ stream: true }));
}

function css() {
    return gulp.src('src/styles/**/*.css')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({ stream: true }));
}

function js() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(plumber())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.reload({ stream: true }));
}

function staticAssets() {
    return merge(
        gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif,css}')
            .pipe(gulp.dest('dist/images'))
            .pipe(browserSync.reload({ stream: true })),
        gulp.src('src/fonts/**/*.{woff,woff2,otf,ttf,eot,css}')
            .pipe(gulp.dest('dist/fonts'))
            .pipe(browserSync.reload({ stream: true }))
    );
}

function clean() {
    return del('dist');
}

function watchFiles() {
    gulp.watch(['src/**/*.html'], html);
    gulp.watch(['src/styles/**/*.css'], css);
    gulp.watch(['src/scripts/**/*.js'], js);
    gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], staticAssets);
    gulp.watch(['src/fonts/**/*.{woff,woff2,otf,ttf,eot}'], staticAssets);
}

const build = gulp.series(clean, gulp.parallel(html, css, staticAssets, js));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.css = css;
exports.js = js
exports.staticAssets = staticAssets;
exports.clean = clean;
exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;