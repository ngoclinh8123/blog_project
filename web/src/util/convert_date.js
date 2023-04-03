function convertDate(str) {
  const date = new Date(Date.parse(str));
  const year = date.getFullYear();
  let month = date.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
  month = month.toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default convertDate;
