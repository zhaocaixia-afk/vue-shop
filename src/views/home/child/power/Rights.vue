<template>
    <div class="rights">
        <!-- 面包屑 -->
        <Breadcrumb :textList="breadcrumbsList"/>
        <el-card>
            <Table :tableData="rightsList" :rightsTableLable="rightsTableLable" :rightsTableConfig="rightsTableConfig"></Table>
        </el-card>
    </div>
</template>

<script>
import Breadcrumb from 'components/Breadcrumb'
import Table from 'components/Table'
import {
    getRightsList
} from 'network/power/rights'

    export default {
        name: 'Rights',
        data(){
            return{
                // 1.面包屑组件数据
                breadcrumbsList: ['权限管理','权限列表'],
                // 2.权限列表数据
                rightsList: [],
                // 2.表格label和prop
                rightsTableLable: [
                    { label:'权限名称', prop: 'authName' },
                    { label:'路径', prop: 'path' }
                ],
                // 2.表格的其它配置参数
                rightsTableConfig: {
                    isBorder: true,
                    isStripe: true
                }
            }
        },
        created(){
            this.getRightsList()
        },
        methods: {
            // 1.权限列表
            async getRightsList(){
                const {data:res} = await getRightsList()
                // const {data:res} = await this.$http.get('rights/list')
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.rightsList = res.data
                // console.log(this.rightsList)
            }
        },
        components: {
            Breadcrumb,
            Table
        }
    }
</script>

<style lang="scss" scoped>
.rights{
    
}
</style>