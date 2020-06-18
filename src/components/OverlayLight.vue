<template>
   <el-container style="height:100%;width:auto;position:absolute;left:0;z-index:999;">
     <vue-resizable
        :active="['r']"
        :fit-parent="false"
        :min-width="500"
        :min-height="50"
        :width="700"
        :height="800"
        :left="140"
        :top="0"
        @resize:move="eHandler"
        @resize:start="eHandler"
        @resize:end="eHandler"
        id="listContainer"
        v-if="listVisible"
      >
        <div style="text-align:right; margin-right:10px;background:#0E2A43;"><el-button icon="el-icon-close" type="text" @click="hideDetail"/></div>
        <DataList ref="dataList" :datatype="dataListType" :defaultData="getDefaultData(dataListType)" :projectName="projectName"/>
      </vue-resizable>
     <el-aside v-if="leftSideVisible" style="background: #0d213b;text-align:left; width:140px;">
        <el-menu :default-active="$route.path" v-for="(item, index) in menuList" :key="index">
          <el-menu-item @click="toggleList(item.key,index)" v-if="item.key === 'home'" :class="isBack === index ? 'background' : ''">
            <img :src="item.imgurl">
            <span class="title">{{ item.content }}</span>
          </el-menu-item>
          <el-menu-item @click="toggleList(item.key,index)" v-show="checkGranted(item.action)" v-else :class="isBack === index ? 'background' : ''">
            <img :src="item.imgurl">
            <span class="title">{{ item.content }}</span>
          </el-menu-item>
        </el-menu>
    </el-aside>
   </el-container>
</template>

<script>
import DataList from '@/components/DataList'
import securityUtil from '@/utils/securityUtil.js'
import VueResizable from 'vue-resizable'

export default {
  components: {DataList, VueResizable},
  data: function () {
    return {
      menuList: [
        {key: 'home', imgurl: '/static/images/zhuye.png', content: '主页'},
        {key: 'v_device_lamp', action: 'v_device_lamp/view', imgurl: '/static/images/ludeng.png', content: '路灯'},
        {key: 'v_device_ebox', action: 'v_device_ebox/view', imgurl: '/static/images/dianxiang.png', content: '电箱'},
        {key: 'v_device_wiresafe', action: 'v_device_wiresafe/view', imgurl: '/static/images/dlbaojing.png', content: '断缆报警器'},
        {key: 'v_device_warning', action: 'v_device_warning/view', imgurl: '/static/images/baojing.png', content: '报警'},
        {key: 'ticket', action: 'ticket/view', imgurl: '/static/images/ticket.png', content: '工单'},
        {key: 'project', action: 'project/view', imgurl: '/static/images/xiangmu.png', content: '项目'},
        {key: 'dimming_plan', action: 'dimming_plan/view', imgurl: '/static/images/dimmingplan.png', content: '照度规划'},
        {key: 'v_sys_user', action: 'sys_user/view', imgurl: '/static/images/user.png', content: '用户'},
        {key: 'sys_role', action: 'sys_role/view', imgurl: '/static/images/role.png', content: '角色'},
        {key: 'log_controller', action: 'log_controller/view', imgurl: '/static/images/log.png', content: '日志-控制'}
      ],
      isBack: 0,
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      leftSideVisible: true,
      listVisible: false,
      dataListType: '',
      projectName: ''
    }
  },
  mounted: function () {
    this.$EventBus.$on('getmassMarks', index => {
      this.leftSideVisible = true
      this.listVisible = false
      this.isBack = 0
    })
    this.$EventBus.$on('listVisible', index => {
      this.listVisible = false
    })
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
        this.dataListType = dataListType
        this.$EventBus.$emit('hidemodule', 1)
      } else {
        this.listVisible = false
      }
    },
    hideDetail: function () {
      this.leftSideVisible = true
      this.listVisible = false
      this.isBack = 0
      this.$EventBus.$emit('hidedetail', 1)
    },
    getDefaultData (dataType) {
      return ['v_device_lamp', 'v_device_ebox', 'v_device_wiresafe', 'v_device_warning', 'ticket'].includes(dataType) ? {project: this.projectName} : null
    },
    eHandler (width, height, left, top) {
      this.width = width
      this.height = height
      this.left = left
      this.top = top
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
.title{
  color: #909399;
  margin-left: 5px;
}
#listContainer{
  left: 68px;
  width: 100%;
  height: 90%;
  background: transparent;
  position: absolute;
  z-index: 1100;
}
</style>
