<template>
  <div>
      <div v-for="(metric,index) in metrics" :key="index" class="metric">
        {{metric}}
      </div>
  </div>
</template>

<script>
export default {
  props:['data_id', 'data_action', 'data_type', 'data', 'action_type'],
  methods: {
    fetchData() {
     this.$axios
      .post('/device/historyMetrics', {
        uuid: this.data.UUID
      })
      .then(response => {
        this.metrics = response.data.data
      })
    }
  },
  data() {
    return {
      metrics:[]
    }
  }, 
  mounted() {
    this.fetchData()
  }
}
</script>

<style>
.metric {
  font-size: 12px !important;
  text-align: left;
  margin-bottom: 8px
}
</style>