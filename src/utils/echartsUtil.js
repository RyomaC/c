export default {
    gradientColor(start, stop, x1, y1, x2, y2) {
        return {
            type: 'linear',
            x: x1 || 0,
            y: y2 || 0,
            x2: x2 || 1,
            y2: y2 || 0,
            colorStops: [{
                offset: 0,
                color: start
            }, {
                offset: 1,
                color: stop
            }],
            globalCoord: false
        }
    },
}