import { createContext } from "react";

const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = "₫";

  // Format tiền tệ Việt Nam (VND)
  const formatCurrency = (amount) => {
    const numericAmount = typeof amount === "string" ? Number(amount) : amount;
    if (!Number.isFinite(numericAmount)) return `${amount ?? 0}${currency}`;
    return new Intl.NumberFormat("vi-VN", {
      currency: "VND",
      maximumFractionDigits: 0,
      style: "currency",
    }).format(numericAmount);
  };

  const value = {
    currency,
    formatCurrency,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export { AppContext };
export default AppContextProvider;
