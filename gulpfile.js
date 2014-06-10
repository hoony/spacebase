var options, paths,
  path = require("path"),
  gulp = require("gulp"),

  clean = require("gulp-clean"),
  markdown = require("gulp-markdown"),
  removeLines = require("gulp-remove-lines"),
  shell = require("gulp-shell");

paths = {
  clean: [
    "dist/**/*"
  ],
  jekyll: {
    build: "docs/_site",
    source: "docs",
    includes: "docs/_includes",
    all: "docs/**/*"
  },
  readme: "README.md",
  scss: "scss/**/*.scss"
};

options = {};

gulp.task("readme", function() {
  return gulp.src(paths.readme)
    .pipe(markdown())
    .pipe(removeLines({filters: [
      /logo/,
      /id="spacebase"/
    ]}))
    .pipe(gulp.dest(paths.jekyll.includes));
});

gulp.task("clean", function() {
  gulp.src(paths.clean).pipe(clean());
});

// I'd like to use gulp-zip or something but it doesn't seem to support zipping
// up empty directories like fonts/ and javascripts/, which we want.
gulp.task("zip", ["clean"], shell.task([
  "cp -r src spacebase-latest " +
  "&& zip -ur dist/spaceBase-latest.zip spacebase-latest " +
  "&& rm -r spacebase-latest"
]));

gulp.task("jekyll", shell.task([
  "cd " + paths.jekyll.source + " && jekyll build"
]));

gulp.task("serve", shell.task([
  "cd " + paths.jekyll.source + " && jekyll serve --watch"
]));

gulp.task("deploy", shell.task([
  "git subtree push --prefix " + paths.jekyll.source + " origin gh-pages"
]));

gulp.task("watch", function() {
  gulp.watch([paths.readme], ["readme"]);
});

gulp.task("docs", ["readme", "jekyll"]);
gulp.task("dev", ["docs", "watch", "serve"]);

gulp.task("default", ["docs"]);

