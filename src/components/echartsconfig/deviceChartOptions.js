import echartsUtil from '@/utils/echartsUtil'

export default {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        }
    },
    grid: {
        x: 5,
        y: 5,
        x2: 5,
        y2: 5,
        containLabel: true
    },
    xAxis: {
        type: 'value',
        name: '台',
        nameLocation: 'end',
        nameTextStyle: {
            color: '#8597c1',
            fontStyle: 9,
            padding: [0, 0, -26, -8]
        },
        boundaryGap: [0, 0.01],
        axisLine: {
            show: false,
            lineStyle: {
                color: '#8597c1'
            }
        },
        axisLabel: {
            show: false,
            interval: '0',
            textStyle: {
                color: '#8597c1'
            },
            rotate: 40
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: false
        }

    },
    yAxis: {
        type: 'category',
        axisLine: {
            show: false,
            lineStyle: {
                color: '#8597c1'
            },
            symbol: ['none', 'arrow'],
            symbolSize: [4, 4]

        },
        axisLabel: {
            show: true,
            fontSize: 9,
            textStyle: {
                color: '#fff'
            }
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        data: ['环境', '显示屏', '摄像头', '一键报警', 'WIFI', '基站', '集中器', '单灯控制器', '广播']
    },
    series: [
        {
            type: 'bar',
            data: [465, 359, 565, 387, 698, 498, 358, 254, 325],
            itemStyle: {
                color: echartsUtil.gradientColor('#43cea2', '#185a9d')
            },
            barWidth: '40%',
            label: {
                show: true,
                position: 'right',
                color: '#fff',
                formatter: '{c}' + '台',
            }
        }
    ]
}