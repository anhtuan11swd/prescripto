import { createContext } from "react";

const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = "₫";

  // Format số tiền theo định dạng VND
  const formatCurrency = (amount) => {
    const numericAmount = typeof amount === "string" ? Number(amount) : amount;
    if (!Number.isFinite(numericAmount)) return `${amount ?? 0}${currency}`;
    return new Intl.NumberFormat("vi-VN", {
      currency: "VND",
      maximumFractionDigits: 0,
      style: "currency",
    }).format(numericAmount);
  };

  // Tính tuổi xấp xỉ từ ngày sinh để hiển thị trong profile user
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    return today.getFullYear() - birthDate.getFullYear();
  };

  // Chuyển format slotDate backend ("ngày_tháng_năm") sang hiển thị tiếng Việt
  const months = [
    "",
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const value = {
    calculateAge,
    currency,
    formatCurrency,
    slotDateFormat,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export { AppContext };
export default AppContextProvider;
