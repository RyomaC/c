import echartsUtil from '@/utils/echartsUtil'

export default {
  animation: false,
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
    extraCssText: 'box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2)'
  },
  color: ['#0580f2', '#faa732', '#e1575d'],
  legend: {
    show: false
  },
  grid: {
    x: 5,
    y: 5,
    x2: 5,
    y2: 5,
    borderWidth: 1
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
        color: '#ddd'
      }
    },
    axisLabel: {
      textStyle: {
        fontSize: 3,
        color: '#ddd'
      }
    },
    data: []
  },
  yAxis: {
    offset: -20,
    show: true,
    type: 'value',
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: '#ddd',
        opacity: 0.1
      }
    },
    axisLabel: {
      textStyle: {
        fontSize: 6,
        color: '#666'
      }
    }
  },
  series: [{
    name: '',
    type: 'line',
    lineStyle: {
      color: '#0092f6',
      width: 1
    },
    areaStyle: {
      color: echartsUtil.gradientColor('rgba(7,44,90,0.3)', 'rgba(0,146,246,0.9)', 0, 1, 0, 0)
    },
    symbolSize: [0, 0],
    data: []
  }]
}
