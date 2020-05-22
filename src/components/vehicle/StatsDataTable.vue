<template>
<div style="overflow:hidden">
  <div class="header">
    <div class="headerTitle">{{options.title}}</div>
    <div class="headerItem" v-for="(aggregate, index) in options.aggregates" :key="index">
      <div class="headerItemTitle">{{aggregate.title}}</div>
      <div class="headerItemValue">{{aggregate.value}}</div>
    </div>
  </div>
  <el-table
    :data="options.tableData"
    :show-header="showHeader || true"
    :row-style="(r, i) => {return 'background-color:transparent; color:#fff;'}"
    :cell-style="(r, c) => {return 'background-color:transparent;padding:5px; border:0'}"
    :header-row-style="(r, i) => {return 'background-color:transparent; color:#fff;'}"
    :header-cell-style="(r, c) => {return 'padding-top:0px;background-color:transparent; border:0'}"
    style="width: 100%; background-color:transparent">
    <el-table-column v-for="(column,index) in options.columns" :key="index"
      :prop="column.prop"
      :label="column.label"
      :width="column.width">
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  props:['options', 'showHeader'],
}
</script>

<style scoped>
@import '../../../static/css/style.css';
.header {
  height: 50px;
  display: flex;
  flex-direction: row;
}
.headerTitle {
  padding: 10px;
  color: aqua;
  font-size: 20px;
  margin-right: 50px;
}
.headerItem {
  display: block;
  padding: 5px 10px;
}
.headerItemTitle {
  color: aqua;
}
.headerItemValue {
  color: white;
}
</style>
