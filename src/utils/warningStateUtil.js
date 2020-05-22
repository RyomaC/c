export default {
    WARNING_STATE: {
        1: '电参异常',
        2: '离线',
        3: '断缆',
        4: '灯杆倒塌',
        5: '灯杆碰撞',
        6: '漏电保护',
        7: '温度异常'
    },
    stringify(num) {
        if (!num) return ''
        if (num == 0) return ''
        const warningStateArray = ['电参异常', '离线', '断缆', '灯杆倒塌', '灯杆碰撞', '漏电保护', '温度异常']
        let result = []
        const string2 = num.toString(2).split('').reverse().join('')
        for (let i in string2){
            if (string2[i] == '1') {
                result.push(warningStateArray[i])
            }
        }
        return result
    }
}