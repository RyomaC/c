import echartsUtil from '@/utils/echartsUtil'

export default {
    tooltip: {},
    title: {
        text: '总体流量统计(GB)',
        textStyle: {
            color: '#fff',
            fontSize: 10
        },
        left: '0',
        top: '0'
    },
    grid: {
        left: '20',
        right: '0',
        top: '20',
        bottom: '0',
        containLabel: true
    },

    xAxis: {
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        axisTick: {
            show: false,
        },
        axisLabel: {
            interval: 1,
            textStyle: {
                color: '#fff',
                fontSize: 9,
            }
        },
        axisLine: {
            lineStyle: {
                type: 'solid',
                color: '#fff',
                width: '1  ', //坐标线的宽度

            }
        },
    },
    yAxis: {
        splitLine: {
            show: false,
            lineStyle: {
                color: '#40A1EA',//网格横线颜色
                width: 1,
                type: 'solid'
            }
        },
        axisLabel: {
            textStyle: {
                color: '#fff',
                fontSize: 9,//坐标值得具体的颜色
            }
        },
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
    },
    series: [{
        name: '流量',
        type: 'bar',
        barWidth: '40%',
        data: [257,258,385, 60, 258,563,258,135,236],        //数据
        // data: itemData,
        itemStyle: {
            normal: {
                color: echartsUtil.gradientColor('#06B5D7', '#71C8B1')
                // color: new echarts.graphic.LinearGradient(
                //     0, 0, 0, 1,
                //     [
                //         { offset: 0, color: '#06B5D7' },                   //柱图渐变色
                //         { offset: 0.5, color: '#44C0C1' },                 //柱图渐变色
                //         { offset: 1, color: '#71C8B1' },                   //柱图渐变色
                //     ]
                // )
            },
            emphasis: {
                color: echartsUtil.gradientColor('#71C8B1', '#06B5D7')
                // color: new echarts.graphic.LinearGradient(
                //     0, 0, 0, 1,
                //     [
                //         { offset: 0, color: '#71C8B1' },                  //柱图高亮渐变色
                //         { offset: 0.7, color: '#44C0C1' },                //柱图高亮渐变色
                //         { offset: 1, color: '#06B5D7' }                   //柱图高亮渐变色
                //     ]
                // )
            }
        },
    }]
}