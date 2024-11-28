module.exports = {
  lintOnSave: false, // 关闭语法检测
  // 开启代理服务器
  devServer: {
    // 代理服务器可以将路由
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/AI': {
        target: 'http://localhost:5000/1',
        changeOrigin: true,
        pathRewrite: { '^/AI': '' }
      }
    }
  }
}
