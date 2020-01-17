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
            <el-aside :width="isCollapse ? '64px' : '260px'">
                <div class="toggle-button" @click="collapse">|||</div>
                <!-- 侧边栏菜单 -->
                <!-- unique-opened只保证一个子菜单打开,collapse侧边栏开关,collapse-transition收缩动画 -->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="(item,index) in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconList[index]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="subItem.id + ''" v-show="item.children" v-for="subItem in item.children" :key="subItem.id">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
import { clearSession } from 'common/utils'
    export default {
        name: 'Home',
        data(){
            return{
                menuList: [],
                iconList: ['iconfont icon-users','iconfont icon-tijikongjian','iconfont icon-shangpin','iconfont icon-danju','iconfont icon-baobiao'],
                isCollapse: false
            }
        },
        created(){
            this.getMenuList()
        },
        methods: {
            // 1.退出
            logout(){
                clearSession()
                this.$router.push('/login')
            },
            // 2.获取aside数据
            async getMenuList(){
                const { data:res } =await this.$http.get('menus')
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.menuList = res.data
                console.log(this.menuList)
            },
            // 3.侧边栏收缩
            collapse(){
                this.isCollapse = !this.isCollapse
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
            .toggle-button{
                background-color: #4a5064;
                font-size: 10px;
                line-height: 24px;
                height: 24px;
                color: #fff;
                text-align: center;
                letter-spacing: 0.2em;
                cursor: pointer;
            }
            .el-menu{
                border-right: none;
                // width: 100%;
                .el-submenu__title i{
                    margin-right: 5px;
                    font-size: 18px;
                }
            }
        }
        .el-main{
            background-color: #eaedf1;
        }
    }
}
</style>