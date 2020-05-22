<template>
  <el-form label-width="80px"  style="text-align:left; height:calc(100% - 50px); overflow-y:auto; overflow-x:hidden;">
    <div style="text-align:left; padding:10px;font-size:15px; height:30px">已选设备数：{{uuids.length}}</div>
    <el-tabs type="card">
      <el-tab-pane label="控制">
        <el-form-item label="整体开关">
          <el-button type="primary" @click="totalSwitch('OFF')">关</el-button>
          <el-button type="primary" @click="totalSwitch('ON')">开</el-button>
        </el-form-item>
        <el-form-item label="主灯">
          <el-slider v-model="firDimming" @change="firDimmingChange"/>
        </el-form-item>
        <el-form-item label="辅灯">
          <el-slider v-model="secDimming" @change="secDimmingChange"/>
        </el-form-item>
        <el-form-item label="灯光告警">
          <el-button type="primary" @click="setAlarmLight('OFF')">关闭</el-button>
          <el-button type="primary" @click="setAlarmLight('FLASH')">闪烁</el-button>
        </el-form-item>
        <el-form-item label="获取状态">
          <el-button type="primary" @click="fetchStatus()">获取</el-button>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="配置">
        <el-form-item label="分组">
            <el-select v-model="subgroup" style="width:250px" clearable>
              <el-option v-for="(item, index) in subGroups" :value="item" :key="index" />
            </el-select>
            <el-button type="primary" @click="groupSubmit">确定</el-button>
        </el-form-item>
        <el-form-item label="FUUID">
          <el-input v-model="fuuid" style="width:250px" />
          <el-button type="primary" @click="fuuidSubmit">确定</el-button>
        </el-form-item>
        <el-form-item label="区域类型">
          <el-radio v-model="areaType" label="普通" @change="areaTypeChange">普通</el-radio>
          <el-radio v-model="areaType" label="岔路口" @change="areaTypeChange">岔路口</el-radio>
          <el-radio v-model="areaType" label="出入口" @change="areaTypeChange">出入口</el-radio>
          <el-radio v-model="areaType" label="重点区" @change="areaTypeChange">重点区</el-radio>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="照度规划">
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
      </el-tab-pane>
      <el-tab-pane label="指令">
        <el-form-item label="指令码">
          <el-input v-model="commandCode" />
        </el-form-item>
        <el-form-item label="指令">
          <el-input v-model="commandText" type="textarea" rows=5 />
        </el-form-item>
        <el-button @click="commandButtonClicked" type="primary" style="float:right; margin-right:20px">发送指令</el-button>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
export default {
  props: ['uuids', 'project'],
  data () {
    return {
      firDimming: 0,
      secDimming: 0,
      areaType: '普通',
      subgroup: '',
      fuuid: '',
      formData: {},
      dimmingPlanTitleList: [],
      dimmingPlanTitle: '',
      commandCode: 0,
      commandText: '',
      subGroups: []
    }
  },
  mounted () {
    this.fetchDimmingPlanTitleList()
    this.$EventBus.$on('projectChanged', ({project}) => {
      if (typeof (project) === 'undefined') return []
      this.subGroups = project.subgroups ? JSON.parse(project.subgroups) : []
    })
  },
  methods: {
    groupSubmit: function () {
      this.$axios
        .post('/device/edit', {
          data: {
            SUBGROUP: this.subgroup
          },
          where: {
            // UUID: {$in: this.uuids}
            UUID: ['IN', this.uuids]
          }
        })
        .then(
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        )
        .catch(e => {
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        })
    },
    fuuidSubmit: function () {
      this.$axios
        .post('/device/edit', {
          data: {
            FUUID: this.fuuid
          },
          where: {
            // UUID: {$in: this.uuids}
            UUID: ['IN', this.uuids]
          }
        })
        .then(
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        )
        .catch(e => {
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        })
    },
    totalSwitch: function (mode) {
      this.postControl(260, {Dimming: mode === 'ON' ? 100 : 0})
    },
    fetchStatus () {
      this.postControl(232)
    },
    firDimmingChange: function () {
      this.postControl(260, {FirDimming: this.firDimming})
    },
    secDimmingChange: function () {
      this.postControl(260, {SecDimming: this.secDimming})
    },
    areaTypeChange: function () {
      this.postControl(289, {
        Group0_ID: this.areaType === '普通' ? 1 : 0,
        Group1_ID: this.areaType === '岔路口' ? 1 : 0,
        Group2_ID: this.areaType === '出入口' ? 1 : 0,
        Group3_ID: this.areaType === '重点区' ? 1 : 0
      })
    },
    postControl: function (code, options, stringify = true) {
      if (!this.uuids) return
      if (this.uuids.length <= 0) return
      this.$axios.post('/device/control', {
        ids: this.uuids,
        Confirm: code,
        options: stringify ? JSON.stringify(options) : options
      }).then(
        this.$message('指令已发送')
      ).catch(e => {
        this.$message({
          message: '操作失败',
          type: 'error'
        })
      })
    },
    setAlarmLight: function (mode) {
      this.postControl(270, {
        Alarm_Light_Mode: mode
      })
    },
    commandButtonClicked () {
      this.postControl(parseInt(this.commandCode), this.commandText, false)
    },
    illuButtonClicked: function () {
      this.$message(`${this.formData.Illu_control_abl} ${this.formData.Illu_downthreshold} ${this.formData.Illu_upthreshold}`)
    },
    flowButtonClicked: function () {
      this.$message(`${this.formData.Flow_control_abl} ${this.formData.Flow_downthreshold} ${this.formData.Flow_upthreshold}`)
    },
    radarButtonClicked: function () {
      this.$message(`${this.formData.Radar_control_abl} ${this.formData.Radar_downthreshold} ${this.formData.Radar_upthreshold}`)
    },
    planButtonClicked: function () {
      if (!this.uuids) return
      if (this.uuids.length <= 0) return
      this.$axios
        .post('/device/setDimmingPlan', {
          ids: this.uuids,
          options: this.formData
        })
        .then(this.$message('指令已发送'))
    },
    fetchDimmingPlanTitleList: function () {
      this.$axios
        .post('/sys_dict/selectDimmingPlan')
        .then(response => this.dimmingPlanTitleList = response.data.data)
    },
    dimmingPlanTitleChanged: function (title) {
      this.$axios.post('/dimming_plan/list', {
        where: {title: title}
      })
        .then(response => {
          if (response.data.data.data.length > 0) {
            this.formData = response.data.data.data[0]
          }
        })
    }
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
