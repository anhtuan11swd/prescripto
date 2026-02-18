export const getVietnameseWeekdayLabel = (date) => {
  if (!(date instanceof Date)) return "";

  const weekdayLabels = [
    "Chủ nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];

  return weekdayLabels[date.getDay()] ?? "";
};

export const getVietnameseTimeLabel = (date) => {
  if (!(date instanceof Date)) return "";

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
