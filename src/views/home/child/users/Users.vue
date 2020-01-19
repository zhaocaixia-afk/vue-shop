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
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
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

        <!-- 1.添加用户 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 调用Dialog组件 -->
        <!-- 2.修改用户 -->
        <el-dialog title="修改用户" :visible.sync="editDialogFormVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editFormModel" :rules="editFormRules" ref="editForm" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editFormModel.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editFormModel.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editFormModel.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name:'Users',
        data(){
            // 1.自定义校验规则(邮箱和手机号)
            var checkEmail = (rule,value,cb) => {
                if(value === ''){
                    cb(new Error('邮箱不能为空'))
                }else{
                    const regEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
                    if(regEmail.test(value)){
                        return cb()
                    }
                    cb(new Error('请输入合法的邮箱'))
                }
            }
            var checkMobile = (rule,value,cb) => {
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[1678]|18[0-9]|14[57])[0-9]{8}$/
                if(regMobile.test(value)){
                    return cb()
                }
                cb(new Error('请输入合法的手机号'))
            }
            return{
                // 2.编辑表单
                editFormModel: {
                    id: '',
                    username: '',
                    email: '',
                    mobile: ''
                },
                editFormRules: {
                    email: [
                        { required: true, message: "请输入邮箱", trigger: "blur" },
                        { trigger: "blur",validator: checkEmail }
                    ],
                    mobile: [
                        { required: true, message: "请输入手机号", trigger: "blur" },
                        { validator: checkMobile, trigger: "blur" }
                    ]
                },
                // editUserInfoDate: {},
                // 1.添加用户表单
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                addRules: {
                    username: [
                        { required: true, message: "请输入用户名", trigger: "blur" },
                        { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
                    ],
                    password: [
                        { required: true, message: "请输入密码", trigger: "blur" },
                        { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
                    ],
                    email: [
                        { required: true, message: "请输入邮箱", trigger: "blur" },
                        { validator: checkEmail, trigger: "blur" }
                    ],
                    mobile: [
                        { required: true, message: "请输入手机号", trigger: "blur" },
                        { validator: checkMobile, trigger: "blur" }
                    ]
                },
                paramsInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                usersList: [],
                total: 0,
                addDialogVisible: false, // 1.添加用户
                editDialogFormVisible: false, // 2.修改用户
            }
        },
        created(){
            this.getUsersList()
        },
        methods: {
            // 1.清空
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },
            // 2.添加用户
            addUser(){
                this.$refs.addFormRef.validate(async valid => {
                    if(!valid) return
                    // 发起网络请求
                    const {data:res} = await this.$http.post('users',this.addForm)
                    if(res.meta.status != 201){
                        this.$message.error(res.meta.msg)
                    }
                    this.$message.success('添加用户成功! ')
                    this.getUsersList()
                    this.addDialogVisible = false
                })
            },
            // 3.修改用户,显示编辑
            async showEditDialog(id){
                // console.log(id)
                const {data:res} = await this.$http.get('users/'+id)
                // console.log(res)
                if(res.meta.status !== 200) return this.$message.error('查询用户信息失败! ')
                this.editFormModel = res.data
                this.editDialogFormVisible = true
            },
            // 3.修改用户,关闭重置
            editDialogClosed(){
                this.$refs.editForm.resetFields()
            },
            // 3.修改用户,提交更新数据
            editUserInfo(){
                this.$refs.editForm.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.put('users/'+this.editFormModel.id,{
                        email: this.editFormModel.email,
                        mobile: this.editFormModel.mobile
                    })
                    // console.log(res)
                    if(res.meta.status !== 200){
                        return this.$message.error('更新用户失败! ')
                    }
                    this.editDialogFormVisible = false
                    this.getUsersList()
                    this.$message.success(res.meta.msg)
                })
            },
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
        }
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