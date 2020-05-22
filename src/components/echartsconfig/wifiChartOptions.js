export default {
    //color:['#448ACA','#b27c22','#519a25','#ae4c41','#147ecc','#5d9cec', '#62c87f', '#f15755', '#fc863f', '#7053b6','#f70000','#f700a0'],
    color: ['#c23531', '#2FACFA', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#519a25', '#b27c22', '#147ec'],
    title: {
        text: "WIFI",
        subtext: "",
        left: '4%',
        top: '6%',
        textStyle: {
            color: "#fff",
            fontSize: 60,
            fontWeight: 'bold'
        },
    },
    grid: {
        top: "20%",
        bottom: "10%"
    },

    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}:({d}%)"
    },
    series: [{
        name: '双流区',
        type: 'pie',
        selectedMode: false,
        //radius: ['30%', '40%'],
        radius: ['20%', '30%'],
        label: {
            show: false
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        data: [{
            value: 6,
            name: 'wifi用户接入数量'
        }, {
            value: 3,
            name: 'wifi用户接入数量'
        }]
    }, {
        name: 'wifi用户接入数量',
        type: 'pie',
        //radius: ['40%', '68%'],
        radius: ['30%', '58%'],
        selectedMode: false,
        label: {
            show: false
        },
        data: [{
            value: 6,
            name: '深圳一'
        }, {
            value: 3,
            name: '深圳二'
        }, {
            value: 3,
            name: '深圳三'
        }, {
            value: 5,
            name: '深圳四'
        }, {
            value: 7,
            name: '深圳五'
        }, {
            value: 4,
            name: '深圳六'
        }, {
            value: 2,
            name: '深圳七'
        }, {
            value: 3,
            name: '深圳八'
        }]
    }, {
        name: 'wifi用户接入数量',
        type: 'pie',
        //radius: ['74%', '84%'],
        radius: ['64%', '74%'],
        selectedMode: false,
        label: {
            show: false
        },
        data: [{
            value: 6,
            name: '路由一'
        }, {
            value: 2,
            name: '路由二'
        }, {
            value: 1,
            name: '路由三'
        }, {
            value: 2,
            name: '路由四'
        }, {
            value: 1,
            name: '路由五'
        }, {
            value: 1,
            name: '路由六'
        }, {
            value: 1,
            name: '路由七'
        }, {
            value: 1,
            name: '路由八'
        }, {
            value: 1,
            name: '路由九'
        }, {
            value: 1,
            name: '路由十'
        }, {
            value: 1,
            name: '路由十一'
        }, {
            value: 1,
            name: '路由十二'
        }, {
            value: 1,
            name: '路由十三'
        }, {
            value: 1,
            name: '路由十四'
        }, {
            value: 1,
            name: '路由十五'
        }, {
            value: 1,
            name: '路由十六'
        }, {
            value: 1,
            name: '路由十七'
        }, {
            value: 1,
            name: '路由十八'
        }, {
            value: 1,
            name: '路由十九'
        }, {
            value: 1,
            name: '路由二十'
        }, {
            value: 1,
            name: '路由二十一'
        }, {
            value: 1,
            name: '路由二十二'
        }, {
            value: 1,
            name: '路由二十三'
        }, {
            value: 1,
            name: '路由二十四'
        }, {
            value: 1,
            name: '路由二十五'
        }, {
            value: 1,
            name: '路由二十六'
        }]
    }]
}