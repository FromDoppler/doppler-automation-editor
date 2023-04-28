const path = require('path');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
module.exports = {
  entry: {
    lib: [
      path.resolve(__dirname, './src/lib/angular/angular.js'),
      path.resolve(__dirname, './src/lib/angular-animate.js'),
      path.resolve(__dirname, './src/lib/ui-bootstrap-tpls-2.5.0.js'),
      path.resolve(__dirname, './src/lib/angular-sanitize.js'),
      path.resolve(__dirname, './src/lib/angular-messages.js'),
      path.resolve(__dirname, './src/lib/angular-translate.js'),
      path.resolve(
        __dirname,
        './src/lib/angular-translate-loader-static-files.js'
      ),
      path.resolve(__dirname, './src/lib/angular-route/angular-route.js'),
      path.resolve(__dirname, './src/lib/dropzone/downloads/dropzone.min.js'), //~5.4.0
      path.resolve(__dirname, './src/lib/angular-underscore.js'),
      path.resolve(__dirname, './src/lib/underscore-min.js'),
      path.resolve(__dirname, './src/lib/angular-momentjs/angular-momentjs.js'),
      path.resolve(__dirname, './src/lib/moment.min.js'),
      path.resolve(__dirname, './src/lib/intlTelInput/intlTelInput.js'),
      path.resolve(__dirname, './src/lib/intlTelInput/utils.js'),
    ],
    app: [
      path.resolve(__dirname, './dist/static/js/app.js'),
      path.resolve(__dirname, './dist/static/js/template.min.js'),
    ],
    directives: path.resolve(__dirname, './dist/static/js/directives.js'),
    styles: path.resolve(__dirname, './dist/static/css/styles.css'),
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'static/js/[name].[contenthash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { babelrc: true },
          },
        ],
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset', // <-- Assets module - asset
        generator: {
          //If emitting file, the file path is
          filename: 'static/fonts/[hash][ext][query]',
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
        generator: {
          filename: 'static/images/[hash][ext][query]',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new ReplaceInFileWebpackPlugin([
      {
        dir: './dist/static/js',
        test: /app\.[0-9a-f]{8}\.js$/,
        rules: [
          {
            search: /Automation\/EditorConfig/g,
            replace: 'AutomationMFE/EditorConfig',
          },
          {
            search: /Automation\/Automation\/AutomationApp/g,
            replace: 'AutomationMFE/Automation/AutomationApp',
          },
        ],
      },
    ]),
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: 'https://cdn.fromdoppler.com/doppler-automation-editor-mfe/',
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = Object.values(entrypoints).reduce(
          (accumulator, currentValue) => accumulator.concat(currentValue),
          []
        );
        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        };
      },
    }),
  ],
};
