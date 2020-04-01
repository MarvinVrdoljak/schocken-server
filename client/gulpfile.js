var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    importCss = require('gulp-import-css');

var paths = {
    styles: {
        src: "./assets/scss/**/*.scss",
        dest: "./src"
    },
    images: {
        src: "./assets/images/**/*",
        dest: "./src/images"
    },
    fonts: {
        src: "./src/assets/fonts/**/*",
        dest: "./dist/fonts"
    }
};

function style() {
    return (
        gulp
            .src(paths.styles.src)
            .pipe(sourcemaps.init())
            .pipe(sass())
            .on("error", sass.logError)
            .pipe(importCss())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(paths.styles.dest))
    );
}

function styleMinified() {
    return (
        gulp
            .src(paths.styles.src)
            .pipe(sourcemaps.init())
            .pipe(sass())
            .on("error", sass.logError)
            .pipe(importCss())
            .pipe(postcss([autoprefixer(
                {
                    browsers: ['last 2 versions', 'Safari >= 8', 'ie >= 10', 'ios >= 7'],
                    cascade: false
                }
            ), cssnano()]))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(paths.styles.dest))
    );
}


function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}

function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
}


function watch() {
    gulp.watch(paths.styles.src, style)
}

function watchjs() {
    gulp.watch('./src/assets/js/**/*.js', scripts)
}


gulp.task("default", gulp.parallel(watch, images));
gulp.task("watch", gulp.parallel(watch));
gulp.task("build", gulp.parallel(styleMinified, images, fonts));