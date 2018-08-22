export default function format(time = new Date(), format = 'yyyy-MM-dd HH') {
  const args = {
    "M+": time.getMonth() + 1,
    "d+": time.getDate(),
    "h+": time.getHours(),
    "m+": time.getMinutes(),
    "s+": time.getSeconds(),
    "q+": Math.floor((time.getMonth() + 3) / 3), //quarter
    "S": time.getMilliseconds()
  }
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length))
  for (let i in args) {
    let n = args[i]
    if (new RegExp("(" + i + ")").test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length))
  }
  return format
}
