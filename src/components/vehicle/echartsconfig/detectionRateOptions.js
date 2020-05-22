import echarts from 'echarts/lib/echarts'
import "echarts/lib/component/graphic"

export default {
        title: {
            text: '危化品车检出率',
            textStyle: {
                fontSize: 16,
                color: '#fff'
            },
            top: '2%',
            left: '1%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        },
        legend: {
            icon: 'diamond',
            itemGap: 13,
            data: ['检出率'],
            top:'3%',
            left: 'center',
            textStyle: {
                fontSize: 12,
                color: '#F1F1F3'
            }
        },
        grid: {
            bottom:'10%'
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            axisLabel: {
                 color: '#e2e9ff'
             },
            data:  ['2018-11','2018-12','2019-1','2019-2','2019-3','2019-4','2019-5','2019-6','2019-7','2019-8','2019-9','2019-10']
        }],
        yAxis: [{
            type: 'value',
            color: '#57617B',
            min:0,
            max:100,
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            axisLabel: {
                margin: 10,
                formatter: '{value} %',
                textStyle: {
                    color: "rgba(255,255,255,.6)",
                    fontSize: '12'
                }
            },
            splitLine: {
                lineStyle: {
                    color: "rgba(255,255,255,0.1)"
                }
            }
        }],
        series: [{
            name: '检出率',
            type: 'line',
            smooth: true,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            itemStyle: {
                normal: {
                    color:'#00A1EA'
                }
            },
            data: [5,12,12,10,9,23,33,11,17,45,10,8]
        }  ]

}
