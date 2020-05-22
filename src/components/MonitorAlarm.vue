<template>
  <div>
      <DataList ref="dataList" :datatype="dataListType" fixedColumns="0" />
  </div>
</template>

<script>
import PortalMap from '@/components/PortalMap'
import FrameContainer from '@/components/FrameContainer'
import DataList from '@/components/vehicle/DataList'

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/chart/pictorialBar'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import {_} from 'underscore'
import echartsUtil from '@/utils/echartsUtil'

export default {
  components: {FrameContainer, DataList
  },
  methods: {
  },
  data: function () {
    return {
      dataListType: 'vehicle_alarm'
    }
  },
  mounted: function () {

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
#banner{
  left: 500px;
  top: 0px;
  width: 1200px;
  height: 200px;
  position: absolute;
  z-index: 998;
  background: url('/static/images/bg.png') no-repeat;
}
#bannerTime{
  font-size: 25pt;
  color: rgb(240, 240, 240);
  left: 150px;
  top: 10px;
  height: 100px;
  position: absolute;
  z-index: 999;
  text-shadow:10px 10px 10px black
}
#bannerTitle{
  font-size: 45pt;
  color: rgb(240, 240, 240);
  left: 340px;
  top: 65px;
  /* height: 250px; */
  position: absolute;
  z-index: 999;
  text-shadow:10px 10px 10px black
}

.moduleTitle{
  color:white;
}
#topdrawer i{
  color:white;
  font-size: 25px;
}
#topdrawer .el-col{
  margin: 0 auto !important;
}
</style>
