<template>
    <el-form class="login" ref="form" :model="formData" label-width="80px">
      <el-form-item>
        <img src="/static/images/v-logo.png" @click="goPortal" style="width:40px; height:40px; vertical-align:middle;"/> 洛丁智慧照明
      </el-form-item>
      <el-form-item label="用户">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password"  show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
      {{loginResult}}
    </el-form>
</template>

<script>
export default {
  data: function () {
    return {
      formData: {
        usernmae: '',
        password: ''
      },
      loginResult: ''
    }
  },
  methods: {
    goPortal: function () {
      this.$router.replace({ path: '/portalMap'})
    },
    onSubmit: function () {
      this.$axios
        .post('/user/login', this.formData)
        .then(response => {
          if (response.data.errno > 0) {
            this.loginResult = response.data.errmsg
          } else {
            localStorage.tokenInfo = JSON.stringify(response.data.data.token || {})
            localStorage.userFullName = response.data.data.userProfile ? response.data.data.userProfile.fullname : ''
            localStorage.grantedActions = JSON.stringify(response.data.data.grantedActions || [])
            this.$router.replace({ path: '/monitor'})
          }
        })
    }
  }
}
</script>

<style scoped>
.login{
  width:300px;
  margin:0 auto;
  padding-top: 200px;
  color:white
}
</style>
