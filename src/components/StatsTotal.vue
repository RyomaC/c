<template>
<div class="left_one_wrapper column border-father">
    <div class="left2_top_box rows">
        <div class="left2_bottom_left">
            <ECharts style="width:100%; height:100%" :options="options1"/>
        </div>
        <div class="left2_bottom_right">
            <ECharts style="width:100%; height:100%" :options="options2"/>
        </div>
    </div>
    <div class="left2_bottom_box rows">
        <div class="left2_bottom_left">
            <ECharts style="width:100%; height:100%" :options="options3"/>
        </div>
        <div class="left2_bottom_right">
            <ECharts style="width:100%; height:100%" :options="options4"/>
        </div>
    </div>
</div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'

export default {
  components: {ECharts},
  props: ['options1', 'options2', 'options3', 'options4']
}
</script>

<style scoped>
@import '../../static/css/style.css';
.left2_top_box{
    flex:1;
}
.left2_bottom_box{
    flex:1;
}
.left2_bottom_left{
    flex:1;
}
.left2_bottom_right{
    flex:1;
}
</style>
