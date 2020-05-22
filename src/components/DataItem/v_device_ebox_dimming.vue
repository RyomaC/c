<template>
  <el-form label-width="100px" style="text-align:left;">
     <el-form-item label="名称">
          <el-select v-model="dimmingPlanTitle" @change="dimmingPlanTitleChanged">
            <el-option
              v-for="item in dimmingPlanTitleList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="section"> 环境补光设置</div>
        <el-form-item label="照度">
          <el-checkbox v-model="formData['Illu_control_abl']" style="margin-right:15px"></el-checkbox><el-input v-model="formData['Illu_downthreshold']" style="width:60px"/> - <el-input v-model="formData['Illu_upthreshold']" style="width:60px"/> LUX
          <el-button @click="illuButtonClicked" type="primary" style="float:right; margin-right:20px">下发</el-button>
        </el-form-item>
        <el-form-item label="流量">
          <el-checkbox v-model="formData['Flow_control_abl']" style="margin-right:15px"></el-checkbox><el-input v-model="formData['Flow_downthreshold']" style="width:60px" /> - <el-input v-model="formData['Flow_upthreshold']" style="width:60px"/> R/m
          <el-button @click="flowButtonClicked" type="primary" style="float:right; margin-right:20px">下发</el-button>      
        </el-form-item>
        <el-form-item label="雷达">     
          <el-checkbox v-model="formData['Radar_control_abl']" style="margin-right:15px"></el-checkbox><el-input v-model="formData['Radar_downthreshold']" style="width:60px"/> - <el-input v-model="formData['Radar_upthreshold']" style="width:60px"/> S           
          <el-button @click="radarButtonClicked" type="primary" style="float:right; margin-right:20px">下发</el-button>                  
        </el-form-item>
        <div class="section"> 排程设置</div>
        <div style="height:30px"><el-button  @click="planButtonClicked" type="primary" style="float:right; margin-right:20px">下发</el-button></div>   
        <div class="section2">全局</div>
        <div class="section3">主灯</div>
        <el-row class="fir">
        <el-col :xs="12" :sm="12" :md="12" :lg="12">1 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fir_tt_Fir_Group0']" style="width:55%"></el-time-select><el-input v-model="formData['Fir_tp_Fir_Group0']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">2 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Sec_tt_Fir_Group0']" style="width:55%"></el-time-select><el-input v-model="formData['Sec_tp_Fir_Group0']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">3 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Thir_tt_Fir_Group0']" style="width:55%"></el-time-select><el-input v-model="formData['Thir_tp_Fir_Group0']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">4 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Four_tt_Fir_Group0']" style="width:55%"></el-time-select><el-input v-model="formData['Four_tp_Fir_Group0']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">5 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fif_tt_Fir_Group0']" style="width:55%"></el-time-select><el-input v-model="formData['Fif_tp_Fir_Group0']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">6 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Six_tt_Fir_Group0']" style="width:55%"></el-time-select><el-input v-model="formData['Six_tp_Fir_Group0']" style="width:40%"/></el-col>
        </el-row>
        <div class="section3">辅灯</div>
        <el-row class="sec">
        <el-col :xs="12" :sm="12" :md="12" :lg="12">1 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fir_tt_Sec_Group0']" style="width:55%"></el-time-select><el-input v-model="formData['Fir_tp_Sec_Group0']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">2 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Sec_tt_Sec_Group0']" style="width:55%"></el-time-select><el-input v-model="formData['Sec_tp_Sec_Group0']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">3 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Thir_tt_Sec_Group0']" style="width:55%"></el-time-select><el-input v-model="formData['Thir_tp_Sec_Group0']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">4 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Four_tt_Sec_Group0']" style="width:55%"></el-time-select><el-input v-model="formData['Four_tp_Sec_Group0']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">5 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fif_tt_Sec_Group0']" style="width:55%"></el-time-select><el-input v-model="formData['Fif_tp_Sec_Group0']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">6 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Six_tt_Sec_Group0']" style="width:55%"></el-time-select><el-input v-model="formData['Six_tp_Sec_Group0']" style="width:40%"/></el-col>
        </el-row>

      <div class="section2">出入口</div>
      <div class="section3">主灯</div>
        <el-row class="fir">
        <el-col :xs="12" :sm="12" :md="12" :lg="12">1 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fir_tt_Fir_Group1']" style="width:55%"></el-time-select><el-input v-model="formData['Fir_tp_Fir_Group1']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">2 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Sec_tt_Fir_Group1']" style="width:55%"></el-time-select><el-input v-model="formData['Sec_tp_Fir_Group1']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">3 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Thir_tt_Fir_Group1']" style="width:55%"></el-time-select><el-input v-model="formData['Thir_tp_Fir_Group1']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">4 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Four_tt_Fir_Group1']" style="width:55%"></el-time-select><el-input v-model="formData['Four_tp_Fir_Group1']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">5 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fif_tt_Fir_Group1']" style="width:55%"></el-time-select><el-input v-model="formData['Fif_tp_Fir_Group1']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">6 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Six_tt_Fir_Group1']" style="width:55%"></el-time-select><el-input v-model="formData['Six_tp_Fir_Group1']" style="width:40%"/></el-col>
        </el-row>
        <div class="section3">辅灯</div>
        <el-row class="sec">
        <el-col :xs="12" :sm="12" :md="12" :lg="12">1 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fir_tt_Sec_Group1']" style="width:55%"></el-time-select><el-input v-model="formData['Fir_tp_Sec_Group1']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">2 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Sec_tt_Sec_Group1']" style="width:55%"></el-time-select><el-input v-model="formData['Sec_tp_Sec_Group1']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">3 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Thir_tt_Sec_Group1']" style="width:55%"></el-time-select><el-input v-model="formData['Thir_tp_Sec_Group1']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">4 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Four_tt_Sec_Group1']" style="width:55%"></el-time-select><el-input v-model="formData['Four_tp_Sec_Group1']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">5 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fif_tt_Sec_Group1']" style="width:55%"></el-time-select><el-input v-model="formData['Fif_tp_Sec_Group1']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">6 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Six_tt_Sec_Group1']" style="width:55%"></el-time-select><el-input v-model="formData['Six_tp_Sec_Group1']" style="width:40%"/></el-col>
        </el-row>

      <div class="section2">岔路口</div>
      <div class="section3">主灯</div>
        <el-row class="fir">
        <el-col :xs="12" :sm="12" :md="12" :lg="12">1 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fir_tt_Fir_Group2']" style="width:55%"></el-time-select><el-input v-model="formData['Fir_tp_Fir_Group2']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">2 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Sec_tt_Fir_Group2']" style="width:55%"></el-time-select><el-input v-model="formData['Sec_tp_Fir_Group2']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">3 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Thir_tt_Fir_Group2']" style="width:55%"></el-time-select><el-input v-model="formData['Thir_tp_Fir_Group2']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">4 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Four_tt_Fir_Group2']" style="width:55%"></el-time-select><el-input v-model="formData['Four_tp_Fir_Group2']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">5 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fif_tt_Fir_Group2']" style="width:55%"></el-time-select><el-input v-model="formData['Fif_tp_Fir_Group2']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">6 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Six_tt_Fir_Group2']" style="width:55%"></el-time-select><el-input v-model="formData['Six_tp_Fir_Group2']" style="width:40%"/></el-col>
        </el-row>
        <div class="section3">辅灯</div>
        <el-row class="sec">
        <el-col :xs="12" :sm="12" :md="12" :lg="12">1 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fir_tt_Sec_Group2']" style="width:55%"></el-time-select><el-input v-model="formData['Fir_tp_Sec_Group2']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">2 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Sec_tt_Sec_Group2']" style="width:55%"></el-time-select><el-input v-model="formData['Sec_tp_Sec_Group2']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">3 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Thir_tt_Sec_Group2']" style="width:55%"></el-time-select><el-input v-model="formData['Thir_tp_Sec_Group2']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">4 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Four_tt_Sec_Group2']" style="width:55%"></el-time-select><el-input v-model="formData['Four_tp_Sec_Group2']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">5 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fif_tt_Sec_Group2']" style="width:55%"></el-time-select><el-input v-model="formData['Fif_tp_Sec_Group2']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">6 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Six_tt_Sec_Group2']" style="width:55%"></el-time-select><el-input v-model="formData['Six_tp_Sec_Group2']" style="width:40%"/></el-col>
        </el-row>


      <div class="section2">重点区</div>
      <div class="section3">主灯</div>
        <el-row class="fir">
        <el-col :xs="12" :sm="12" :md="12" :lg="12">1 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fir_tt_Fir_Group3']" style="width:55%"></el-time-select><el-input v-model="formData['Fir_tp_Fir_Group3']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">2 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Sec_tt_Fir_Group3']" style="width:55%"></el-time-select><el-input v-model="formData['Sec_tp_Fir_Group3']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">3 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Thir_tt_Fir_Group3']" style="width:55%"></el-time-select><el-input v-model="formData['Thir_tp_Fir_Group3']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">4 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Four_tt_Fir_Group3']" style="width:55%"></el-time-select><el-input v-model="formData['Four_tp_Fir_Group3']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">5 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fif_tt_Fir_Group3']" style="width:55%"></el-time-select><el-input v-model="formData['Fif_tp_Fir_Group3']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">6 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Six_tt_Fir_Group3']" style="width:55%"></el-time-select><el-input v-model="formData['Six_tp_Fir_Group3']" style="width:40%"/></el-col>
        </el-row>
        <div class="section3">辅灯</div>
        <el-row class="sec">
        <el-col :xs="12" :sm="12" :md="12" :lg="12">1 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fir_tt_Sec_Group3']" style="width:55%"></el-time-select><el-input v-model="formData['Fir_tp_Sec_Group3']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">2 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Sec_tt_Sec_Group3']" style="width:55%"></el-time-select><el-input v-model="formData['Sec_tp_Sec_Group3']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">3 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Thir_tt_Sec_Group3']" style="width:55%"></el-time-select><el-input v-model="formData['Thir_tp_Sec_Group3']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">4 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Four_tt_Sec_Group3']" style="width:55%"></el-time-select><el-input v-model="formData['Four_tp_Sec_Group3']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">5 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Fif_tt_Sec_Group3']" style="width:55%"></el-time-select><el-input v-model="formData['Fif_tp_Sec_Group3']" style="width:40%"/></el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12">6 :<el-time-select :picker-options="{start: '00:00', step: '00:01', end: '23:59'}" v-model="formData['Six_tt_Sec_Group3']" style="width:55%"></el-time-select><el-input v-model="formData['Six_tp_Sec_Group3']" style="width:40%"/></el-col>
        </el-row>
  </el-form>
