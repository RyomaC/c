import lnglatUtil from '@/utils/lnglatUtil'
import styleUtil from '@/utils/styleUtil'
import axios from 'axios'
import _ from 'underscore'

export default {
  loadMarkers (amap, deviceList, project, indexedDeviceList, lightConnected, lightMarkersData, EventBus) {
    axios
      .post('/v_device_lamp/list', {where: {PROJECT: project.title}, size: 2000})
      .then(response => {
        deviceList = deviceList.concat(response.data.data.data)
        indexedDeviceList = _.indexBy(deviceList, 'UUID')
        EventBus.$emit('getindexedDeviceList', indexedDeviceList)
        lightConnected = _.filter(deviceList, {TYPE: 2, STATE: 1}).length
        showMarkers(amap, deviceList, EventBus)
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
            lightMarkersData.push(data)
          }
        }
      })
    axios
      .post('/v_device_ebox/list', {where: {PROJECT: project.title}, size: 2000})
      .then(response => {
        deviceList = deviceList.concat(response.data.data.data)
        showMarkers(amap, deviceList, EventBus)
      })
    axios
      .post('/v_device_wiresafe/list', {where: {PROJECT: project.title}, size: 2000})
      .then(response => {
        deviceList = deviceList.concat(response.data.data.data)
        showMarkers(amap, deviceList, EventBus)
      })
  }
}

function showMarkers (amap, deviceList, EventBus) {
  EventBus.$emit('fetchStatsData', deviceList)
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
  var lightMarkersData = []
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
        type: deviceList[i].TYPE,
        style: styleUtil.getStyle(deviceList[i])
      }
      if (deviceList[i].TYPE === 2) {
        lightMarkersData.push(data)
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
  EventBus.$emit('getlightMarkersData', lightMarkersData)
  EventBus.$emit('getmassMarkersData', massMarkersData)

  let indexedMassMarkersData = _.indexBy(massMarkersData, 'uuid')
  EventBus.$emit('getindexedMassMarkersData', indexedMassMarkersData)
  massMarks.setData(massMarkersData)
  massMarks.setMap(amap)
  EventBus.$emit('getmassMarks', massMarks)
  massMarks.on('click', massMarks => EventBus.$emit('onMassMarksClick', massMarks))
  massMarks.on('mouseover', massMarks => EventBus.$emit('onMassMarksMouseOver', massMarks))
  massMarks.on('mouseout', massMarks => EventBus.$emit('onMassMarksMouseOut', massMarks))
}
