import echartsUtil from '@/utils/echartsUtil'

export default {
    title: {
        text: '',
        textStyle: {
            color: "#fff"
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/><br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        right: '0%',
        top: '20%',
        data: ['未开灯', '少于40%', '小于80%', '大于80%'],
        textStyle: {
            color: '#fff',
        },
        itemGap: 10
    },
    series: [
        {
            name: '开灯占比',
            type: 'pie',
            radius: ['70%', '90%'],
            avoidLabelOverlap: false,
            selectedMode: 'single',
            selectedOffset: 30,
            center: ['30%', '50%'],
            label: {
                show: false,
                fontWeight: 'bold',
                color: '#fff',
                position: 'center',
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data: [
                {
                    value: 523, name: '未开灯',
                    itemStyle: {
                        normal: {
                            color: echartsUtil.gradientColor('#fd6a7d', '#ff9a6a')
                        }
                    }
                },
                {
                    value: 1023, name: '少于40%',
                    itemStyle: {
                        normal: {
                            color: echartsUtil.gradientColor('#00a2ff', '#70ffac')
                        }
                    }
                },
                {
                    value: 1021, name: '少于80%',
                    itemStyle: {
                        normal: {
                            color: echartsUtil.gradientColor('#96d668', '#01babc')
                        }
                    }
                },
                {
                    value: 568, name: '大于80%',
                    itemStyle: {
                        normal: {
                            color: echartsUtil.gradientColor('#1a98f8', '#7049f0')
                        }
                    }
                },
            ]
        }
    ]
}