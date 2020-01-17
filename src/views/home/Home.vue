<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="~assets/img/heima.png"/>
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside width="260px">
                <!-- 侧边栏菜单 -->
            </el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
import { clearSession } from 'common/utils'
    export default {
        name: 'Home',
        methods: {
            logout(){
                clearSession()
                this.$router.push('/login')
            }
        },
    }
</script>

<style lang="scss" scoped>
.home-container{
    height: 100%;
    .el-header{
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div{
            display: flex;
            align-items: center;
            img{
                width: 50px;
                height: 50px;
            }
            span{
                color: #fff;
                font-size: 16px;
                margin-left: 10px;
            }
        }
    }
    .el-container{
        .el-aside{
            background-color: #333744;
        }
        .el-main{
            background-color: #eaedf1;
        }
    }
}
</style>