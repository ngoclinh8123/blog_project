function convertDate(str) {
  const date = new Date(Date.parse(str));
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default convertDate;
