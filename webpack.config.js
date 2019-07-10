var Encore = require('@symfony/webpack-encore');

Encore
  .disableSingleRuntimeChunk()
  .enableVersioning(false)
  .configureManifestPlugin((options) => {
    options.fileName = 'webpack-manifest.json';
  })

  .setOutputPath('dist/')
  .setPublicPath('/')

  .addStyleEntry('browser_action_css', './src/browser_action/styles/main.scss')
  .addStyleEntry('options_css', './src/options/main.scss')

  .addEntry('browser_action', './src/browser_action/index.ts')
  .addEntry('background', './src/background/index.ts')
  .addEntry('options', './src/options/index.ts')

  .copyFiles([
    {
      from: './src/icons',
      to: 'icons/[path][name].[ext]'
    },
    {
      from: './src/_locales',
      context: 'src/'
    },
    {
      from: './src/',
      pattern: /\.json$/,
      includeSubdirectories: false
    },
    {
      from: './src/background',
      pattern: /\.html$/,
      includeSubdirectories: false
    },
    {
      from: './src/browser_action',
      pattern: /\.html$/,
      includeSubdirectories: false
    },
    {
      from: './src/options',
      pattern: /\.html$/,
      includeSubdirectories: false
    }
  ])

  .enableSassLoader()
  .enableEslintLoader()
  .enableTypeScriptLoader()

  .enableSourceMaps(!Encore.isProduction())
  .cleanupOutputBeforeBuild()
  .configureFilenames({
    js: '[name].js',
    css: '[name].css'
  })
;

module.exports = Encore.getWebpackConfig();
