const path = require("path");
const glob = require('glob');
const globImporter = require('node-sass-glob-importer');
const AngularTemplateCacheWebpackPlugin = require('angular-templatecache-webpack5-plugin');
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
      styles: [
        path.resolve(__dirname, './src/css/app/styles.scss'),
        path.resolve(__dirname, './src/css/app/_shame.scss'),// ver
        path.resolve(__dirname, './src/css/doppler-common/common.scss'),
      ]
    },
    mode: "production",
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: 'static/js/[name].js',
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
        filename: 'static/css/[name].css', 
      }),
      new AngularTemplateCacheWebpackPlugin({
        source: './src/partials/**/*.html',
        outputFilename: 'static/js/template.min.js',
        module: 'dopplerApp.templates',
    	  root: 'angularjs/partials/'
      }),
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