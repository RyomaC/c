<template>
  <el-form label-width="80px">
    <el-form-item label="预警状态">
      {{warningState}} {{online ? '在线' :'离线'}}
    </el-form-item>
    <el-form-item label="整体开关">
      <el-button type="primary" @click="totalSwitchChange('OFF')">关</el-button>
      <el-button type="primary" @click="totalSwitchChange('ON')">开</el-button>      
    </el-form-item>     
    <el-form-item label="快速调灯">
      <el-slider v-model="dimming" @change="dimmingChange"/>
    </el-form-item>    
    <el-form-item label="主灯">
      <el-slider v-model="firDimming" @change="firDimmingChange"/>
    </el-form-item>
    <el-form-item label="辅灯">
      <el-slider v-model="secDimming" @change="secDimmingChange"/>
    </el-form-item>
    <el-form-item label="区域类型">
      <el-radio v-model="areaType" label="普通" @change="areaTypeChange">普通</el-radio>
      <el-radio v-model="areaType" label="岔路口" @change="areaTypeChange">岔路口</el-radio>
      <el-radio v-model="areaType" label="出入口" @change="areaTypeChange">出入口</el-radio>
      <el-radio v-model="areaType" label="重点区" @change="areaTypeChange">重点区</el-radio>
    </el-form-item>       
    <el-form-item label="清除报警">
      <el-button type="primary" @click="clearAlarm">清除</el-button>
    </el-form-item>
    <el-form-item label="灯光告警">
      <el-button type="primary" @click="setAlarmLight('OFF')">关闭</el-button>
      <el-button type="primary" @click="setAlarmLight('FLASH')">闪烁</el-button>
    </el-form-item>    
    <el-form-item label="红外设置">
      <el-button type="primary" @click="setIRDimming(0)">关</el-button>
      <el-button type="primary" @click="setIRDimming(1)">开</el-button>
    </el-form-item>       
    <el-form-item label="获取状态">
      <el-button type="primary" @click="fetchStatus()">获取</el-button>  
    </el-form-item>  
    <el-form-item label="角度校准">
      <el-button type="primary" @click="setAngle()">校准</el-button>  
    </el-form-item>      
    <br/><br/>
    <el-form-item label="指令码">
        <el-input v-model="commandCode"></el-input>        
        </el-form-item>
        <el-form-item label="指令">
          <el-input v-model="commandText" type="textarea" rows=5></el-input>          
        </el-form-item>
      <el-button @click="commandButtonClicked" type="primary" style="float:right; margin-right:20px">发送指令</el-button>    
  </el-form>
</template>

<script>
export default {
  props:['data_id', 'data_action', 'data_type', 'data', 'action_type'],
  methods: {
    dimmingChange: function() {
      this.postControl( 260, {Dimming: this.dimming})
    },
    firDimmingChange: function() {
      this.postControl( 260, {FirDimming: this.firDimming})
    },
    secDimmingChange: function() {
      this.postControl( 260, {SecDimming: this.secDimming})
    },
    areaTypeChange: function() {
      this.postControl( 289, {
        Group0_ID: this.areaType==='普通'   ? 1: 0, 
        Group1_ID: this.areaType==='岔路口' ? 1: 0, 
        Group2_ID: this.areaType==='出入口' ? 1: 0, 
        Group3_ID: this.areaType==='重点区' ? 1: 0
      })
    },     
    fetchStatus () {
      this.postControl(232)
    },    
    setAngle() {
      this.postControl(297)
    },
    postControl: function(code, options, stringify=true) {
      if (!this.data) return
      const uuid = this.data.UUID
      this.$axios
      .post('/device/control', {
        id: uuid,
        Confirm: code,
        options: stringify ? JSON.stringify(options) : options
      })
      .then(
        this.$message('指令已发送')
      )
      .catch(e => {
        this.$message({
          message: '操作失败',
          type: 'error'
        })
      })
    },
    commandButtonClicked() {
      this.postControl(parseInt(this.commandCode), this.commandText, false)
    },    
    clearAlarm: function() {
      const uuid = this.data.UUID
      this.$axios
      .post('/device/clearAlarm', {
        id: uuid
      })
      .catch(e => {
        this.$message({
          message: '操作失败',
          type: 'error'
        })
      })     
    }, 
    setAlarmLight: function(mode) {
      this.postControl(270, {
        Alarm_Light_Mode: mode
      })
    },
    setIRDimming(mode) {
      this.postControl(234, {
        IR_Dimming_en: mode
      })
    },
    totalSwitchChange: function(mode) {
      this.postControl( 260, {Dimming: mode=="ON"? 100: 0})
    },       
  },
  data() {
    return {
      warningState: this.data.Warning_state,
      dimming: this.data.Dimming,
      firDimming: this.data.FirDimming,
      secDimming: this.data.SecDimming,
      areaType: '普通',
      online: this.data.STATE,
      commandCode:0,
      commandText:''
    }
  }
}
</script>

<style>
</style>