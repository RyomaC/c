<template>
  <el-form>
    <el-form-item label="旧密码"><el-input v-model="oldpassword"/></el-form-item>
    <el-form-item label="新密码"><el-input v-model="newpassword" show-password/></el-form-item>
    <el-form-item label="确认新密码"><el-input v-model="newpassword2" show-password/></el-form-item>
    <el-form-item><el-button type="primary" @click="onSubmit">确定</el-button></el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      oldpassword: '',
      newpassword: '',
      newpassword2: '',
      result: ''
    }
  },
  methods: {
    onSubmit () {
      if (this.newpassword !== this.newpassword2) {
        this.$message({
          message: '密码不匹配',
          type: 'error'
        })
        return
      }
      this.$axios.post('/user/changepassword',
        {oldpassword: this.oldpassword, newpassword: this.newpassword})
        .then(response => {
          if (response.data.errno > 0) {
            this.$message({
              message: '修改失败',
              type: 'error'
            })
          } else {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }
        })
    }
  }
}
</script>

<style>

</style>
