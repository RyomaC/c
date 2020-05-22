export default{
  getCurrentTime() {
    let date_time = new Date()
    return formatTime(date_time)
  },
  formatTime(date_time, show_date=1, show_weekday = 0) {
    let show_day = new Array('星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日')
    let year = date_time.getFullYear()
    if (year < 10) {
      year = "0" + year
    }
    let month = date_time.getMonth() + 1
    if (month < 10) {
      month = "0" + month
    }
    let day = date_time.getDate()
    if (day < 10) {
      day = "0" + day
    }
    let hours = date_time.getHours()
    if (hours < 10) {
      hours = "0" + hours
    }
    let minutes = date_time.getMinutes()
    if (minutes < 10) {
      minutes = "0" + minutes
    }
    let seconds = date_time.getSeconds()
    if (seconds < 10) {
      seconds = "0" + seconds
    }
    return year + '年' + month + '月' + day + '日' + ' ' + show_day[date_time.getDay() - 1] + ' ' + hours + ':' + minutes + ':' + seconds
  }
}