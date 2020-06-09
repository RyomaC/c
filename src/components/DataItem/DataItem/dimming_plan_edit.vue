<template>
  <el-form label-width="100px" style="text-align:left">
    <el-form-item label="名称">
      <el-input v-model="formData['title']"/>
    </el-form-item>
    <div class="section"> 环境补光设置</div>
    <el-form-item label="照度">
      <el-input v-model="formData['Illu_downthreshold']" style="width:200px"/> - <el-input v-model="formData['Illu_upthreshold']" style="width:200px"/> LUX
    </el-form-item>
    <el-form-item label="流量">
      <el-input v-model="formData['Flow_downthreshold']" style="width:200px" /> - <el-input v-model="formData['Flow_upthreshold']" style="width:200px"/> R/min
    </el-form-item>
    <el-form-item label="雷达">
      <el-input v-model="formData['Radar_downthreshold']" style="width:200px"/> - <el-input v-model="formData['Radar_upthreshold']" style="width:200px"/> S
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="formData['remark']"/>
    </el-form-item>
    <div class="section"> 排程设置</div>
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
  props: ['formData']
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
