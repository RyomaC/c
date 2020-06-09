<template>
   <el-container style="height:100%;width:auto;position:absolute;left:0;z-index:999;">
    <el-aside width="140px" style="background: #0d213b;text-align:left;">
        <el-menu :default-active="$route.path" v-for="(item, index) in menuList" :key="index">
          <el-menu-item @click="toggleList(item.flag1,index)" v-if="item.flag1 === 'home'" :class="isBack === index ? 'background' : ''">
            <img :src="item.imgurl">
            <span class="title">{{ item.content }}</span>
          </el-menu-item>
          <el-menu-item @click="toggleList(item.flag1,index)" v-show="checkGranted(item.flag2)" v-else :class="isBack === index ? 'background' : ''">
            <img :src="item.imgurl">
            <span class="title">{{ item.content }}</span>
          </el-menu-item>
        </el-menu>
    </el-aside>
   </el-container>
</template>

<script>
import securityUtil from '@/utils/securityUtil.js'

export default {
  components: {},
  data: function () {
    return {
      menuList: [
        {flag1: 'home', imgurl: '/static/images/zhuye.png', content: '主页'},
        {flag1: 'v_device_lamp', flag2: 'v_device_lamp/view', imgurl: '/static/images/ludeng.png', content: '路灯'},
        {flag1: 'v_device_ebox', flag2: 'v_device_ebox/view', imgurl: '/static/images/dianxiang.png', content: '电箱'},
        {flag1: 'v_device_wiresafe', flag2: 'v_device_wiresafe/view', imgurl: '/static/images/dlbaojing.png', content: '断缆报警器'},
        {flag1: 'project', flag2: 'project/view', imgurl: '/static/images/xiangmu.png', content: '项目'},
        {flag1: 'v_device_warning', flag2: 'v_device_warning/view', imgurl: '/static/images/baojing.png', content: '报警'}
      ],
      isBack: 0,
      single: 0
    }
  },
  mounted: function () {
  },
  destroyed: function () {
  },
  sockets: {
  },
  watch: {
  },
  methods: {
    checkGranted: function (action) {
      return securityUtil.checkGranted(action)
    },
    toggleList (dataListType, index) {
      this.isBack = index
      if (dataListType !== 'home') {
        this.listVisible = true
        this.statsVisible = false
        this.deviceListVisible = false
        this.deviceControlVisible = false
        this.dataListType = dataListType
      } else {
        this.listVisible = false
      }
    }
  },
  computed: {
  }
}
</script>
<style scoped>
.background{
  background-color: #2F2DA1;
}
</style>
