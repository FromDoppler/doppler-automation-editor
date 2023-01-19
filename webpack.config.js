const path = require("path");
const glob = require('glob');
const globImporter = require('node-sass-glob-importer');
const AngularTemplateCacheWebpackPlugin = require('angular-templatecache-webpack5-plugin');
const WebpackConcatPlugin = require('webpack-concat-files-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const servicesFiles = glob.sync(`./src/services/**/*.js`, {
  ignore: [
    './src/services/**/*.spec.js',
    './src/services/controlPanel/**/*.js'
  ],
});

const directivesFiles = glob.sync(`./src/directives/**/*.js`, {
  ignore: [
    './src/directives/**/*.spec.js',
    './src/directives/controlPanel/**/*.js'
  ],
});

module.exports = {
    entry: {
      lib: [
        path.resolve(__dirname, './src/lib/angular/angular.js'),
        path.resolve(__dirname, './src/lib/angular-animate.js'),
        path.resolve(__dirname, './src/lib/ui-bootstrap-tpls-2.5.0.js'),
        path.resolve(__dirname, './src/lib/angular-sanitize.js'),
        path.resolve(__dirname, './src/lib/angular-messages.js'),
        path.resolve(__dirname, './src/lib/angular-translate.js'),
        path.resolve(__dirname, './src/lib/angular-translate-loader-static-files.js'),
        path.resolve(__dirname, './src/lib/angular-route/angular-route.js'),
        path.resolve(__dirname, './src/lib/dropzone/downloads/dropzone.min.js'), //~5.4.0
        path.resolve(__dirname, './src/lib/angular-underscore.js'),
        path.resolve(__dirname, './src/lib/underscore-min.js'),
        path.resolve(__dirname, './src/lib/angular-momentjs/angular-momentjs.js'),
        path.resolve(__dirname, './src/lib/moment.min.js'),
        path.resolve(__dirname, './src/lib/intlTelInput/intlTelInput.js'),
        path.resolve(__dirname, './src/lib/intlTelInput/utils.js'),
      ],
      directives: directivesFiles,
      app: [
        path.resolve(__dirname, './src/dopplerApp.js'),
        path.resolve(__dirname, './src/automationEditorModule.js'),
        path.resolve(__dirname, './src/constants.js'),
        path.resolve(__dirname, './src/templatesModule.js'),
        path.resolve(__dirname, './src/automationModule.js'),
        path.resolve(__dirname, './src/listsModule.js'),
        path.resolve(__dirname, './src/formsModule.js'),
        path.resolve(__dirname, './src/controlPanelModule.js'),
        path.resolve(__dirname, './src/dopplerScriptsAdaptersRegistration.js'),
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
    mode: "development",//development production
    output: {
      path: path.resolve(__dirname, "./dist"),
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
                additionalData: "$flagsImagePath:'../app/icons/';$iconsPath:'../app/icons';$fontPath:'../../fonts/';$gulp:'false';",
                sassOptions: {
                  importer: globImporter(),
                  includePaths: [ path.resolve(__dirname, './node_modules')]
                },
              },
            },
          ],
        },
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
      new ReplaceInFileWebpackPlugin([{
        dir: './dist',
        files: ['app.min.js'],
        rules: [{
            search: /Automation\/EditorConfig/g,
            replace: 'AutomationMFE/EditorConfig'
          },
          {
            search: /Automation\/Automation\/AutomationApp/g,
            replace: 'AutomationMFE/Automation/AutomationApp'
          }
      ]
    }]),
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