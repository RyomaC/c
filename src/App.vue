<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  metaInfo: {
    title: 'LD light',
    viewport: 'minimal-ui'
  },
  methods: {
    refreshToken: function () {
      console.log('refreshToken')
      this.$axios
        .post('/user/refreshToken')
        .then(response => {
          console.log(response.data)
          if (!response.data.errno) {
            localStorage.tokenInfo = JSON.stringify(response.data.data.token || {})
            localStorage.userFullName = response.data.data.userProfile ? response.data.data.userProfile.fullname : ''
            localStorage.grantedActions = JSON.stringify(response.data.data.grantedActions || [])
          }
        })
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    }
  },
  beforeMount () {
    // if (localStorage.tokenInfo) {
    //   if (JSON.parse(localStorage.tokenInfo).token) {
    //     this.refreshToken()
    //   }
    // }
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
html,body{
  width: 100%;
  height: 100%;
  font-size: 14px;
}
#app {
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: url('/static/images/v-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.el-main {
  padding: 8px !important;
}
.el-header {
  line-height: 60px;
  height: 60px;
  color: white;
  text-align: left;
  vertical-align: center;
  font-size: 18px;
}
.el-form * {
  color: white !important;
}
.el-input__inner, .el-textarea__inner {
  background: #333 !important;
  color: white !important;
}
.el-dropdown-menu__item, .el-select-dropdown__item{
  color: white !important;
}
.el-dropdown-menu__item:hover, .el-select-dropdown__item:hover{
  color: black !important;
}
.el-popper {
  background: #333 !important;
}
.el-form-item__content {
  text-align: left !important;
  color: white !important;
}
.el-menu {
  background-color: transparent !important;
  border-right:0px !important
}
.el-menu :hover{
  background-color:rgb(47, 45, 161) !important;
}
.el-menu-item {
  color: white !important;
}
#currenttime .el-slider__runway{
    width:100%;
    height:6px;
    margin:16px 0;
    background-color:transparent;
    border-radius:3px;
    position:relative;
    cursor:pointer;
    vertical-align:middle
}
#timeline .el-slider__runway{
    width:100%;
    height:60px;
    background-color:transparent;
    border-radius:3px;
    position:relative;
    cursor:pointer;
}
#currenttime  .el-slider__runway.disabled .el-slider__button{
    border-color: transparent;
    height: 5px;
    width: 5px;
    border-radius: 100%;
    background-color: #FF0000;
}
#timeline .el-slider__bar{
    height:60px;
    background-color:transparent;
    border-top-left-radius:3px;
    border-bottom-left-radius:3px;
    position:absolute;
}
#timeline .el-slider__button-wrapper{
    height:36px;
    width:36px;
    z-index:1001;
    top:0px;
    transform:translateX(-50%);
    background-color:transparent;
    text-align:center;
    -moz-user-select:none;
    user-select:none;
    line-height:normal
}
#timeline .el-slider__button{
    width:15px;
    height:60px;
    border:none;
    background-color:transparent;
    -webkit-transition:.2s;
    transition:.2s;
    border-radius:0%;
    user-select:none;
    background-image: url(/static/images/bookmark.png);
}
::-webkit-scrollbar {/*滚动条整体样式*/
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #DBDBDB;
}
::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 10px;
}
</style>
