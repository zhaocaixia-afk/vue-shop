<template>
    <div>
        <Breadcrumb :textList="breadcrumbsList"/>
        <el-card>
            <el-row>
                <el-col :span="10">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="orderList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
                        <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15,20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>

        <!-- 编辑对话框 -->
        <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="addressFormClose">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1" :props="{ expandTrigger: 'hover' }"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 展示物流进度的对话框 -->
        <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
            <el-timeline>
                <el-timeline-item v-for="(activity,index) in progressInfo" :key="index" :timestamp="activity.time">{{activity.context}}</el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import Breadcrumb from 'components/Breadcrumb'
import cityData from './citydata'
    export default {
        name: 'Order',
        data(){
            return{
                breadcrumbsList: ['订单管理','订单列表'],
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                orderList: [],
                total: 0,
                editDialogVisible: false,
                addressForm: {
                    address1: [],
                    address2: ''
                },
                addressFormRules: {
                    address1: [
                        { required: true, message: '请选择省市区/县', trigger: 'blur'}
                    ],
                    address2: [
                        { required: true, message: '请填写详细地址', trigger: 'blur'}
                    ]
                },
                cityData,
                progressVisible: false,
                progressInfo: []
            }
        },
        created(){
            this.getOrderList()
        },
        methods: {
            async getOrderList(){
                const {data:res} = await this.$http.get('orders',{
                    params: this.queryInfo
                })
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                // console.log(res)
                this.orderList = res.data.goods
                this.total = res.data.total
                // console.log(this.orderList)
            },
            // 2.1分页
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },
            // 2.1分页
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getOrderList()
            },
            // 3.1编辑对话框展示
            showBox(){
                this.editDialogVisible = true
            },
            // 3.2编辑对话框关闭
            addressFormClose(){
                this.$refs.addressFormRef.resetFields()
            },
            // 4.1展示物流对话框
            async showProgressBox(){
                const {data:res} = await this.$http.get('/kuaidi/1106975712662')
                // console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error(res.data.msg)
                }
                this.progressInfo = res.data
                // console.log(this.progressInfo)
                this.progressVisible = true
            }
        },
        components: {
            Breadcrumb
        }
    }
</script>

<style lang="scss" scoped>
@import '../../../../plugins/timeline/timeline.css';
@import '../../../../plugins/timeline-item/timeline-item.css';
.el-cascader{
    width: 100%;
}
</style>