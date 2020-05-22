import echartsUtil from '@/utils/echartsUtil'

var arr = []
for (var i = -10; i < 0; i++) {
  arr.push(GetDateStr(i))
}
function GetDateStr (AddDayCount) {
  var dd = new Date()
  dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1 // 获取当前月份的日期
  var d = dd.getDate()
  return m + '-' + d
}

export default {
  grid: [{
    top: '30%',
    bottom: '10%',
    right: '50%',
    left: '3%',
    containLabel: true
  }, {
    top: '30%',
    bottom: '10%',
    right: '1%',
    left: '55%',
    containLabel: true
  }],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      label: {
        show: true
      }
    },
    padding: 20
  },
  textStyle: {
    fontSize: '14',
    fontWeight: 'normal',
    color: '#ffffff'
  },
  xAxis: [{
    type: 'category',
    boundaryGap: true,
    axisLine: {
      lineStyle: {
        color: 'rgba(53,153,196,0.6)'
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
    data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],

    gridIndex: 0
  },
  {
    data: arr,
    axisLine: {
      lineStyle: {
        color: '#0177d4'
      }
    },
    axisLabel: {
      color: '#fff',
      fontSize: 14
    },
    gridIndex: 1
  }],
  yAxis: [{
    nameTextStyle: {
      color: '#fbc52c',
      fontSize: 12,
      padding: [0, 40, 10, 0]
    },
    show: true,
    type: 'value',
    axisLine: {
      lineStyle: {
        color: 'rgba(53,153,196,0.6)'
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
        color: 'rgba(251, 197, 44, 0.3)'
      }
    },
    gridIndex: 0
  },
  {
    name: '（人）',
    nameTextStyle: {
      color: '#fff',
      fontSize: 16
    },
    axisLine: {
      lineStyle: {
        color: '#0177d4'
      }
    },
    axisLabel: {
      color: '#fff',
      fontSize: 16
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: '#0177d4'
      }
    },
    interval: 500,
    max: 5000,
    gridIndex: 1
  }],
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
        width: 3
      }
    },
    itemStyle: {
      normal: {
        color: '#fbc52c',
        borderColor: 'rgba(0, 240, 255, 0.2)',
        borderWidth: 10,
        shadowColor: '#00f0ff',
        shadowBlur: 15
      }
    },
    data: [18, 19, 19, 20, 22, 24, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 32, 28, 27, 24, 22, 20, 19, 18],
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
        }
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
    },
    xAxisIndex: 0,
    yAxisIndex: 0

  },
  {
    type: 'bar',
    barWidth: 18,
    itemStyle: {
      normal: {
        color: echartsUtil.gradientColor('#00b0ff', '#7052f4')
      }
    },
    data: [254, 3254, 1654, 2454, 4757, 2011, 1211, 2222, 4521, 3467],
    xAxisIndex: 1,
    yAxisIndex: 1
  }
  ]
}
