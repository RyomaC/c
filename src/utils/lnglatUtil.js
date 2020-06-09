export default{
  getLngLat (device) {
    return device.LNG && device.LAT
      ? [device.LNG, device.LAT]
      : device.Longitude && device.Latitude
        ? this.gpsTransform(device.Longitude, device.Latitude)
        : [device.lbsLongitude, device.lbsLatitude]
  }
}
