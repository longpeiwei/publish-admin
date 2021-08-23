module.exports = {
  devServer: {
    proxy: {
      '/res': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '^/res': ''
        }
      },
      '/load': {
        target: 'http://localhost:8888',
        pathRewrite: {
          '^/load': ''
        }
      }
    }
  }
}
