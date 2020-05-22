export default {
    title: {
        text: '环境',
        textStyle: {
            fontSize: 12,
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
            type: "line",
            label: {
                show: true
            }
        },
        padding: 20,
    },
    legend: {
        show: true,
        data: ["温度", "PM2.5","噪音"],
        selectedMode:'single',
        top: "10%",
        textStyle: {
            color: "#ffffff",
            fontSize: 12
        },
    },
    textStyle: {
        fontSize: '14',
        fontWeight: 'normal',
        color: '#ffffff'
    },
    xAxis: {
        show: true,
        type: 'category',
        boundaryGap: true,
        axisLine: {
            lineStyle: {
                color: 'rgba(53,153,196,0.6)',
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#fbc52c',
            fontSize: 12,
            padding: [0, 5, 0, 0]
        },
        interval: 2,
        data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00',],
    },
    yAxis: {
        name: '单位：db',
        nameTextStyle: {
            color: '#fbc52c',
            fontSize: 12,
            padding: [0, 40, 10, 0]
        },
        show: true,
        type: 'value',
        axisLine: {
            lineStyle: {
                color: 'rgba(53,153,196,0.6)',
            }
        },
        axisLabel: {
            color: '#fbc52c',
            fontSize: 12,
            padding: [0, 5, 0, 0]
        },
        splitLine: {
            show: false,
            lineStyle: {
                type: 'dotted',
                color: 'rgba(251, 197, 44, 0.3)',
            }
        }
    },
    series: [{
        name: '温度',
        type: 'line',
        smooth: false,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 20,
        lineStyle: {
            normal: {
                color: '#00f0ff',
                width: 3,
            }
        },
        itemStyle: {
            normal: {
                color: "#fbc52c",
                borderColor: 'rgba(0, 240, 255, 0.2)', //rgba(255, 199, 43, .3)
                borderWidth: 10,
                shadowColor: '#00f0ff',
                shadowBlur: 15,
            }
        },
        data: [18, 19, 19, 20, 22,24,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,32,28,27,24,22,20,19,18],
        // data: temp,
        markLine: {
            silent: true,
            lineStyle: {
                width: 2
            },
            data: [{
                yAxis: 15,
                label: {
                    fontSize: 12
                },
            }, {
                yAxis: 25,
                label: {
                    fontSize: 12
                }
            }, {
                yAxis: 30,
                label: {
                    fontSize: 12
                }
            }]
        }
        },
        {
            name: 'PM2.5',
            type: 'line',
            smooth: false,
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 20,
            lineStyle: {
                normal: {
                    color: '#00f0ff',
                    width: 3,
                }
            },
            itemStyle: {
                normal: {
                    color: "#fbc52c",
                    borderColor: 'rgba(0, 240, 255, 0.2)', //rgba(255, 199, 43, .3)
                    borderWidth: 10,
                    shadowColor: '#00f0ff',
                    shadowBlur: 30,
                }
            },
            data: [74, 165, 125, 85, 154,132,83,65,102,96,75,136,146,143,100,168,78,69,85,46,148,88,89,106],
            // data: pm25,
            markLine: {
                silent: true,
                lineStyle: {
                    width: 2
                },
                data: [{
                    yAxis: 50,
                    label: {
                        fontSize: 25
                    },
                }, {
                    yAxis: 100,
                    label: {
                        fontSize: 25
                    }
                }, {
                    yAxis: 150,
                    label: {
                        fontSize: 25
                    }
                },]
            }
        },
         {
        name: '噪音',
        type: 'line',
        smooth: false,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 20,
        lineStyle: {
            normal: {
                color: '#00f0ff',
                width: 3,
            }
        },
        itemStyle: {
            normal: {
                color: "#fbc52c",
                borderColor: 'rgba(0, 240, 255, 0.2)', //rgba(255, 199, 43, .3)
                borderWidth: 10,
                shadowColor: '#00f0ff',
                shadowBlur: 30,
            }
        },
        data: [74, 25.2, 58.6, 28.6, 36.8,65,68,58.9,54,26,29,46,35.8,36,28.9,33.7,62,38.2,68,46.2,36,32,26,31],
        // data: noice,
        markLine: {
            silent: true,
            lineStyle: {
                width: 2
            },
            data: [{
                yAxis: 30,
                label: {
                    fontSize: 12
                },
            }, {
                yAxis: 55,
                label: {
                    fontSize: 12
                }
            }, {
                yAxis: 65,
                label: {
                    fontSize: 12
                }
            },]
        }
    }]
}