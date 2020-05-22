<template>
<div>
    <div style="display:flex; font-size:11px; padding:5px; color:#3bdafe;">
      <div v-for="(row) in options.tableData" :key="row._id" class="list-complete-item"  @click="itemClicked(row)">
        <div><el-image :src="row['picVehicleSub']" :preview-src-list="[row['picVehicle']]" style="width:160px; height:120px;"  fit="scale-down"/></div>
       <!-- <div><el-image src="/static/object/result_frame_00-01_car_2.jpg" style="width:160px; height:120px; object-fit: cover;"/></div> -->
    
        <div style="text-align:left;  font-size: 12px;"><div v-for="(column, columnIndex) in options.columns" :width="column.width"  :key="columnIndex">{{row[column.prop]}}</div></div>
      </div>
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
@import '../../../static/css/style.css';

.list-complete-item {
  transition: all 1s;
  padding-right: 10px;
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
