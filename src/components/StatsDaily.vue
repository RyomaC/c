<template>
  <div>
    <div>{{date}}</div>
    <br/>
    <div>平均功率：{{statsDaily.powerMean}}
    <div>用电量：{{statsDaily.powerUsage}}</div>
    <br/>
    <div>天黑时间：{{statsDaily.onTime}}  天亮时间：{{statsDaily.offTime}} </div>
    <div>亮灯时间：{{statsDaily.onTime}}  灭灯时间：{{statsDaily.offTime}} </div>
    <div>亮灯数：{{statsDaily.onCount}}
    <br/>
    <div>注意事项</div>
    <br/>
  </div>
</template>

<script>
export default {
  props: {date},
  data () {
    return {
      statsDaily: {}
    }
  },
  methods: {
    fetchData () {
      this.$axios.post('/stats/daily', {date: this.date})
        .then(
          result => this.statsDaily = result.data.data
        )
    }
  },
  watch: {
    'date': () => {
      this.fetchData()
    }
  }
}
</script>
