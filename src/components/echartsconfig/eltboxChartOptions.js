export default {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    // legend: {
    //     // data: ['额定能耗', '实际能耗'],
    //     data: ['实际能耗'],
    //     selectedMode:'single',
    //     textStyle: {
    //         color: '#3bdafe',
    //         fontSize: 12
    //     },
    //     top: 0
    // },
    grid: {
        left: 30,
        right: 30,
        top: 30,
        bottom: 10,
        containLabel: true
    },
    xAxis:
    {
        type: 'category',
        boundaryGap: false,
        data: ['1.1', '4.1', '7.1', '10.1', '13.1', '16.1', '19.1', '22.1', '25.1', '28.1', '31.1'],
        // data: this.eltboxOptions.xAxisData,
        axisLabel: {
            textStyle: {
                color: "#fff",
                fontSize: 10
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                opacity: 0.05
            }
        }
    },
    yAxis:
    {
        type: 'value',
        axisLabel: {
            textStyle: {
                color: "#fff",
                fontSize: 10
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                opacity: 0.05
            }
        }
    },
    series: [
        {
            name: '实际能耗',
            type: 'line',
            stack: '总量',
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 6,
            itemStyle: {
                color: "#6053a1"
            },
            lineStyle: {
                color: "#28ffb3"
            },
            areaStyle: { normal: { color: '#404262' } },
            areaStyle: { //区域填充样式
                normal: {
                    // color: this.gradientColor('rgba(0,154,120,1)','rgba(0,0,0, 0)',0,1,0,1),
                    shadowColor: 'rgba(53,142,215, 0.9)',
                    shadowBlur: 20
                }
            },
            data:[51, 54, 53, 56, 55, 58, 59,63,61,64,66]
            // data:ratec
        },
        // {
        //     name: '实际能耗',
        //     smooth: true,
        //     type: 'bar',
        //     stack: '总量',
        //     barWidth: '10%',
        //     itemStyle: {
        //         color: "#04a3f5",
        //     },
        //     lineStyle: {
        //         color: "#04a3f5"
        //     },
        //     data:[25, 28, 26, 28, 30, 29, 38,36,35,34,39]
        //     // data:actec
        // }
    ]
}