<template>
  <el-container id="monitor" style="height:100%;overflow:auto">
    <el-drawer custom-class="topdrawer" id="topdrawer" style="padding:0; margin:0;"
      :visible.sync= "glanceVisible"
      direction="ttb"
      :show-close= "false"
      >
      <div style="width:100%; height:200px; overflow:hidden;">
        <div style="text-align:center; font-size:35px; height:60px;">中科洛丁智慧城市</div>
        <el-row :gutter="20" style="height:100px; border:0; padding:0; ">
          <el-col :span="1">&nbsp;
            </el-col>
          <el-col :span="3">
            <div @click="toggleComponent('home')">
            <i class="el-icon-s-home" />
            <div class="moduleTitle">首页</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div @click="toggleComponent('vehicle')">
            <i class="el-icon-truck" />
            <div class="moduleTitle">车辆</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div  @click="toggleComponent('person')">
            <i class="el-icon-user" />
            <div class="moduleTitle">行人</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div  @click="toggleComponent('light')">
            <i class="el-icon-s-opportunity" />
            <div class="moduleTitle">照明</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div  @click="toggleComponent('government')">
            <i class="el-icon-office-building" />
            <div class="moduleTitle">市政</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div  @click="toggleComponent('environment')">
            <i class="el-icon-sunrise" />
            <div class="moduleTitle">环境</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div  @click="toggleComponent('alarm')">
            <i class="el-icon-bell" />
            <div class="moduleTitle">报警</div>
            </div>
          </el-col>
          <el-col :span="2">
            <div  @click="toggleComponent('security')">
            <i class="el-icon-video-camera" />
            <div class="moduleTitle">安防</div>
            </div>
          </el-col>
        </el-row>
        </div>
    </el-drawer>
    <div style="height:100px"> </div>
        <div id="bannerTitle" @mouseover="glanceVisible=true" >中科洛丁智慧城市管理平台</div>
            <div id="bannerTime">{{currentTime}}</div>
    <div id="bannerWeather">
        <iframe style="margin-left: 5%;" allowtransparency="true" frameborder="0" width="90%" height="100%" scrolling="no" src="//tianqi.2345.com/plugin/widget/index.htm?s=2&z=1&t=1&v=0&d=1&bd=0&k=000000&f=ffffff&ltf=009944&htf=cc0000&q=1&e=1&a=1&c=59493&w=500&h=176&align=left"></iframe>
    </div>
        <!-- <div id="bannerTitle"></div> -->
    <!-- </div> -->
          <PortalMap ref="map" style="height:75%; width:100%;position:absolute;" />
    <component style="height:calc(100% - 100px); margin-top:100px" v-bind:is="portalComponent" />

  </el-container>
</template>

<script>
import PortalMap from '@/components/PortalMap'
import MonitorHome from '@/components/MonitorHome'
import MonitorVehicle from '@/components/vehicle/MonitorVehicle'
import MonitorPerson from '@/components/vehicle/MonitorPerson'
import MonitorLight from '@/components/MonitorLight'
import MonitorAlarm from '@/components/vehicle/MonitorAlarm'
import MonitorEnvironment from '@/components/Environment'
import MonitorGovernment from '@/components/vehicle/MonitorGovernment'
import MonitorSecurity from '@/components/MonitorSecurity'

import {_} from 'underscore'

export default {
  components: {PortalMap, MonitorHome, MonitorVehicle},
  methods: {
    getCurrentTime () {
      let show_day = new Array('星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日')
      let date_time = new Date()
      let year = date_time.getFullYear()
      if (year < 10) {
        year = '0' + year
      }
      let month = date_time.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      let day = date_time.getDate()
      if (day < 10) {
        day = '0' + day
      }
      let hours = date_time.getHours()
      if (hours < 10) {
        hours = '0' + hours
      }
      let minutes = date_time.getMinutes()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      let seconds = date_time.getSeconds()
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      this.currentTime = year + '年' + month + '月' + day + '日' + ' ' + show_day[date_time.getDay() - 1] + ' ' + hours + ':' + minutes + ':' + seconds
    },
    toggleComponent (title) {
      console.log(`========>  toggle: ${title}`)
      const mapping = {
        'home': MonitorHome,
        'vehicle': MonitorVehicle,
        'person': MonitorPerson,
        'light': MonitorLight,
        'environment': MonitorEnvironment,
        'government': MonitorGovernment,
        'alarm': MonitorAlarm,
        'security': MonitorSecurity
      }
      if (mapping[title]) {
        this.portalComponent = mapping[title]
      }
      this.glanceVisible = false
    }
  },
  data: function () {
    return {
      currentTime: '',
      portalComponent: MonitorHome,
      glanceVisible: false
    }
  },
  mounted: function () {
    setInterval(() => {
      this.getCurrentTime()
    }, 1000)
  }
}
</script>

<style scoped>
.el-main {
  padding: 0
}
#monitor td{
  background:transparent !important;
  padding:5px;
}
.map_footer{
  height:25%;
  background-color: #0E2A43;
}
.swiper-slide {
  width: 500px;
  height: 100%;
}
.el-notification {
  background: #ff0000;
}
.el-notification__title, .el-notification__content {
  color: white;
}
#bannerTitle{
  font-size: 35pt;
  color: rgb(240, 240, 240);
  left: 100px;
  right: 100px;
  top: 20px;
  margin: auto;
  /* height: 250px; */
  position: absolute;
  z-index: 800;
  text-shadow:10px 10px 10px black
}
#bannerTime{
  font-size: 18px;
  color: rgb(240, 240, 240);
  right: 15px;
  top: 17px;
  width: 300px;
  height: 100px;
  position: absolute;
  z-index: 800;
  text-shadow:10px 10px 10px black
}
#bannerWeather{
  right: 15px;
  top: 30px;
  width: 250px;
  height: 120px;
  position: absolute;
  z-index: 800;
}

.moduleTitle{
  color:white;
}
#topdrawer i{
  color:white;
  font-size: 45px;
}
#topdrawer .el-col{
  margin: 0 auto !important;
}
</style>
