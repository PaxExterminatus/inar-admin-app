let mix = require('laravel-mix');

mix
    .sourceMaps()
    .setPublicPath('./')
    .js('src/app.js', 'public/app/storage')
    .vue();
