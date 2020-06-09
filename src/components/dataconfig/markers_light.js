import lnglatUtil from '@/utils/lnglatUtil'
import styleUtil from '@/utils/styleUtil'

export default {
  loadMarkers (amap, deviceList) {
    const iconSize = 26
    const style = [
      '/static/images/light_on.png',
      '/static/images/light_off.png',
      '/static/images/light_warning.png',
      '/static/images/ebox.png',
      '/static/images/light_offline.png',
      '/static/images/light_selected.png',
      '/static/images/light_on_l.png',
      '/static/images/light_on_m.png',
      '/static/images/wiresafe.png',
      '/static/images/wiresafe_red.png'
    ].map(url => {
      return {
        url: url,
        anchor: new AMap.Pixel(5, 5),
        size: new AMap.Size(iconSize, iconSize)
      }
    })
    var massMarkersData = []
    var massMarks = null
    for (let i = 0; i < deviceList.length; i++) {
      if ((deviceList[i].LNG && deviceList[i].LAT) ||
          (deviceList[i].Longitude && deviceList[i].Latitude) ||
          (deviceList[i].lbsLongitude && deviceList[i].lbsLatitude)
      ) {
        let data = {
          lnglat: lnglatUtil.getLngLat(deviceList[i]),
          name: deviceList[i].NAME,
          id: i,
          uuid: deviceList[i].UUID,
          style: styleUtil.getStyle(deviceList[i])
        }
        massMarkersData.push(data)
      }
    }
    if (!massMarks) {
      massMarks = new AMap.MassMarks(massMarkersData, {
        zIndex: 100,
        style: style
      })
    }
    massMarks.setData(massMarkersData)
    massMarks.setMap(amap)
    // massMarks.on('click', onMassMarksClick)
    // massMarks.on('mouseover', onMassMarksMouseOver)
    // massMarks.on('mouseout', onMassMarksMouseOut)
  }
}
