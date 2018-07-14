let mix = require("laravel-mix");
let build = require("./tasks/build.js");
let tailwindcss = require("tailwindcss");
let PurgecssPlugin = require("purgecss-webpack-plugin");
let glob = require("glob-all");

/**
 * Custom PurgeCSS Extractor
 * https://github.com/FullHuman/purgecss
 * https://github.com/FullHuman/purgecss-webpack-plugin
 */
class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-z0-9-:\/]+/g) || [];
    }
}

mix.disableSuccessNotifications();
mix.setPublicPath("source/assets/");
mix.webpackConfig({
    plugins: [
        build.jigsaw,
        build.browserSync(),
        build.watch(["source/**/*.md", "source/**/*.php", "source/**/*.scss"])
    ]
});

mix.js("source/_assets/js/main.js", "js")
    .sass("source/_assets/sass/main.scss", "css/main.css")
    .version()
    .options({
        processCssUrls: false,
        postCss: [tailwindcss("./tailwind.js")]
    });

mix.webpackConfig({
    plugins: [
        new PurgecssPlugin({
            paths: glob.sync([path.join(__dirname, "source/**/*.php")]),
            extractors: [
                {
                    extractor: TailwindExtractor,
                    extensions: ["html", "js", "php", "vue"]
                }
            ]
        })
    ]
});