</template>

<script>
export default {
  props:['data_id', 'data_action', 'data_type', 'data', 'action_type'],  
  data() {
    return {
      formData: {},
      dimmingPlanTitleList: [],
      dimmingPlanTitle: '',
      commandCode:0,
      commandText:'',
      subGroups:[]
    }
  },
  mounted() {
    this.fetchDimmingPlanTitleList()
    this.$EventBus.$on('projectChanged', ({project}) => {
      if (typeof(project) === 'undefined')  return []
      this.subGroups = project.subgroups ? JSON.parse(project.subgroups) : []
    })
  },  
  methods: {
    illuButtonClicked: function() {
      this.$message(`${this.formData.Illu_control_abl} ${this.formData.Illu_downthreshold} ${this.formData.Illu_upthreshold}`)
    },
    flowButtonClicked: function() {
      this.$message(`${this.formData.Flow_control_abl} ${this.formData.Flow_downthreshold} ${this.formData.Flow_upthreshold}`)
    },
    radarButtonClicked: function() {
      this.$message(`${this.formData.Radar_control_abl} ${this.formData.Radar_downthreshold} ${this.formData.Radar_upthreshold}`)
    },    
    planButtonClicked: function() {
      this.$axios
      .post('/device/setHubDimmingPlan', {
        id: this.data.UUID,
        options: this.formData
      })
      .then(this.$message('指令已发送'))
    },
    fetchDimmingPlanTitleList: function() {
      this.$axios
      .post('/sys_dict/selectDimmingPlan')
      .then(response => this.dimmingPlanTitleList = response.data.data)
    },
    dimmingPlanTitleChanged: function(title) {
      this.$axios.post('/dimming_plan/list', {
        where: {title: title}
      })
      .then(response => {
        if (response.data.data.data.length > 0) {
          this.formData = response.data.data.data[0]
        }
      })
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
  }
}
</script>

<style>
.section {
  font-size:12pt;
  margin: 10px 0 10px 0;
  background: gray;
  padding: 3px;
}
.section2 {
  margin-top: 10px;
  font-size: 12pt;
  padding: 3px;
}
.section3 {
  font-size: 10pt;
  padding: 3px;
}
.fir {
  background:  rgb(37, 97, 207);
}
.sec {
  background: rgb(66, 74, 90);
}
</style>