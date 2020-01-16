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
    chainWebpack:(config) => {
        config.resolve.alias
        .set('assets',resolve('./src/assets'))
        .set('components',resolve('./src/components'))
        .set('common',resolve('./src/common'))
        .set('network',resolve('./src/network'))
        .set('views',resolve('./src/views'))
    }
}
