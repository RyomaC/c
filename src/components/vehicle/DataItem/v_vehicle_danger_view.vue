<template>
  <div>
    <div style="text-align:left; font-size:15pt; margin-bottom:20px;">{{data.plateInfo}}</div>
    <div style="min-height:240px"><img :src="data.picVehicleSub"/></div>
    <StatsDataList style="padding:10px;" :options="dangerVehicleData" eventName="null"/>
  </div>
</template>

<script>
import StatsDataList from '@/components/StatsDataList'
import {_} from 'underscore'

export default {
  components: {StatsDataList},
  props: ['data_id', 'data_action', 'data_type', 'data', 'action_type'],
  data () {
    return {
      dangerVehicleData: {}
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$axios.post('vehicle_capture/list', {where: {plateInfo: this.data.plateInfo}, page: 1, size: 15, order: 'occured_time DESC'})
        .then(response => {
          let data = response.data.data
          let options = {}
          options['title'] = '历史轨迹'
          options['tableData'] = _.each(data.data, (v, k, list) => {
            // v.occured_time = v.occured_time.slice(11,19)
            v.sourceTitle = `${v.sourceTitle} ${v.roadDirection ? v.roadDirection : ''}`
            // v.image = `<img style="width: 40px; height: 40px; vertical-align: middle; object-fit: cover" src="${v.picVehicleSub}" />`
          })
          options['columns'] = [
            // {prop: 'plateInfo', label: '车牌号', width: 130},
            {prop: 'picVehicleSub', label: '缩略图', width: 50, type: 'image', imageProp: 'picVehicle'},
            {prop: 'sourceTitle', label: '卡口名称', width: 350},
            {prop: 'occured_time', label: '时间', width: 100}
          ]
          this.dangerVehicleData = options
          this.$EventBus.$emit('addHistoryMarkers', options.tableData)
        })
    }
  }
}
</script>

<style>
.v_vehicle_danger .el-tabs {
  height: 0;
  visibility: hidden;
}
</style>
