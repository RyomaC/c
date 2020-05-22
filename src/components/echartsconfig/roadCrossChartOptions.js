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
            fontSize: 12,
            color: '#ffff',
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
        x: 'center',
        textStyle: {
            fontSize: 12,
            color: '#fff'
        },
        data: ['岔路口', '出入口', '重点区'],
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
                color: '#fff',
            }
        },
        axisLabel: {
            textStyle: {
                fontSize: 12,
                color: '#fff'
            }
        },
        data: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
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
            color: '#fff',
                opacity: 0.2
        }
    },
    axisLabel: {
        textStyle: {
            fontSize: 12,
                color: '#fff'
        }
    }
},
series: [{
    name: '岔路口',
    type: 'line',
    symbol: 'circle',
    itemStyle: {
        emphasis: {
            symbol: 'circle',
        },
    },
    lineStyle: {
        color: "#0092f6",
        width: 1
    },
    areaStyle: {
        color: echartsUtil.gradientColor('rgba(7,44,90,0.3)', 'rgba(0,146,246,0.9)', 0, 1, 0, 0)
    },
    symbolSize: [8, 8],
    data: [120, 132, 101, 134, 90, 230],
}, {
    name: '出入口',
    type: 'line',
    symbol: 'circle',
    symbolSize: [8, 8],
    lineStyle: {
        color: "#00d4c7",
        width: 1
    },
    areaStyle: {
        color: echartsUtil.gradientColor('rgba(7,44,90,0.3)', 'rgba(0,212,199,0.9)', 0, 1, 0, 0)
    },
    data: [220, 182, 191, 234, 290, 330,]
}, {
    name: '重点区',
    type: 'line',
    symbol: 'circle',
    lineStyle: {
        color: "#aecb56",
        width: 1
    },
    areaStyle: {
        color: echartsUtil.gradientColor('rgba(7,44,90,0.3)', 'rgba(114,144,89,0.9)', 0, 1, 0, 0)
    },
    symbolSize: [8, 8],
    data: [150, 232, 201, 154, 190, 330]
}]
}