const { task, src, dest, watch, parallel } = require("gulp");
const $ = require("gulp-load-plugins");
const browserSync = require("browser-sync");
const reload = browserSync.reload;
// Sassをコンパイルするプラグインの読み込み
const sass = require("gulp-sass")(require("sass"));

const PATH = {
  BUILD_PATH: "./dist/",
  BUILD_CSS: "./dist/css",
  BUILD_JS: "./dist/js",
  SRC_DIR: "./src",
  SRC_JS_DIR: "./src/js",
  SRC_ASSETS_DIR: "./src/assets",
  SRC_ASSETS_CSS_DIR: "./src/assets/css",
  SRC_ASSETS_SASS_DIR: "./src/assets/sass",
  SRC_ALL_HTML: "./src/*.html",
  SRC_ALL_JS: "./src/*.js",
  SRC_ASSETS_ALL_CSS: "./src/assets/css/*.css",
  SRC_ASSETS_ALL_SASS: "./src/assets/sass/*.scss",
};

/* 
ブラウザシンク
*/
task("browser-sync", function () {
  browserSync({
    notify: false,
    server: {
      baseDir: PATH.BUILD_PATH,
    },
  });
  // HTMLを監視
  watch(PATH.SRC_ALL_HTML, reload);
  // CSSを監視
  watch(PATH.BUILD_CSS, reload);
  // jsを監視
  watch(PATH.BUILD_JS, reload);
});

// style.scssの監視タスクを作成する
task("sass", () => {
  // .scssファイルを監視
  return watch(PATH.SRC_ASSETS_ALL_SASS, () => {
    // .scssの更新があった場合の処理
    return (
      // style.scssファイルを取得
      src(PATH.SRC_ASSETS_ALL_SASS)
        // Sassコンパイル
        .pipe(
          sass({
            outputStyle: "expanded",
          })
            // Sassのコンパイルエラーを表示
            // (これがないと自動的に止まってしまう)
            .on("error", sass.logError)
        )
        // cssフォルダー以下に保存
        .pipe(dest(PATH.BUILD_CSS))
    );
  });
});

task("html", () => {
  // htmlファイルを監視
  return watch(PATH.SRC_ALL_HTML, () => {
    // .scssの更新があった場合の処理
    return (
      // .htmlファイルを取得
      src(PATH.SRC_ALL_HTML)
        // dist/に保存
        .pipe(dest(PATH.BUILD_PATH))
    );
  });
});
task("js", () => {
  // jsファイルを監視
  return watch(PATH.SRC_ALL_JS, () => {
    // .scssの更新があった場合の処理
    return (
      // .jsファイルを取得
      src(PATH.SRC_ALL_JS)
        // dist/に保存
        .pipe(dest(PATH.BUILD_JS))
    );
  });
});

task("default", parallel("browser-sync", "html", "js", "sass"));
