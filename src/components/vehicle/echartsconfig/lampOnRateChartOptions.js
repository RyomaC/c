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
        right: '3%',
        top: '20%',
        data: [],
        textStyle: {
            color: '#fff'
        },
        itemGap: 10
    },
    series: [
        {
            name: '密集区域统计',
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
                position: 'center'
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data: [
                {
                    itemStyle: {
                        normal: {
                            color: echartsUtil.gradientColor('#fd6a7d', '#ff9a6a')
                        }
                    }
                },
                {
                    itemStyle: {
                        normal: {
                            color: echartsUtil.gradientColor('#00a2ff', '#70ffac')
                        }
                    }
                },
                {
                    itemStyle: {
                        normal: {
                            color: echartsUtil.gradientColor('#96d668', '#01babc')
                        }
                    }
                },
                {
                    itemStyle: {
                        normal: {
                            color: echartsUtil.gradientColor('#1a98f8', '#7049f0')
                        }
                    }
                },
                {
                    itemStyle: {
                        normal: {
                            color: echartsUtil.gradientColor('#E3600A', '#01babc')
                        }
                    }
                },
                {
                    itemStyle: {
                        normal: {
                            color: echartsUtil.gradientColor('#8AB417', '#ECF56B')
                        }
                    }
                },
            ]
        }
    ]
}
