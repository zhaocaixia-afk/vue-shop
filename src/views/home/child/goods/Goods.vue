<template>
    <div class="goods">
        <Breadcrumb :textList="breadcrumbsList"/>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格" prop="goods_price" width="80px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="50px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="160px">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>
    </div>
</template>

<script>
import Breadcrumb from 'components/Breadcrumb'
    export default {
        name: 'Goods',
        data(){
            return{
                breadcrumbsList: ['商品管理','商品列表'],
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                goodsList: [],
                total: 0
            }
        },
        created(){
            this.getGoodsList()
        },
        methods: {
            // 1.1获取表格数据
            async getGoodsList(){
                const {data:res} = await this.$http.get('goods',{ params: this.queryInfo })
                // console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.goodsList = res.data.goods
                this.total = res.data.total
            },
            // 2.1分页条数改变
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },
            // 2.2分页页数改变
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },
            // 3.1删除
            async removeById(id){
                const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

                if(confirmResult !== 'confirm'){
                    return this.$message.info('已经取消删除')
                }
                const {data:res} = await this.$http.delete(`goods/${id}`)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.getGoodsList()
            },
            // 4.1添加商品,跳转页面
            goAddPage(){
                this.$router.push('/goods/add')
            }
        },
        components: {
            Breadcrumb
        }
    }
</script>

<style lang="scss" scoped>
.goods{
    
}
</style>