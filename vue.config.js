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
      config.module
        .rule('images')
        .use('url-loader')
        .loader('url-loader')
        // 10000字节 = 10kb
        .tap(options => Object.assign(options, { limit: 10000 }));
    },
  },
});
