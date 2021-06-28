let mix = require('laravel-mix');

mix
    .sourceMaps()
    .setPublicPath('./')
    .js('src/app.js', 'public/app/storage')
    .sass('src/app.sass', 'public/app/storage')
    .vue();
