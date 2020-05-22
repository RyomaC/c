<template>
  <div>
      <el-input v-model="q"/> <el-button @click="query()" >提交</el-button>
      <div style="color:white;">{{result}}</div>
  </div>

</template>

<script>
export default {
  data () {
    return {
      q: '',
      result: ''
    }
  },
  methods: {
    query () {
      this.$axios.post('/util/queryInflux', {q: this.q})
        .then(result => this.result = result.data.data)
    }
  }
}
</script>
