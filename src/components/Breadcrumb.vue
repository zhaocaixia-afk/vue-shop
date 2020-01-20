<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{textList[0]}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{textList[1]}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
    export default {
        name: 'Breadcrumb',
        props: {
            textList:{
                type: Array,
                default(){
                    return []
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>