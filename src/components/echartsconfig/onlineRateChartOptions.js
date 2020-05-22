import echartsUtil from '@/utils/echartsUtil'

export default {
    tooltip: {
        formatter: "{a} <br/>{b} : {c}%"
    },
    series: [
        {
            name: '电缆状态',
            type: 'gauge',
            radius: '100%',
            center: ['30%', '50%'],
            detail: {
                formatter: '{value}%',
                fontSize: 9,
            },
            title: {
                fontSize: 9,
                color: "#fff"
            },
            splitLine: {
                length: 12
            },
            axisLabel: {
                color: "#fff",
                fontSize: 9
            },
            data: [{ value: 99.80, name: '在线率' }]
        }
    ]
}