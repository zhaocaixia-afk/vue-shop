<template>
<el-dialog :title="title" :visible.sync="dialogFormVisible">
  <slot slot="form1"></slot>
  <!-- <el-form :model="form">
    <el-form-item label="活动名称" label-width="80px">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
  </el-form> -->
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
    export default {
        name: 'Dialog',
        props: {
            title: {
              type: String,
              default: ''
            },
            dialogFormVisible: {
              type: Boolean,
              default: false
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>