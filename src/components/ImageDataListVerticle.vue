<template>
  <div style="display:flex; flex-direction:column; flex-wrap:wrap; font-size:11px; padding:5px; color:#3bdafe;">
    <div style="display:flex;" v-for="(row) in options.tableData" :key="row._id" class="list-complete-item"  @click="itemClicked(row)">
      <span><el-image :src="row['picVehicleSub']" :preview-src-list="[row['picVehicle']]" style="width:160px; height:120px;" fit="scale-down"/></span>
      <span style="display:inline; text-align:left; font-size: 12px; width:70px;"><div v-for="(column, columnIndex) in options.columns" :width="column.width"  :key="columnIndex">{{row[column.prop]}}</div></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['options'],
  methods: {
    itemClicked (data) {
      this.$EventBus.$emit('vehicleItemClicked', data)
    }
  }
}
</script>

<style scoped>
@import '../../static/css/style.css';

.list-complete-item {
  transition: all 1s;
  padding-right: 10px;
  display: block;
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
