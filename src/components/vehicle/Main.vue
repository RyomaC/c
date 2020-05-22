<template>
  <div style="height:100%">
    <el-container style="height:100%" direction="vertical" v-if="viewMode == 1">
      <el-header class="el-header">
        <el-row style="vertical-align:center; height:60px; border-bottom:1px solid blue" :gutter="20">
          <el-col :span="12"><img src="/static/images/v-logo.png" @click="toggleSideMenu" style="width:40px; height:40px; vertical-align:middle;"/> 洛丁智慧照明</el-col>
          <el-col :span="12">
            <div style="text-align:right">
              <el-button type="text" icon="el-icon-message-solid" @click="toggleDeviceList">
                <el-badge :value="warningCount" class="badget" v-show="warningCount>0"></el-badge>
              </el-button>
              <el-dropdown v-if="fullname" @command="handlerUserCommand">
                <span style="color:white;">
                  <i class="el-icon-user"></i>{{fullname}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="changePassword">更改密码</el-dropdown-item>
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="text" @click="logout()" v-else>登录</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container style="overflow:auto">
        <LeftSideMenu ref="leftSideMenu"/>
        <el-main style="overflow:auto;">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <router-view v-if="viewMode == 0"></router-view>
  </div>
</template>

<script>
import LeftSideMenu from '@/components/LeftSideMenu'

export default {
  components: {LeftSideMenu},
  methods: {
    logout: function () {
      localStorage.clear()
      this.$router.replace('/login')
    },
    changePassword: function () {
      this.$router.replace('/userchangepassword')
    },
    toggleSideMenu: function () {
      let visible = this.$refs.leftSideMenu.$el.style.display === 'block'
      this.$refs.leftSideMenu.$el.style.display = visible ? 'none' : 'block'
    },
    handlerUserCommand: function (command) {
      switch (command) {
        case 'changePassword':
          this.changePassword()
          return
        case 'logout':
          this.logout()
      }
    },
    toggleDeviceList: function () {
      this.$router.replace('/datalist/v_device_warning')
    },
    checkWarning: function () {
      this.$axios
        .post('/v_device_warning/list', {size: 2000})
        .then(response => {
          this.warningCount = response.data.data.data.length
        })
    }
  },
  data: function () {
    return {
      fullname: '',
      leftSideMenuShown: true,
      viewMode: 1,
      warningCount: 0
    }
  },
  mounted: function () {
    this.fullname = localStorage.userFullName
    this.viewMode = this.$route.query.viewMode || 1
    setInterval(() => {
      this.checkWarning()
    }, 15000)
    this.checkWarning()
  },
  watch: {
    '$route': function () {
      let w = document.documentElement.offsetWidth || document.body.offsetWidth
      this.$refs.leftSideMenu.$el.style.display = w > 800 ? 'block' : 'none'
    }
  }
}
</script>

<style>

</style>
