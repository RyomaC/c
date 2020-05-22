<template>
  <el-aside style="width: 150px">
    <el-menu :default-openeds="['1']" :default-active="$route.path">
        <el-menu-item index="/portalmap" @click="routeTo('/portalmap')">地图</el-menu-item>
        <el-menu-item index="/datalist/v_device_lamp" @click="routeTo('/datalist/v_device_lamp')" v-show="checkGranted('v_device_lamp/view')">路灯</el-menu-item>
        <el-menu-item index="/datalist/v_device_ebox" @click="routeTo('/datalist/v_device_ebox')" v-show="checkGranted('v_device_ebox/view')">电箱</el-menu-item>
        <el-menu-item index="/datalist/v_device_wiresafe" @click="routeTo('/datalist/v_device_wiresafe')" v-show="checkGranted('v_device_wiresafe/view')">断缆报警器</el-menu-item>
        <el-menu-item index="/datalist/project" @click="routeTo('/datalist/project')" v-show="checkGranted('project/view')">项目</el-menu-item>
        <el-menu-item index="/datalist/dimming_plan" @click="routeTo('/datalist/dimming_plan')" v-show="checkGranted('dimming_plan/view')">照度规划</el-menu-item>
        <el-menu-item index="/datalist/v_device_warning" @click="routeTo('/datalist/v_device_warning')" v-show="checkGranted('v_device_warning/view')">报警</el-menu-item>
        <el-menu-item index="/datalist/v_sys_user" @click="routeTo('/datalist/sys_user')" v-show="checkGranted('sys_user/view')">用户</el-menu-item>
        <el-menu-item index="/datalist/sys_role" @click="routeTo('/datalist/sys_role')" v-show="checkGranted('sys_role/view')">角色</el-menu-item>
        <el-menu-item index="/datalist/log_controller" @click="routeTo('/datalist/log_controller')" v-show="checkGranted('log_controller/view')">日志-控制</el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>

import securityUtil from '@/utils/securityUtil.js'
export default {
  methods: {
    checkGranted: function (action) {
      return securityUtil.checkGranted(action)
    },
    routeTo: function (path) {
      this.$router.replace(path)
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 800px) {
  .el-aside {
    display: none;
    background-color: black;
    z-index: 999;
  };
}
</style>
