const path = require("path");
const globImporter = require('node-sass-glob-importer');
const AngularTemplateCacheWebpackPlugin = require('angular-templatecache-webpack5-plugin');
var glob = require('glob');
const WebpackConcatPlugin = require('webpack-concat-files-plugin');
//const ExtractTextPlugin = require("extract-text-webpack-plugin");
//const HTMLWebpackPlugin = require("html-webpack-plugin");
//const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const RemovePlugin = require('remove-files-webpack-plugin');

const servicesFiles = glob.sync(`./src/services/**/*.js`, {
  ignore: [
    './src/services/**/*.spec.js',
    './src/services/controlPanel/**/*.js'
  ],
});
//console.log(servicesFiles)
module.exports = {

    entry: {
      lib: [
        //path.resolve(__dirname, './src/lib/angular.js'),
        path.resolve(__dirname, './src/lib/angular/angular.js'),
       // path.resolve(__dirname, './src/lib/angular/angular.js'),
        path.resolve(__dirname, './src/lib/angular-animate.js'),
       // path.resolve(__dirname, './src/lib/angular-locale_es-ar.js'),
        path.resolve(__dirname, './src/lib/ui-bootstrap-tpls-2.5.0.js'),
        path.resolve(__dirname, './src/lib/angular-sanitize.js'),
        path.resolve(__dirname, './src/lib/angular-messages.js'),
        path.resolve(__dirname, './src/lib/angular-translate.js'),
        path.resolve(__dirname, './src/lib/angular-translate-loader-static-files.js'),
        path.resolve(__dirname, './src/lib/angular-ui-router.js'),
       // path.resolve(__dirname, './src/lib/dropzone.js'),
        path.resolve(__dirname, './src/lib/dropzone/downloads/dropzone.min.js'), //~5.4.0
  
        path.resolve(__dirname, './src/lib/angular-underscore.js'),
        path.resolve(__dirname, './src/lib/underscore-min.js'),
        //path.resolve(__dirname, './src/lib/moment.min.js'),
       // path.resolve(__dirname, './src/lib/angular-momentjs.js'),
        path.resolve(__dirname, './src/lib/angular-momentjs/angular-momentjs.js'),
       // path.resolve(__dirname, './src/lib/d3.min.js'),
       // path.resolve(__dirname, './src/lib/c3.min.js'),
        path.resolve(__dirname, './src/lib/intlTelInput/intlTelInput.js'),
        path.resolve(__dirname, './src/lib/intlTelInput/utils.js'),
      ],
      directives: [
        path.resolve(__dirname, './src/directives/dp-dropdown.js'),
        path.resolve(__dirname, './src/directives/dp-partial.js'),
        path.resolve(__dirname, './src/directives/dp-dynamic-html.js'),
        path.resolve(__dirname, './src/directives/dp-dropzone.js'),
        path.resolve(__dirname, './src/directives/click-outside.js'),
        path.resolve(__dirname, './src/directives/dp-on-error-src.js'),
        path.resolve(__dirname, './src/directives/infinite-scroll.js'),
        path.resolve(__dirname, './src/directives/iframe-on-load.js'),
        path.resolve(__dirname, './src/directives/parent-hover-class.js'),
        path.resolve(__dirname, './src/directives/dp-cursor-tooltip.js'),
        path.resolve(__dirname, './src/directives/dp-graph.js'),
        path.resolve(__dirname, './src/directives/autofocus.js'),
        path.resolve(__dirname, './src/directives/blocked-list-tag.js'),
        path.resolve(__dirname, './src/directives/ellipsis-with-tooltip.js'),
        path.resolve(__dirname, './src/directives/file-browser.js'),
        path.resolve(__dirname, './src/directives/dp-templates.js'),
        path.resolve(__dirname, './src/directives/dp-checkbox.js'),
        //path.resolve(__dirname, './src/directives/dp-create-list.js'),
        path.resolve(__dirname, './src/directives/scroll-on-top.js'),
        path.resolve(__dirname, './src/directives/dp-score-stars.js'),
        path.resolve(__dirname, './src/directives/dp-integer-input.js'),
        path.resolve(__dirname, './src/directives/dp-on-finish-ng-repeat.js'),
        path.resolve(__dirname, './src/directives/dp-cuit-validator.js'),
        path.resolve(__dirname, './src/directives/dp-nit-validator.js'),
        path.resolve(__dirname, './src/directives/dp-rfc-validator.js'),
        path.resolve(__dirname, './src/directives/dp-private-domain-validator.js'),
        path.resolve(__dirname, './src/directives/automation/editor/'),
      ],
      app: [
        path.resolve(__dirname, './src/dopplerApp.js'),
        path.resolve(__dirname, './src/automationEditorModule.js'),
        path.resolve(__dirname, './src/constants.js'),
        path.resolve(__dirname, './src/templatesModule.js'),
        path.resolve(__dirname, './src/automationModule.js'),
        path.resolve(__dirname, './src/listsModule.js'),
        path.resolve(__dirname, './src/formsModule.js'),
        path.resolve(__dirname, './src/controlPanelModule.js'),
        path.resolve(__dirname, './src/controllers/'),
      ].concat(servicesFiles),

      
      main: [
        path.resolve(__dirname, './src/app.js'),
      ],
      styles: [
        path.resolve(__dirname, './src/css/app/styles.scss'),
        path.resolve(__dirname, './src/css/app/_shame.scss'),// ver
        path.resolve(__dirname, './src/css/doppler-common/common.scss'),
      ]
    },
    mode: "development",
    output: {
      //filename: "bundle.js",
      path: path.resolve(__dirname, "./dist"),
      //publicPath: "/"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: { babelrc: true }
            }
          ]
        },
        {
          test: /\.html$/i,
          loader: "html-loader",   
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader, 
            'css-loader',  
            {
              loader: "sass-loader",
              options: {
                webpackImporter: false,
                implementation: require("sass"),
                additionalData: "$iconsPath:'../app/icons';$fontPath:'../../fonts/';$gulp:'false';",
                sassOptions: {
                  importer: globImporter(),
                  includePaths: [ path.resolve(__dirname, './node_modules')]
                },
              },
            },
          ],
        },
        {
          test: /\.(jepeg|jpg|gif|png)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "images/[name].[ext]"
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new AngularTemplateCacheWebpackPlugin({
        source: './src/partials/**/*.html',
        outputFilename: 'template.min.js',
        module: 'dopplerApp.templates',
    	  root: 'angularjs/partials/'
      }),
      new WebpackConcatPlugin({
        bundles: [
          {
            dest: './dist/app.min.js',
            src: [
              './dist/app.js',
              './dist/template.min.js',
            ],
          },
        ],
      }),

      // new ExtractTextPlugin("[name].css"),
      // new OptimizeCssAssetsPlugin({
      //   assetNameRegExp: /\.css$/g,
      //   cssProcessor: require("cssnano"),
      //   cssProcessorOptions: { discardComments: { removeAll: true } },
      //   canPrint: true
      // }),
      // new webpack.DefinePlugin({
      //   "process.env": {
      //     NODE_ENV: "production"
      //   }
      // }),
      // new HTMLWebpackPlugin({
      //   template: "./src/html/index.html",
      //   inject: true,
      //   title: "Webpack: AngularJS configuration"
      // })
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    }


};