export default {
    //backgroundColor:'#1B2D3B',
    color: ['#39E7FB'], //折线颜色
    tooltip: {
        trigger: 'axis',
        formatter: "{a}:{c} "
    },
    title: {
        text: '总体在线率(%)',
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
        type: 'category',
        boundaryGap: false,
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        splitLine: {
            show: false,
        },
        axisLine: {
            lineStyle: {
                color: 'white'
            }
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: "#fff",
                fontSize: 9
            }
        }
    },
    //与x轴类似
    yAxis: {
        type: 'value',
        // name: '总体在线率(%)',
        nameTextStyle: {
            fontSize: 9
        },
        splitLine: {
            show: false,
        },
        axisLine: {
            lineStyle: {
                color: 'white'
            }
        },
        axisLabel: {
            show: true,
            formatter: "{value} %", //右侧Y轴文字显示
            textStyle: {
                color: "#fff",
                fontSize: 9
            }
        }
    },
    series: [{
        name: '在线率',
        type: 'line',
        stack: '总量',
        areaStyle: {
            type: 'default',
            color: '#2A97DA'
        },
        data: [53, 56, 85, 64, 35, 57, 22,65,39] //数据个数与xAxis的data个数一致
        // data: itemData
    }
    ]
}