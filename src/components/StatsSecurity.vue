<template>
<div class="left_one_wrapper border-father">
    <div class="left_one_top">
        <p>智能安防</p>
    </div>
    <div class="left_one_bottom">
        <div class="left_one_item1">
            <div class="energy_bottom_tp_item">
                <div class="energy_bottom_text">
                    <p class="energy_bottom_text_p1"><em class="a_power">{{data.person}}</em></p>
                </div>
				<div class="energy_bottom_img">
					<div class="div_t">
                        <p class="energy_bottom_text_p3">行人</p>
					</div>
                </div>
            </div>
            <div class="energy_bottom_tp_item">
                <div class="energy_bottom_text">
                    <p class="energy_bottom_text_p1"><em class="b_power">{{data.vehicle}}</em></p>
                </div>
				<div class="energy_bottom_img">
					<div class="div_t">
						<p class="energy_bottom_text_p3 energy_bottom_ed">车辆</p>
					</div>
                </div>
            </div>
            <div class="energy_bottom_tp_item">
                <div class="energy_bottom_text">
                    <p class="energy_bottom_text_p1"><em class="c_power">{{data.business}}</em></p>
                </div>
				<div class="energy_bottom_img">
					<div class="div_t">
						<p class="energy_bottom_text_p3 energy_bottom_y">摊贩</p>
					</div>
                </div>
            </div>
            <div class="energy_bottom_tp_item">
                <div class="energy_bottom_text">
                    <p class="energy_bottom_text_p1"><em class="d_power">{{data.ad}}</em></p>
                </div>
				<div class="energy_bottom_img">
					<div class="">
						<p class="energy_bottom_text_p3 energy_bottom_m">广告</p>
					</div>
                </div>
            </div>
        </div>
        <ECharts style="width:100%;min-height:100px" :options="eltboxOptions" autoresize/>
    </div>
</div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'

export default {
  components: {ECharts},
  props: ['data']
}
</script>

<style scoped>
@import '../../static/css/style.css';
</style>
