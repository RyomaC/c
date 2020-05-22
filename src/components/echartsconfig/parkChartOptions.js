import echartsUtil from '@/utils/echartsUtil'

export default {
    title: {
        text: '停车',
        textStyle: {
            fontSize: 20,
            color: '#fff'
        },
        top: '6%',
        left: '4%'
    },
    grid: {
        top: "30%",
        bottom: "10%"
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
            label: {
                show: true
            }
        }
    },
    legend: {
        data: ["使用率", "使用数量"],
        top: "10%",
        textStyle: {
            color: "#ffffff",
            fontSize: 12
        }
    },
    xAxis: {
        data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
        axisLine: {
            show: false //隐藏X轴轴线
        },
        axisTick: {
            show: false //隐藏X轴刻度
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: "#fff", //X轴文字颜色
                fontSize: 12
            }
        }
    },
    yAxis: [{
        type: "value",
        //name: "个",
        nameTextStyle: {
            color: "#ebf8ac"
        },
        splitLine: {
            show: false
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: "#fff",
                fontSize: 12
            }
        }
    },
    {
        type: "value",
        //name: "使用率",
        nameTextStyle: {
            color: "#ebf8ac"
        },
        position: "right",
        splitLine: {
            show: false
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisLabel: {
            show: true,
            formatter: "{value} %", //右侧Y轴文字显示
            textStyle: {
                color: "#fff",
                fontSize: 12
            }
        }
    },
    {
        type: "value",
        gridIndex: 0,
        min: 50,
        max: 100,
        splitNumber: 8,
        splitLine: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ["rgba(250,250,250,0.0)", "rgba(250,250,250,0.05)"]
            }
        }
    }
    ],
    series: [{
        name: "使用率",
        type: "line",
        yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
        smooth: true, //平滑曲线显示
        showAllSymbol: true, //显示所有图形。
        symbol: "circle", //标记的图形为实心圆
        symbolSize: 5, //标记的大小
        itemStyle: {
            //折线拐点标志的样式
            color: "#058cff"
        },
        lineStyle: {
            color: "#058cff"
        },
        areaStyle: {
            color: "rgba(5,140,255, 0.2)"
        },
        data: [45.5, 48.2, 73.5, 65.8, 58.9, 48.9, 78.6, 58.6, 56.8, 86.2, 62.4, 52.3,65.3,45.8,58.7,23.6,69.8,54.7,25.6,38.0,69.8,45.7,89.6,35.6]
        // data: useRate
    },
    {
        name: "使用数量",
        type: "bar",
        barWidth: 8,
        itemStyle: {
            normal: {
                color: echartsUtil.gradientColor('#00fcae', '#006388')
            }
        },
        data: [458, 482, 735, 658, 589, 489, 786, 586, 568, 862, 624, 523,653,458,587,236,698,547,256,380,698,457,896,356]
        // data: inUse
    }
    ]
}