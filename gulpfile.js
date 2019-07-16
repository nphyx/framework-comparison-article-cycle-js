/* @flow */
const gulp = require("gulp");
const sass = require("gulp-sass");
const webpack = require("webpack");
const fsm = require("fs-magic");
const webpackConfig = require("./webpack.config.js");
// file structure for dist directory
const dist_folders = ["dist/scripts", "dist/styles", "dist/assets", "dist/vendor"];
// mask for dist directory folders
const dist_mask = 0o755;

/**
 * Set up filesystem structure in dist.
 */
gulp.task("fs", async () => {
  await Promise.all(dist_folders.map(async (dir) => {
    try {
      console.log("creating", dir);
      await fsm.mkdirp.call(null, dir, dist_mask, true)
    } catch (e) {
      console.log(e.message);
    }
  }));
});

gulp.task("clean", async () => {
  await Promise.all(dist_folders.map(async (dir) => {
    try {
      console.log("cleaning ", dir);
      await fsm.rmrf.call(null, dir)
    } catch (e) {
      console.log(e.message);
    }
  }));
});

gulp.task("styles", () => {
  return gulp.src(["src/styles/*scss"])
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("dist/styles/"))
});

gulp.task("assets", () => {
  return gulp.src("src/assets/**/*", {dot: true})
    .pipe(gulp.dest("dist/assets/"));
});

gulp.task("markup", () => {
  return gulp.src("src/markup/*", {dot: true})
    .pipe(gulp.dest("dist/"));
});

gulp.task("webpack", (cb) => {
  webpack(webpackConfig, function(err) {
    if (err) console.log(err);
    cb();
  });
});

gulp.task("default", gulp.series("clean", "fs", "webpack", "styles", "assets", "markup"));
