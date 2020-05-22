import echartsUtil from '@/utils/echartsUtil'

export default {
    tooltip: {
        trigger: 'axis',
        show: true,
        axisPointer: {
            lineStyle: {
                color: 'true',
            },
        },
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        textStyle: {
            align: 'left',
            fontSize: 10,
            color: '#fff',
        },
        extraCssText: 'box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2)',
    },
    color: ['#0580f2', '#faa732', '#e1575d'],
    grid: {
        left: 20,
        right: 0,
        top: 30,
        bottom: 0,
        containLabel: true
    },
    legend: {
        show: true,
        icon: 'circle',
        x: 'left',
        textStyle: {
            fontSize: 10,
            color: '#ddd'
        },
        data: [],
    },
    xAxis: {
        show: true,
        type: 'category',
        axisTick: {
            show: false
        },
        axisLine: {
            show: false,
            lineStyle: {
                color: '#ddd',
            }
        },
        axisLabel: {
            textStyle: {
                fontSize: 10,
                color: '#ddd'
            }
        },
        data: ['', '', '', '', '', '']
    },
    yAxis: {
        show: true,
            type: 'value',
                axisTick: {
            show: false
        },
        axisLine: {
            show: false,
                    },
        splitLine: {
            show: true,
                lineStyle: {
                color: '#ddd',
                    opacity: 0.2
            }
        },
        axisLabel: {
            textStyle: {
                fontSize: 10,
                    color: '#ddd'
            }
        }
    },
    series: [{
        name: '功率',
        type: 'line',
        // symbol: 'circle',
        // itemStyle: {
        //     emphasis: {
        //         symbol: 'circle',
        //     },
        // },
        lineStyle: {
            color: "#0092f6",
            width: 1
        },
        areaStyle: {
            color: echartsUtil.gradientColor('rgba(7,44,90,0.3)', 'rgba(0,146,246,0.9)', 0, 1, 0, 0)
        },
        symbolSize: [0, 0],
        data: [120, 132, 101, 134, 90, 230],
    }]
}