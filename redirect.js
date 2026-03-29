// 自动跳转 HTTPS
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.href = 'https://' + location.hostname + location.pathname + location.search;
}