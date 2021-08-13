module.exports = {
  devServer: {
    proxy: {
      '/res': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '^/res': ''
        }
      }
    }
  }
}
