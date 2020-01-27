<template>
    <div class="params">
        <Breadcrumb :textList="breadcrumbsList"/>
        <el-card>
            <el-alert show-icon type="warning" title="注意:只允许为第三级分类设置相关参数" :closable="false"></el-alert>
            <!-- 选择商品分类区域 -->
            <el-row>
                <el-col>
                    <span>选择商品分类 : </span>
                    <el-cascader :options="cateList" :props="cateProps" v-model="selectedCateKeys" @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <!-- tab 页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" class="addParamsBtn" @click="dialogVisible = true">添加参数</el-button>
                    <!-- 动态参数 -->
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParam(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" class="addParamsBtn" @click="dialogVisible = true">添加参数</el-button>
                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParam(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <!-- 添加参数 -->
            <el-dialog :title="`添加${titleText}`" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                    <el-form-item :label="titleText" prop="attr_name">
                        <el-input v-model="addForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addParams">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 编辑 -->
            <el-dialog :title="`修改${titleText}`" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                    <el-form-item :label="titleText" prop="attr_name">
                        <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editParams">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import Breadcrumb from 'components/Breadcrumb'
    export default {
        name: 'Params',
        data(){
            return{
                breadcrumbsList: ['商品管理','参数列表'],
                cateList: [],
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                selectedCateKeys: [],
                activeName: 'many',
                manyTableData: [], //动态参数表格数据
                onlyTableData: [],  //静态属性表格数据
                dialogVisible: false,  //添加属性dialog
                addForm: {
                    attr_name: ''
                },
                addFormRules: {
                    attr_name: [
                        { required:true,message: '请输入参数名称',trigger: 'blur'}
                    ]
                },
                editDialogVisible: false,
                editForm: {
                    attr_name: ''
                },
                editFormRules: {
                    attr_name: [
                        { required:true,message: '请输入参数名称',trigger: 'blur'}
                    ]
                },
                attr_vals: [], //展开数据
            }
        },
        created(){
            this.getCateList()
        },
        computed: {
            // 1.添加参数按钮,是否可以点击
            isBtnDisabled(){
                if(this.selectedCateKeys.length !== 3){
                    return true
                }
                return false
            },
            // 2.当前选中的三级分类的Id
            cateId(){
                if(this.selectedCateKeys.length === 3){
                    return this.selectedCateKeys[2]
                }
                return null
            },
            // 3.弹出对话框title
            titleText(){
                if(this.activeName === 'many'){
                    return '动态参数'
                }
                return '静态属性'
            }
        },
        methods: {
            // 1.获取商品分类列表
            async getCateList(){
                const {data:res} = await this.$http.get('categories')
                // console.log(res)
                if(res.meta.status != 200){
                    return this.$message.error(res.meta.msg)
                }
                this.cateList = res.data
                // console.log(this.cateList)
            },
            // 2.1.级联改变
            handleChange(){
                this.getParamsData()
            },
            // 2.2.tabs组件点击切换
            handleTabClick(){
                this.getParamsData()
            },
            // 2.3.请求参数
            async getParamsData(){
                // 证明选中的不是三级分类
                if(this.selectedCateKeys.length !== 3){
                    this.selectedCateKeys = []
                    this.manyTableData = []
                    this.onlyTableData = []
                    return
                }
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{ params: {sel: this.activeName}})
                // console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                // 展开的tag数据
                res.data.forEach( item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                    // 添加属性
                    item.inputVisible = false
                    item.inputValue = ''
                })
                // console.log(res.data[0].attr_vals)
                if(this.activeName === 'many'){
                    this.manyTableData = res.data
                }else{
                    this.onlyTableData = res.data
                }
            },
            // 3.1.添加参数对话框,确定按钮
            addParams(){
                this.$refs.addFormRef.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })
                    // console.log(res)
                    if(res.meta.status !== 201){
                        return this.$message.error(res.meta.msg)
                    }
                    this.$message.success(res.meta.msg)
                    this.dialogVisible = false
                    this.getParamsData()
                })
            },
            // 3.2.添加参数对话框关闭,重置表单
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },
            // 4.1编辑对话框展示
            async showEditDialog(attr_id){
                // 查询当前参数的信息
                // console.log(id)
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{ params: { attr_sel: this.activeName}})
                // console.log(res)
                if(res.meta.status != 200){
                    return this.$message.error(res.meta.msg)
                }
                this.editForm = res.data

                this.editDialogVisible = true
            },
            // 4.2编辑对话框关闭
            editDialogClosed(){
                this.$refs.editFormRef.resetFields()
            },
            // 4.3编辑对话框确定
            editParams(){
                this.$refs.editFormRef.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.editForm.attr_sel
                    })
                    // console.log(res)
                    if(res.meta.status !== 200){
                        return this.$message.error(res.meta.msg)
                    }
                    this.$message.success(res.meta.msg)
                    this.getParamsData()
                })
                this.editDialogVisible = false
            },
            // 5.1删除
            async deleteParam(attr_id){
                const confirmResult = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if(confirmResult !== 'confirm'){
                    return this.$message.info('已取消删除')
                }
                const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.getParamsData()
            },
            // 6.1添加tag标签
            async handleInputConfirm(row){
                // console.log('ok')
                if(row.inputValue.trim().length === 0){
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }
                // 提交到数据库
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                this.saveAttrVals(row)
            },
            // 6.2抽离请求函数
            async saveAttrVals(row){
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(" ")
                })
                // 
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
            },
            // 6.3New Tag失去焦点
            showInput(row){
                row.inputVisible = true
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            // 6.4tab标签删除
            handleClose(i,row){
                row.attr_vals.splice(i,1)
                this.saveAttrVals(row)
            }
        },
        components: {
            Breadcrumb
        }
    }
</script>

<style lang="scss" scoped>
.params{
    .el-card{
        margin-top: 15px;
        .el-alert{
            margin-bottom: 15px;
        }
        // 添加参数按钮
        .addParamsBtn{
            margin-bottom: 15px;
        }
        .el-tag{
            margin: 0 10px;
        }
        .el-input{
            width: 120px;
        }
    }
}
</style>