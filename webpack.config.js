const path = require('path');
const webpack = require('webpack');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

module.exports = {
    mode: 'development',
    entry: {
        bundle: './static/js/src/project/pages/homepage.js',
        charts: './static/js/src/project/charts.js',
        vectorView: './static/js/src/project/pages/vector-view-page.js',
        view3D:'./static/js/src/project/pages/3d-view-page.js'

    },

    output: {
        filename: '[name].js',//в качестве переменной [name] будет взято название app
        path: path.resolve(__dirname, 'static/js/dist'),
        publicPath: "./static/js/dist"
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/',
            options: {
                // plugins: [new webpack.ProvidePlugin({
                //     $: "/static/components/jquery/jquery-min-js.js"
                //
                // })]
            }

        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.ProvidePlugin({
            ApexCharts: path.resolve(__dirname, './node_modules/apexcharts/dist/apexcharts.js')
        }),
        new webpack.ProvidePlugin({
            bootstrap: path.resolve(__dirname, './node_modules/bootstrap/')
        }),
        new webpack.ProvidePlugin({
            admin_lte: path.resolve(__dirname, './node_modules/admin-lte/dist/css/adminlte.min.css')
        })

    ],

// plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin()],
//
// module: {
//     rules: [
//         {
//             test: /.(js|jsx)$/,
//             include: [path.resolve(__dirname, 'static/js/src')],
//             loader: 'babel-loader',
//
//             options: {
//                 plugins: ['syntax-dynamic-import'],
//
//                 presets: [
//                     [
//                         '@babel/preset-env',
//                         {
//                             modules: false
//                         }
//                     ]
//                 ]
//             }
//         }
//     ]
// },
//
// optimization: {
//     splitChunks: {
//         cacheGroups: {
//             vendors: {
//                 priority: -10,
//                 test: /[\\/]node_modules[\\/]/
//             }
//         },
//
//         chunks: 'async',
//         minChunks: 1,
//         minSize: 30000,
//         name: true
//     }
// },

    devServer: {
        overlay: true,//Настройка для того, чтобы ошибки выводились на экране браузера
        open:
            true
    }
    ,
    watch: true//webpack постоянно смотрит изменения в файлах
}
;
