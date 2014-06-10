var options, paths,
  path = require("path"),
  gulp = require("gulp"),

  clean = require("gulp-clean"),
  markdown = require("gulp-markdown"),
  removeLines = require("gulp-remove-lines"),
  shell = require("gulp-shell"),
  zip = require("gulp-zip");

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
  scss: "scss/**/*.scss",
  zip: [
    "src/**/*"
  ]
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
  gulp.src(paths.clean)
    .pipe(clean());
});

gulp.task("zip", ["clean"], function() {
  return gulp.src(paths.zip, {base: "./"})
    .pipe(zip('spaceBase-latest.zip'))
    .pipe(gulp.dest('dist'));
});

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

gulp.task("default", ["docs", "zip"]);

