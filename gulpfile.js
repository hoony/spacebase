var options, paths,
  path = require("path"),
  gulp = require("gulp"),

  clean = require("gulp-clean"),
  compass = require("gulp-compass"),
  markdown = require("gulp-markdown"),
  removeLines = require("gulp-remove-lines"),
  shell = require("gulp-shell"),
  zip = require("gulp-zip");

paths = {
  clean: [
    "zip/**/*"
  ],
  jekyll: {
    build: "site",
    source: "docs",
    includes: "docs/_includes",
    all: "docs/**/*"
  },
  readme: "README.md",
  scss: "scss/**/*.scss",
  zip: [
    "javascripts/**/*",
    "scss/**/*",
    "stylesheets/",
    "images/",
    "fonts/",
    "config.rb",
    "styleguide.html"
  ]
};

options = {
  compass: {
    project: path.join(__dirname, '/'),
    css: "docs/css",
    sass: "scss",
    style: "compressed",
    relative: true,
    comments: false
  }
};

gulp.task("readme", function() {
  return gulp.src(paths.readme)
    .pipe(markdown())
    .pipe(removeLines({filters: [
      /logo/,
      /id="spacebase"/
    ]}))
    .pipe(gulp.dest(paths.jekyll.includes));
});

gulp.task("compass", function() {
  return gulp.src(paths.scss)
    .pipe(compass(options.compass))
    .pipe(gulp.dest("docs/css"));
});

gulp.task("clean", function() {
  gulp.src(paths.clean)
    .pipe(clean());
});

gulp.task("zip", ["clean"], function() {
  gulp.src(paths.zip, {base: "./"}).pipe(gulp.dest("zip/"));
  gulp.src("zip/*")
    .pipe(zip('spaceBase.zip'))
    .pipe(gulp.dest('docs'));
});

gulp.task("jekyll", shell.task([
  "jekyll build --source " + paths.jekyll.source +
  " --destination " + paths.jekyll.build
]));

gulp.task("serve", shell.task([
  "jekyll serve --watch --source " + paths.jekyll.source +
  " --destination " + paths.jekyll.build
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

