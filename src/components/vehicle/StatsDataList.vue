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
      <tr v-for="(row) in options.tableData" :key="row._id" class="list-complete-item" @click="rowClick(row)">
        <td v-for="(column, columnIndex) in options.columns" :width="column.width"  :key="columnIndex">
          <div v-if="column.type==='image'"><el-image :src="row[column.prop]" :preview-src-list="[row[column.imageProp]]" z-index=9999></el-image></div>
          <div v-else>{{row[column.prop]}}</div>
        </td>
      </tr>
     </transition-group>
    </table>
</div>
</template>

<script>
export default {
  props: ['options', 'eventName'],
  methods: {
    rowClick (row) {
      this.$EventBus.$emit(this.eventName || 'dangerVehicleClick', row)
    }
  }
}
</script>

<style scoped>
@import '../../../static/css/style.css';
table {
  color:white;
  border-collapse: collapse;
}
table ul{
  margin: 0px 10px;
  position: relative;
}
table tr{
    height: 83px;
    /* border: 1px solid #1F486F; */
}
table tr td{
  display: table-cell;
  vertical-align:middle;
  padding: 8px;
  font-size: 12px;
}

.header {
  height: 30px;
  display: flex;
  flex-direction: row;
}
.headerTitle {
  color: #3bdafe;
  font-size: 20px;
  margin: 1px 15px;
}
.headerItem {
  display: block;
  padding: 5px 10px;
}
.headerItemTitle {
  color: #3bdafe;
}
.headerItemValue {
  color: white;
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
