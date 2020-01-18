<template>
    <div class="users">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="paramsInfo.query" clearable @clear="getUsersList">
                        <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="usersList" border style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="updateStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="paramsInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="paramsInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name:'Users',
        data(){
            return{
                paramsInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                usersList: [],
                total: 0
            }
        },
        created(){
            this.getUsersList()
        },
        methods: {
            async getUsersList(){
                const {data:res} = await this.$http.get('/users',{ params: this.paramsInfo})
                // console.log(res)
                if(res.meta.status !== 200) return this.$message.error("获取数据失败!")
                this.usersList = res.data.users
                this.total = res.data.total
            },
            // ?条/页
            handleSizeChange(val){
                this.paramsInfo.pagesize = val
                this.getUsersList()
            },
            // 点击页数
            handleCurrentChange(val){
                // console.log(`当前页:${val}`)
                this.paramsInfo.pagenum = val
                this.getUsersList()
            },
            // 监听switch开关的变化
            async updateStateChanged(userinfo){
                // console.log(userinfo.mg_state)
                const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
                // console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error("更新用户状态失败! ")
                }
                this.$message.success(res.meta.msg)
            }
        },
    }
</script>

<style lang="scss" scoped>
.users{
    .box-card{
        margin-top: 15px;
        .el-table{
            margin-top: 15px;
        }
        .el-pagination{
            margin-top: 15px;
        }
    }
}
</style>