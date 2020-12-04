const baseUrl = process.env.NODE_ENV === 'production' ? './' : '/' // font scss资源路径 不同环境切换控制
module.exports = {
    publicPath: baseUrl,
    // outputDir: 'F:\\apache-tomcat-10\\webapps\\ROOT/',
    outputDir: 'dist',
    devServer: {
        disableHostCheck: true, // 启用热更新，不用手动刷新浏览器
        open: true, // 本地开发环境启动后自动打开页面
        port: 8080,
        proxy: {
            '/api': {
                // target: 'http://49.4.89.232:10061', // target host
                target: 'http://192.168.65.26:3000', // target host
                ws: false, // proxy websockets
                // secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, // needed for virtual hosted sites
                pathRewrite: {
                    // '^/': '' // rewrite path
                    '^/api': '/api'
                    // '^/api': '/'
                    // 写'/api'就等于写'http://192.168.65.98:8888'
                }
            }
        }
    }
}
