<template>
    <div class="add-good">
        <Breadcrumb :textList="breadcrumbsList"/>
        <el-card> 
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab栏区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="">
                            <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath"/>
        </el-dialog>
    </div>
</template>

<script>
import Breadcrumb from 'components/Breadcrumb'
import { getSession } from 'common/utils'
import _ from 'lodash'
    export default {
        name: 'AddGood',
        data(){
            return{
                breadcrumbsList: ['商品管理','添加商品'],
                activeIndex: '0',
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat: [], //商品所属的分类数组
                    pics: [],
                    goods_introduce: '',
                    attrs: []
                },
                addFormRules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur'}
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur'}
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur'}
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur'}
                    ]
                },
                cateList: [],
                cateProps: {
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children',
                    expandTrigger: 'hover'
                },
                manyTableData: [],
                onlyTableData: [],
                // 图片上传路径
                uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                headerObj: {
                    Authorization: getSession('token')
                },
                previewPath: '',
                previewVisible: false //图片放大对话框
            }
        },
        computed: {
            // 1.1监听分类的id
            cateId(){
                if(this.addForm.goods_cat.length === 3){
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        },
        created(){
            this.getCateList()
        },
        methods: {
            // 1.1级联数据
            async getCateList(){
                const {data:res} = await this.$http.get('categories')

                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.cateList = res.data
                // console.log(this.cateList)
            },
            // 1.2级联改变数组
            handleChange(){
                // console.log(this.addForm.goods_cat)
                if(this.addForm.goods_cat.length !== 3){
                    this.addForm.goods_cat = []
                }
            },
            // 2.1tabs阻止切换
            beforeTabLeave(activeName,oldActiveName){
                if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                    this.$message.error('请先选择商品分类! ')
                    return false
                }
            },
            // 2.2tabs切换
            async tabClicked(){
                if(this.activeIndex === '1'){
                    const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{ params: {sel: 'many'}})

                    // console.log(res)
                    if(res.meta.status !== 200){
                        return this.$message.error(res.meta.msg)
                    }
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                    })
                    this.manyTableData = res.data
                    // console.log(this.manyTableData)
                }else if(this.activeIndex === '2'){
                    const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{ params: {sel: 'only'}})
                    if(res.meta.status != 200){
                        return this.$message.error(res.meta.msg)
                    }
                    this.onlyTableData = res.data
                    // console.log(this.onlyTableData)
                }
            },
            // 3.1处理图片预览效果
            handlePreview(file){
                console.log(file)
                this.previewPath = file.response.data.url
                this.previewVisible = true
            },
            // 3.2处理移除图片
            handleRemove(file){
                // console.log(file)
                // 1.获取将要删除图片的临时路径
                const filePath = file.response.data.tmp_path
                // 2.从pics数组中,找到这个图片对应的索引值
                const i = this.addForm.pics.findIndex(x => x.pic === filePath)
                // 3.调用数组的splice方法,把图片信息对象,从pics数组中移除
                this.addForm.pics.splice(i,1)
            },
            // 3.3图片上传成功
            handleSuccess(response){
                // console.log(response)
                // 1.拼接得到一个图片信息对象
                const picInfo = { pic: response.data.tmp_path }
                // 2.将图片信息对象,push到pics数组中
                this.addForm.pics.push(picInfo)
                // console.log(this.addForm)
            },
            // 4.1富文本中添加
            add(){
                this.$refs.addFormRef.validate(async valid => {
                    if(!valid){
                        return this.$message.error('请填写必要的表单项! ')
                    }
                    // 深拷贝(级联所需为数组,提交数据所需为对象)
                    const form = _.cloneDeep(this.addForm)
                    form.goods_cat = form.goods_cat.join(',')
                    // console.log(form)

                    // 处理动态参数
                    this.manyTableData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ')
                        }
                        this.addForm.attrs.push(newInfo)
                    })
                    // 处理静态属性
                    this.onlyTableData.forEach(item => {
                        const newInfo = { 
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        }
                        this.addForm.attrs.push(newInfo)
                    })
                    form.attrs = this.addForm.attrs
                    // console.log(form)
                    // 发送请求添加商品
                    const {data:res} = await this.$http.post('goods',form)
                    if(res.meta.status !== 201){
                        return this.$message.error(res.meta.msg)
                    }
                    this.$message.success(res.meta.msg)
                    this.$router.push('/goods')
                })
            }
        },
        components: {
            Breadcrumb
        }
    }
</script>

<style lang="scss" scoped>
.add-good{
    .el-card{
        .el-steps{
            margin: 15px 0;
        }
        .el-checkbox{
            margin: 0 10px 0 0 !important;
        }
        .addBtn{
            margin-top: 15px;
        }
    }
}
</style>