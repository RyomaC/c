<template>
<div class="left_one_wrapper border-father">
    <div class="left_one_top">
        <p>电箱能耗运行状态</p>
    </div>
    <div class="left_one_bottom">
        <div class="left_one_item1">
            <div class="energy_bottom_tp_item">
                <div class="energy_bottom_text">
                    <p class="energy_bottom_text_p1"><em class="a_power">{{eltboxValues.totalActualPower? parseFloat(eltboxValues.totalActualPower).toFixed(2):179.54}}</em><span>KW</span><i></i></p>
                </div>
				<div class="energy_bottom_img">
                    <img src="/static/images/energy01.png">
					<div class="div_t">
                        <p class="energy_bottom_text_p3">实际功率</p>
					</div>
                </div>
            </div>
            <div class="energy_bottom_tp_item">
                <div class="energy_bottom_text">
                    <p class="energy_bottom_text_p1"><em class="b_power">{{eltboxValues.totalRatedPower? parseFloat(eltboxValues.totalRatedPower).toFixed(2): 450.00}}</em><span>KW</span><i></i></p>
                </div>
				<div class="energy_bottom_img">
                    <img src="/static/images/energy02.png">
					<div class="div_t">
						<p class="energy_bottom_text_p3 energy_bottom_ed">额定功率</p>
					</div>
                </div>
            </div>
            <div class="energy_bottom_tp_item">
                <div class="energy_bottom_text">
                    <p class="energy_bottom_text_p1"><em class="c_power">{{eltboxValues.ecYear? parseFloat(eltboxValues.ecYear).toFixed(2): 475823.13}}</em><span>KWH</span><i></i></p>
                </div>
				<div class="energy_bottom_img">
                    <img src="/static/images/energy03.png">
					<div class="div_t">
						<p class="energy_bottom_text_p3 energy_bottom_y">年节约能耗</p>
					</div>
                </div>
            </div>
            <div class="energy_bottom_tp_item">
                <div class="energy_bottom_text">
                    <p class="energy_bottom_text_p1"><em class="d_power">{{eltboxValues.ecMonth?parseFloat(eltboxValues.ecMonth).toFixed(2):39108.75}}</em><span>KWH</span><i></i></p>
                </div>
				<div class="energy_bottom_img">
                    <img src="/static/images/energy04.png">
					<div class="">
						<p class="energy_bottom_text_p3 energy_bottom_m">月节约能耗</p>
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
  props: ['eltboxValues', 'eltboxOptions']
}
</script>

<style scoped>
@import '../../static/css/style.css';
</style>
