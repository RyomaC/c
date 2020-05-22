import echartsUtil from '@/utils/echartsUtil'

export default {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        x: 0,
        y: 10,
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

 





        data: ['重庆东进世美肯电子材料有限公司', '住化电子材料科技（重庆）有限公司', '液化空气（重庆）有限公司', '长春市城市环卫事业发展有限公司', '合肥鸿威公路建设有限公司', '重庆莱宝科技有限公司', '北大医药重庆大新药业股份有限公司', '重庆超贵半导体有限公司', '重庆京东方光电科技有限公司']
    },
    series: [
        {
            type: 'bar',
            data: [465, 359, 565, 387, 608, 498, 358, 254, 325],
            itemStyle: {
                color: echartsUtil.gradientColor('#43cea2', '#185a9d')
            },
            barWidth: '40%',
            label: {
                show: true,
                position: 'right',
                color: '#fff',
                formatter: '{c}' + '辆',
            }
        }
    ]
}
