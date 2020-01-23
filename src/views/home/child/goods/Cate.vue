<template>
    <div class="cate">
        <Breadcrumb :textList="breadcrumbsList"/>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false" class="tree-table">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mine" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mine" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mine" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>

        <!-- 添加分类 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <el-cascader :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Breadcrumb from 'components/Breadcrumb'
    export default {
        name: 'Cate',
        data(){
            return{
                breadcrumbsList: ['商品管理','商品分类'],
                // 1.1商品分类,查询参数
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                // 1.2商品分类,数组
                cateList: [],
                // 1.3商品分类,总条数
                total: 0,
                // 2.1tree-table的列
                columns:[
                    {
                        label:'分类名称',
                        prop: 'cat_name'
                    },
                    {
                        label: '是否有效',
                        type: 'template',
                        template: 'isok'
                    },
                    {
                        label: '排序',
                        type: 'template',
                        template: 'order'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        template: 'opt'
                    }
                ],
                // 2.2添加分类
                addCateDialogVisible: false,
                // 2.3添加分类里面的表单
                addCateForm: {
                    cat_name: '',
                    cat_pid: 0,
                    cat_level: 0
                },
                addCateFormRules: {
                    cat_name: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' }
                    ]
                },
                // 2.4添加分类里面的父级分类列表
                parentCateList: [],
                // 2.5级联对象的配置选项
                cascaderProps: {
                    value:'cat_id',
                    label:'cat_name',
                    children: 'children',
                    expandTrigger: 'hover'
                },
                selectedKeys: []
            }
        },
        created(){
            this.getCateList()
        },
        methods: {
            // 1.获取商品分类列表
            async getCateList(){
                const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
                // console.log(res)
                if(res.meta.status != 200){
                    return this.$message.error(res.meta.msg)
                }
                this.cateList = res.data.result
                this.total = res.data.total
            },
            // 2.1.分页pageSize改变
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            // 2.2.分页pagenum改变
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },
            // 3.1.点击添加分类按钮
            showAddCateDialog(){
                this.getParentCateList()
                this.addCateDialogVisible = true
            },
            // 3.2.获取父级分类的数据列表
            async getParentCateList(){
                const {data:res} = await this.$http.get('categories',{params:{type:2}})
                
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.parentCateList = res.data
                // console.log(this.parentCateList)
            },
            // 3.3.级联选择器发生变化
            parentCateChanged(){
                console.log(this.selectedKeys)
                if(this.selectedKeys.length > 0){
                    // 父级分类的id
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    // 当前分类的等级赋值
                    this.addCateForm.cat_level = this.selectedKeys.length
                    return
                }else{
                    this.addCateForm.cat_level = 0
                    this.addCateForm.cat_pid = 0
                }
            },
            // 3.4.添加分类对话框关闭
            addCateDialogClosed(){
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0
            },
            // 3.4.点击确定按钮
            addCate(){
                this.$refs.addCateFormRef.validate(async valid => {
                    // console.log(valid)
                    if(!valid) return
                    const {data:res} = await this.$http.post('categories',this.addCateForm)
                    // console.log(res)
                    if(res.meta.status !== 201){
                        return this.$message.error(res.meta.msg)
                    }
                    this.$message.success(res.meta.msg)
                    this.getCateList()
                })
                this.addCateDialogVisible = false
            }
        },
        components: {
            Breadcrumb
        }
    }
</script>

<style lang="scss" scoped>
.cate{
    .el-card{
        margin-top: 15px;
        .tree-table{
            margin-top: 15px;
        }
    }
}
.el-cascader{
    width: 100%;
}
// .el-popper .el-cascader__dropdown{
//     height: 300px!important;
//     overflow: scroll!important;
// }
</style>