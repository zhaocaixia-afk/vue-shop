const path = require('path')
function resolve(dir){
    return path.join(__dirname,dir)
}

module.exports = {
    // 浏览器配置
    devServer:{
        open:true
    },
    // 文件别名vue-cli3.x
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production',config => {
            config.entry('app').clear().add('./src/main-prod.js')
            // 通过externals加载外部CDN资源
            config.set('externals', {
                vue: 'Vue',
                // 'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })
            // 判断首页内容
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        // 开发模式
        config.when(process.env.NODE_ENV === 'development',config => {
            config.entry('app').clear().add('./src/main-dev.js')

            // 判断首页内容
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })

        config.resolve.alias
        .set('assets',resolve('./src/assets'))
        .set('components',resolve('./src/components'))
        .set('common',resolve('./src/common'))
        .set('network',resolve('./src/network'))
        .set('views',resolve('./src/views'))
    }
}
