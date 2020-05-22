<template>
<div style="overflow:hidden">
  <div class="header">
    <div class="headerTitle">{{options.title}}</div>
    <div class="headerItem" v-for="(aggregate, index) in options.aggregates" :key="index">
      <div class="headerItemTitle">{{aggregate.title}}</div>
      <div class="headerItemValue">{{aggregate.value}}</div>
    </div>
  </div>
    <table>
    <transition-group name="list-complete" tag="ul">
      <tr v-for="(row) in options.tableData" :key="row._id" class="list-complete-item">
        <td v-for="(column, columnIndex) in options.columns" :width="column.width"  :key="columnIndex">{{row[column.prop]}}</td>
      </tr>
     </transition-group>
    </table>
</div>
</template>

<script>
export default {
  props: ['options']
}
</script>

<style scoped>
@import '../../static/css/style.css';
table {
  color:white;
}
td {
  padding: 5px;
}
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

.list-complete-item {
  transition: all 1s;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(100px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
