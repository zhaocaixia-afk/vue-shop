<template>
    <div>
        <Breadcrumb :textList="breadcrumbsList"/>
        <el-card>
            <!-- 第一步:npm i echarts --save 第二步 -->
            <div id="main" style="width: 600px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import Breadcrumb from 'components/Breadcrumb'
import echarts from 'echarts'
import _ from 'lodash'
    export default {
        name: 'Report',
        data(){
            return{
                breadcrumbsList: ['数据统计','数据报表'],
                options: { 
                    title: { text: '用户来源' }, 
                    tooltip: { 
                        trigger: 'axis', 
                        axisPointer: { 
                            type: 'cross', 
                            label: { backgroundColor: '#E9EEF3' } 
                        } 
                    }, 
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }, 
                    xAxis: [ { boundaryGap: false } ], 
                    yAxis: [ { type: 'value' } ] 
                }
            }
        },
        async mounted(){
            // 第三步:初始化实例
            var myChart = echarts.init(document.getElementById('main'));

            const {data:res} = await this.$http.get('reports/type/1')
            // console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error(res.meta.msg)
            }

            // 第四步:准备数据和配置项
            const result = _.merge(res.data,this.options)
            
            // 第五步:展示数据
            myChart.setOption(result);
        },
        components: {
            Breadcrumb
        }
    }
</script>

<style lang="scss" scoped>

</style>