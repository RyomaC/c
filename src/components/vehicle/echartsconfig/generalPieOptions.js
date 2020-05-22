export default {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: '80%',
      center: ['50%', '50%'],
      data: [
      ],
      // roseType: 'radius',
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      top: 5,
      bottom: 5,
      startAngle: 180
    }
  ]
}
