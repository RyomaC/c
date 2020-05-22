import echarts from 'echarts'
import "echarts/lib/component/graphic"

var plantCap = [{
    name: '8:00',
    value: '74辆'
}, {
    name: '12:00',
    value: '105辆'
}, {
    name: '16:00',
    value: '83辆'
}, {
    name: '20:00',
    value: '35辆'
}, {
    name: '24:00',
    value: '22辆'
}, {
    name: '4:00',
    value: '8辆'
}];

var datalist = [{
    offset: [60, 78],
    symbolSize: 54,
    opacity: .95,
    color: 'rgba(31,102,162, 1)'
},  {
    offset: [10, 43],
    symbolSize: 75,
    opacity: .84,
    color: 'rgba(135,156,236, 0.95)'
}, {
    offset: [93, 35],
    symbolSize: 63,
    opacity: .8,
    color: 'rgba(104,107,213, 0.95)'
}, {
    offset: [42, 30],
    symbolSize: 45,
    opacity: .75,
    color: 'rgba(119,83,34, 0.90)'
}, {
    offset: [64, 20],
    symbolSize: 40,
    opacity: .7,
    color: 'rgba(198,149,119, 0.90)'
}, {
    offset: [33, 85],
    symbolSize: 38,
    opacity: .68,
    color: 'rgba(236,245,107, 0.85)'
}];
var datas = [];
for (var i = 0; i < plantCap.length; i++) {
    var item = plantCap[i];
    var itemToStyle = datalist[i];
    datas.push({
        name: item.value + '\n' + item.name,
        value: itemToStyle.offset,
        symbolSize: itemToStyle.symbolSize,
        label: {
            normal: {
                textStyle: {
                    fontSize: 14,
                    color:'#fff'
                }
            }
        },
        itemStyle: {
            normal: {
                color: itemToStyle.color,
                opacity: itemToStyle.opacity
            }
        },
    })
}
export default {
        grid: {
               show: false,
               top: 10,
               bottom: 10
           },
           xAxis: [{
               gridIndex: 0,
               type: 'value',
               show: false,
               min: 0,
               max: 100,
               nameLocation: 'middle',
               nameGap: 5
           }],
           yAxis: [{
               gridIndex: 0,
               min: 0,
               show: false,
               max: 100,
               nameLocation: 'middle',
               nameGap: 30
           }],
           series: [{
               type: 'scatter',
               symbol: 'circle',
               symbolSize: 120,
               label: {
                   normal: {
                       show: true,
                       formatter: '{b}',
                       color: '#fff',
                       textStyle: {
                           fontSize: '20'
                       }
                   }
               },
               itemStyle: {
                   normal: {
                       borderWidth: '1',
                       borderType: 'solid',
                       borderColor: '#fff',
                       color: '#68b837',
                       shadowColor: '#68b837',
                       shadowBlur: 10
                   }
               },
               data: datas
           }]
}
