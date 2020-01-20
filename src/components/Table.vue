<template>
    <el-table :data="tableData" :border="rightsTableConfig.isBorder" :stripe="rightsTableConfig.isStripe">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column v-for="item in rightsTableLable" :key="item.prop" :label="item.label" >
            <template slot-scope="scope">
                <span>{{ scope.row[item.prop] }}</span>
            </template>
        </el-table-column>
        <el-table-column v-if="rightsTableLable" label="权限等级" prop="level">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: 'Table',
        props: {
            tableData: {
                type: Array,
                default(){
                    return []
                }
            },
            rightsTableLable: {
                type: Array,
                default(){
                    return []
                }
            },
            rightsTableConfig: {
                type: Object,
                default(){
                    return {}
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>