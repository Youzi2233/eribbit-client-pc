const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less'),
      ],
    },
    // 配置10kb下的图片打包成base64的格式
    chainWebpack: config => {
      // 图片加载
      config.module
        .rule('images')
        .use('url-loader')
        .loader('url-loader')
        // 10000字节 = 10kb
        .tap(options => Object.assign(options, { limit: 10000 }));

      // 开启IP域名访问
      // config.devServer.disableHostCheck(true);
    },
  },
  devServer: {
    allowedHosts: ['www.corho.com'],
  },
  configureWebpack: {
    externals: {
      qc: 'QC',
    },
  },
});
