const CompressionPlugin = require('compression-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const { IgnorePlugin } = require('webpack');

const Timestamp = new Date().getTime();

module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en_US',
      fallbackLocale: 'en_US',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
  configureWebpack: {
    output: {
      filename: `[name].${Timestamp}.js`,
      chunkFilename: `[name].${Timestamp}.js`,
    },
    plugins: [
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css)$/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false, // 不删除源文件
        minRatio: 0.8,
      }),
      new IgnorePlugin(/^\.\/icon$/, /bootstrap-vue$/),
      new IgnorePlugin(/^\.\/icons$/, /bootstrap-vue$/),
      new IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    externals: {
    },
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/assets/css/macro.scss";
          @import "~@/assets/css/sizes.scss";
          @import "node_modules/bootstrap/scss/mixins";
          @import "node_modules/bootstrap/scss/functions";
          @import "node_modules/bootstrap/scss/variables";`,
      },
    },
  },
  publicPath: '/',
  assetsDir: 'static',
  devServer: {
    liveReload: true,
    port: 8080,
  },
};
