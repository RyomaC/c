<template>
  <div>
    <div style="text-align:left; font-size:15pt; margin-bottom:20px;">{{data.NAME}} {{data.ADDR}}</div>
    <div style="height:240px">
      <canvas id="canvas" ref="canvas" style="width:320px; height:240px;z-index:1999;" ></canvas>
    </div>
    <StatsDataList style="padding:10px;" :options="dangerVehicleData" eventName="null"/>
  </div>
</template>

<script>
import StatsDataList from '@/components/StatsDataList'
import {_} from 'underscore'
import {JSMpeg} from '../jsmpeg.min.js'

export default {
  components: {StatsDataList},
  props: ['data_id', 'data_action', 'data_type', 'data', 'action_type'],
  data () {
    return {
      player: null,
      dangerVehicleData: {}
    }
  },
  mounted () {
    this.fetchData()
  },
  destroyed () {
    this.player.destroy()
  },
  methods: {
    fetchData () {
      this.$axios.post('vehicle_capture/list', {
        where: {sourceIP: this.data.IPADDR},
        page: 1,
        size: 15,
        order: 'occured_time DESC'
      })
        .then(response => {
          let data = response.data.data
          let options = {}
          options['title'] = '检出车辆'
          options['tableData'] = _.each(data.data, (v, k, list) => {
            v.sourceTitle = `${v.sourceTitle} ${v.roadDirection ? v.roadDirection : ''}`
          })
          options['columns'] = [
            {prop: 'plateInfo', label: '车牌号', width: 130},
            {prop: 'occured_time', label: '时间', width: 100},
            {prop: 'picVehicleSub', label: '缩略图', width: 65, type: 'image', imageProp: 'picVehicle'}
          ]
          this.dangerVehicleData = options
        })
      //注意必须部署到对应的web服务器，方能正确连接到websocket
      this.player = new JSMpeg.Player(`ws://${window.location.hostname}:9999`, {
        canvas: this.$refs.canvas
      })
      if (this.data.IPADDR) {
        this.$axios.post('vehicle_alarm/cameraSwitch', {
          ip: this.data.IPADDR,
          type: this.data.TYPE
        })
      }
    }
  }
}
</script>

<style>
.v_device .el-tabs {
  height: 0;
  visibility: hidden;
}
</style>
