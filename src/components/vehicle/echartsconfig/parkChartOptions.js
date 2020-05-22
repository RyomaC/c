import echartsUtil from '@/utils/echartsUtil'

export default {
    title: {
        text: '危化品车通勤时间',
        textStyle: {
            fontSize: 16,
            color: '#fff'
        },
        top: '2%',
        left: '1%'
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
        data: ["使用数量"],
        top: "10%",
        textStyle: {
            color: "#ffffff",
            fontSize: 12
        }
    },
    xAxis: {
        data: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
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
    series: [
      {
        name: "危化品车数量",
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
