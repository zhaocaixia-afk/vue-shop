<template>
    <div class="roles">
        <Breadcrumb :textList="breadcrumbsList"/>
        <el-card>
            <el-button type="primary">添加角色</el-button>
            <el-table :data="roleList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item1,index1) in scope.row.children" :key="index1" :class="['bdbottom',index1 === 0 ? 'bdtop':'','vcenter']">
                            <el-col :span="5">
                                <el-tag closable @close="deleteRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row v-for="(item2,index2) in item1.children" :key="index2" :class="[index2 === 0 ? '':'bdtop','vcenter']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="deleteRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="index3" closable @close="deleteRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import Breadcrumb from 'components/Breadcrumb'
    export default {
        name: 'Roles',
        data(){
            return{
                breadcrumbsList:['权限管理','角色列表'],
                roleList: []
            }
        },
        created(){
            this.getRolesList()
        },
        methods: {
            async getRolesList(){
                const {data:res} = await this.$http.get('roles')
                // console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.roleList = res.data
                // console.log(this.roleList)
            },
            // 2.删除权限
            async deleteRightById(role,rightId){
                const confirResult =await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(res => res)
                // console.log(confirResult)
                if(confirResult !== 'confirm'){
                    return this.$message.info('取消了删除')
                }
                // console.log('确认了删除')
                const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                // console.log(res)
                // this.getRolesList()
                role.children = res.data
            }
        },
        components: {
            Breadcrumb
        }
    }
</script>

<style lang="scss" scoped>
.roles{
    .el-card{
        margin-top: 15px;
        .el-table{
            margin-top: 15px;
        }
    }
    .el-tag{
        margin: 5px;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
}
</style>