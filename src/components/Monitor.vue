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
    <el-header style="height:110px; width:100%;">
        <div id="bannerTitle" @mouseover="glanceVisible=true" >中科洛丁智慧城市管理平台</div>
        <div id="bannerTime">{{currentTime}}</div>
        <div id="bannerWeather">
            <iframe style="margin-left: 5%;" allowtransparency="true" frameborder="0" width="90%" height="100%" scrolling="no" src="//tianqi.2345.com/plugin/widget/index.htm?s=2&z=1&t=1&v=0&d=1&bd=0&k=000000&f=ffffff&ltf=009944&htf=cc0000&q=1&e=1&a=1&c=59493&w=500&h=176&align=left"></iframe>
        </div>
    </el-header>
    <el-main style="height:calc(100%-110px); width:100%;">
      <Map ref="map" :componentType="componentType"/>
    </el-main>

  </el-container>
</template>

<script>
import PortalMap from '@/components/PortalMap'
import Map from '@/components/Map'

export default {
  components: {PortalMap, Map},
  methods: {
    getCurrentTime () {
      let showDay = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
      let dateTime = new Date()
      let year = dateTime.getFullYear()
      if (year < 10) {
        year = '0' + year
      }
      let month = dateTime.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      let day = dateTime.getDate()
      if (day < 10) {
        day = '0' + day
      }
      let hours = dateTime.getHours()
      if (hours < 10) {
        hours = '0' + hours
      }
      let minutes = dateTime.getMinutes()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      let seconds = dateTime.getSeconds()
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      this.currentTime = year + '年' + month + '月' + day + '日' + ' ' + showDay[dateTime.getDay() - 1] + ' ' + hours + ':' + minutes + ':' + seconds
    },
    toggleComponent (title) {
      console.log(`========>  toggle: ${title}`)
      this.componentType = title
      this.glanceVisible = false
    }
  },
  data: function () {
    return {
      currentTime: '',
      glanceVisible: false,
      componentType: 'home'
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
  position: relative;
  text-shadow: 10px 10px 10px black;
  text-align: center;
  line-height: 110px;
}
#bannerTime{
  font-size: 18px;
  color: #FFFFFF;
  right: 15px;
  top: 10px;
  width: 300px;
  position: absolute;
  text-shadow: 10px 10px 10px black;
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
