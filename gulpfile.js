const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify-es").default;;
const imagemin = require("gulp-imagemin");
const sync = require("browser-sync").create();
const webp = require("gulp-webp");
const del = require("del");
// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

// Scripts
const scripts = () => {
  return gulp.src("source/js/scripts.js")
    .pipe(uglify())
    .pipe(rename("scripts.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
}

exports.images = images;

// Webp Converter

const createWebp = () => {
  return gulp.src("source/img/*.{jpg,png}")
    .pipe(webp({ quality: 75 }))
    .pipe(gulp.dest("build/img"));
}

exports.createWebp = createWebp;

// Copy убрано копирование неоптимизрованных изображений исходя из критерия Б25- "source/img/**/*.{jpg,png,svg,webp}"
const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff2,woff}"
  ],
    {
      base: "source"
    })
    .pipe(gulp.dest("build"));
}

exports.copy = copy;

// Clean
const clean = () => {
  return del("build");
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series(html)).on("change", sync.reload);
}

// Build
const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    copy,
    scripts,
    images,
    createWebp
  )
)


exports.build = build;

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    copy,
    scripts,
    images,
    createWebp
  ),
  gulp.series(
    server, watcher
  )
);
