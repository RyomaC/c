import echarts from 'echarts/lib/echarts'
import "echarts/lib/component/graphic"

export default {
    title:{
            "text": "九类危化品运输统计",
            x: 'center',
            textStyle:{
              color: '#fff',
              fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
        },
        grid: {
            left: '2%',
            right: '5%',
            bottom: '3%',
            top: '30%',
            containLabel: true
        },
         xAxis: [{
                  type: 'category',
                  data: ['1', '2', '3', '4', '5', '6', '7', '8','9'],
                  axisLine: {
                      lineStyle: {
                        color: 'rgba(255,255,255,0.12)'
                     }
                },
                axisLabel: {
                     margin: 10,
                     interval:0,
                     color: '#e2e9ff',
                     textStyle: {
                         fontSize: 12
                     }
                 }
             }],
             yAxis: [{
                 axisLabel: {
                     formatter: '{value}',
                     color: '#e2e9ff'
                 },
                 axisLine: {
                     show: false
                 },
                 splitLine: {
                     lineStyle: {
                         color: 'rgba(255,255,255,0.12)'
                     }
                 }
             }],
             series: [{
                 type: 'bar',
                 barWidth: '10px',
                 data: [13, 25, 29, 38, 44, 50, 52, 60, 72],
                 itemStyle: {
                     normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                           offset: 0,
                                           color: 'rgba(0,244,255,1)' // 0% 处的颜色
                                       }, {
                                           offset: 1,
                                           color: 'rgba(0,77,167,1)' // 100% 处的颜色
                                       }], false),
                         barBorderRadius: [30, 30, 30, 30],
                         shadowColor: 'rgba(0,160,221,1)',
                         shadowBlur: 4
                     }
                 },
                 label: {
                     normal: {
                         show: true,
                         lineHeight: 30,
                         width: 50,
                         height: 30,
                         backgroundColor: 'rgba(0,160,221,0.1)',
                         borderRadius: 200,
                         position: ['-13', '-60'],
                         distance: 1,
                         formatter: [
                             '    {d|●}',
                             ' {a|{c}}     \n',
                             '    {b|}'
                         ].join(' '),
                         rich: {
                             d: {
                                 color: '#3CDDCF'
                             },
                             a: {
                                 color: '#fff',
                                 align: 'center'
                             },
                             b: {
                                 width: 1,
                                 height: 30,
                                 borderWidth: 1,
                                 borderColor: '#234e6c',
                                 align: 'left'
                             }
                         }
                     }
                 }

             }]
}
