import echartsUtil from '@/utils/echartsUtil'

export default {
    title: {
        text: '信息发布',
        textStyle: {
            fontSize: 20,
            color: '#fff'
        },
        top: '6%',
        left: '4%'
    },
    grid: {
        top: "30%",
        bottom: "15%"
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
            label: {
                show: true
            }
        },
        padding: 10,
    },
    legend: {
        data: ["广告数量"],
        top: "10%",
        textStyle: {
            color: "#ffffff",
            fontSize: 12
        },
    },
    xAxis: {
        type: 'category',
        data: ['KFC广告',
            '项目通用广告',
            '文明建设广告',
            'NIKE广告',
            '阿迪达斯广告'
        ],
        // data: xData,
        axisLine: {
            show: true,
            lineStyle: {
                color: "#063374",
                width: 1,
                type: "solid"
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: "#fff",
                fontSize: 9,
            },
            rotate: 30,
        },
    },
    yAxis: [{
        type: 'value',
        axisLabel: {
            textStyle: {
                color: '#fff',
                fontSize: 12
            }
        },
        axisLine: {
            show: false,
            lineStyle: {
                color: "#00c7ff",
                width: 1,
                type: "solid"
            },
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: false,
            lineStyle: {
                color: "#063374",
            }
        }
    }],
    series: [{
        name: '广告数量',
        type: 'pictorialBar',
        data: [5910, 2411, 2630, 4836, 3650],
        // data: itemData,
        symbol: 'path://M0, 0, L50, 0, L25, -100',
        //barWidth: 50, //柱子宽度
        //barGap: 1, //柱子之间间距
        itemStyle: {
            normal: {
                color: echartsUtil.gradientColor('#00fcae', '#006388'),
                // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //     offset: 0,
                //     color: '#00fcae'
                // }, {
                //     offset: 1,
                //     color: '#006388'
                // }]),
                opacity: 1,
            }
        }
    },]
}