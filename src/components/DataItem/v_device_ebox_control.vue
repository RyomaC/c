<template>
  <el-form label-width="100px">
    <el-form-item label="在线状态">
      {{online ? '在线' :'离线'}}
    </el-form-item>    
    <el-form-item label="继电器开关">
      <el-switch v-model="repeaterSwitch" @change="repeaterSwitchChange"/>
    </el-form-item>
    <el-form-item label="整体开关">
      <el-button type="primary" @click="totalSwitchChange('OFF')">关</el-button>
      <el-button type="primary" @click="totalSwitchChange('ON')">开</el-button>  
    </el-form-item>
    <el-form-item label="主灯">
      <el-slider v-model="firDimming" @change="firDimmingChange"/>
    </el-form-item>
    <el-form-item label="辅灯">
      <el-slider v-model="secDimming" @change="secDimmingChange"/>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props:['data_id', 'data_action', 'data_type', 'data', 'action_type'],  
  methods: {
    repeaterSwitchChange: function() {
      this.postControl( 512, {Rel_State: this.repeaterSwitch ? 0 : 255 })
    },
    totalSwitchChange: function(mode) {
      this.postControl( 4, {Dimming: mode=="ON" ? 100 : 0 })
    },    
    firDimmingChange: function() {
      this.postControl( 4, {FirDimming: this.firDimming})
    },
    secDimmingChange: function() {
      this.postControl( 4, {SecDimming: this.secDimming})
    },      
    postControl: function(code, options) {
      this.$axios
      .post('/device/control', {
        id: this.data.UUID,
        Confirm: code,
        options: JSON.stringify(options)
      })
      .catch(e => {
        this.$message({
          message: '操作失败',
          type: 'error'
        })
      })
    },
  },
  data() {
    return {
      repeaterSwitch: false,
      totalSwitch: false,
      firDimming: this.data.FirDimming,
      secDimming: this.data.SecDimming,
      online: this.data.STATE
    }
  }
}
</script>

<style>
</style>