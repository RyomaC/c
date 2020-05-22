export default {
    //backgroundColor:'#1B2D3B',
    color: ['#39E7FB'], //折线颜色
        tooltip: {
        trigger: 'axis',
            formatter: "{a}:{c} "
    },
    title: {
        text: '总体接入用户统计数(人)',
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
                //data: ['14', '15', '16', '17', '18', '19', '20','21','22'],
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
            ///name: '总体接入用户统计数(人)',
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
                textStyle: {
                color: "#fff",
                    fontSize: 9
            }
        }
    },
    series: [{
        name: '用户数',
        type: 'line',
        stack: '总量',
        areaStyle: {
            type: 'default',
            color: '#618C7B'
        },
        data: [1000, 230, 563, 254, 695, 375, 456,753,523] //数据个数与xAxis的data个数一致
        // data: itemData
    }
    ]
}