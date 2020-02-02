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
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Breadcrumb from 'components/Breadcrumb'
import {
    getRolesList,
    showSetRightDialog,
    allotRights,
    deleteRightById
} from 'network/power/roles'

    export default {
        name: 'Roles',
        data(){
            return{
                breadcrumbsList:['权限管理','角色列表'],
                roleList: [],
                setRightDialogVisible: false,
                rightsList: [],
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                defKeys: [], //默认选中的节点Id值数组
                roleId: '',  //当前即将分配权限的角色id
            }
        },
        created(){
            this.getRolesList()
        },
        methods: {
            // 1.1.获取角色列表
            async getRolesList(){
                const {data:res} = await getRolesList()
                // const {data:res} = await this.$http.get('roles')
                // console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.roleList = res.data
                // console.log(this.roleList)
            },
            // 2.1.删除权限
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
                // const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                const {data:res} = await deleteRightById(role.id,rightId)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                console.log(res)
                // this.getRolesList()
                role.children = res.data
            },
            // 2.2.分配权限
            async showSetRightDialog(role){
                // const {data:res} = await this.$http.get('rights/tree')
                const {data:res} = await showSetRightDialog()
                // console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.roleId = role.id  //当前点击
                this.rightsList = res.data
                
                this.getLeafKeys(role,this.defKeys)
                this.setRightDialogVisible = true
            },
            // 2.3.通过递归的形式,获取角色下所有的三级权限的id,并保存到defKeys数组中
            getLeafKeys(node,arr){
                if(!node.children){
                    return arr.push(node.id)
                }
                node.children.forEach( item => this.getLeafKeys(item,arr))
            },
            // 2.4.监听权限对话框关闭事件
            setRightDialogClosed(){
                this.defKeys = []
            },
            // 2.5.权限对话框确定
            async allotRights(){
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                // console.log(keys)
                const idStr = keys.join(',')
                // console.log(idStr)
                const {data:res} = await allotRights(this.roleId,{ rids: idStr })
                // const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{ rids: idStr})
                // console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.getRolesList()
                this.setRightDialogVisible = false
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