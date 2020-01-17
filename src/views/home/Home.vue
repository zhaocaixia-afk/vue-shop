<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
import { clearSession } from 'common/utils'
    export default {
        name: 'Home',
        methods: {
            logout(){
                clearSession()
                this.$router.push('/login')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>