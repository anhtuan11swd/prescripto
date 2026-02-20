import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { AppContext } from "./AppContextContext";

// Configure axios defaults with retry for cold start on Render free tier
axios.defaults.timeout = 60000; // 60 seconds for server cold start

// Add retry interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Retry once on timeout for cold start
    if (error.code === "ECONNABORTED" && !originalRequest._retry) {
      originalRequest._retry = true;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  },
);

// Mảng tháng tiếng Việt để format slotDate từ backend (format: "ngày_tháng_năm")
const months = [
  "",
  "tháng 1",
  "tháng 2",
  "tháng 3",
  "tháng 4",
  "tháng 5",
  "tháng 6",
  "tháng 7",
  "tháng 8",
  "tháng 9",
  "tháng 10",
  "tháng 11",
  "tháng 12",
];

const backendURL =
  import.meta.env.VITE_BACKEND_URL?.toString() || "http://localhost:4000";

export const AppContextProvider = ({ children }) => {
  // Khởi tạo token từ localStorage để duy trì đăng nhập khi reload trang
  const [doctorsArray, setDoctorsArray] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false,
  );
  const [userData, setUserData] = useState(false);

  const currency = "₫";

  // Format tiền tệ Việt Nam (VND) để hiển thị giá bác sĩ và phí khám
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
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  // Load danh sách bác sĩ ngay khi app khởi động để hiển thị ở trang chủ
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const { data } = await axios.get(`${backendURL}/api/doctor/list`);
        if (cancelled) return;
        if (!data?.success) return;
        setDoctorsArray(Array.isArray(data.doctors) ? data.doctors : []);
      } catch {
        if (cancelled) return;
        setDoctorsArray([]);
      } finally {
        if (!cancelled) setDoctorsLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  // Theo dõi token để tự động load/clear userData và persist token
  useEffect(() => {
    let cancelled = false;

    if (token) {
      localStorage.setItem("token", token);
      const run = async () => {
        try {
          const { data } = await axios.get(
            `${backendURL}/api/user/get-profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (cancelled) return;
          if (!data?.success) return;
          setUserData(data.userData || false);
        } catch {
          if (cancelled) return;
          setUserData(false);
        }
      };

      void run();
    } else {
      localStorage.removeItem("token");
      // Dùng queueMicrotask để tránh cascading renders khi clear userData
      queueMicrotask(() => {
        if (cancelled) return;
        setUserData(false);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [token]);

  /** @returns {Promise<void>} */
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/doctor/list`);
      if (data?.success)
        setDoctorsArray(Array.isArray(data.doctors) ? data.doctors : []);
    } catch {
      setDoctorsArray([]);
    }
  };

  /** @returns {Promise<void>} */
  const loadUserProfileData = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendURL}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data?.success) setUserData(data.userData || false);
    } catch {
      setUserData(false);
    }
  };

  // Memoize expensive calculations
  const availableDoctors = useMemo(() => {
    return doctorsArray.filter((doc) => doc.available !== false);
  }, [doctorsArray]);

  // Context value - export cả doctorsArray và alias doctors để tương thích code cũ
  const value = {
    availableDoctors,
    backendURL,
    calculateAge,
    currency,
    doctors: doctorsArray, // alias để tránh thay đổi code sử dụng context cũ
    doctorsArray,
    doctorsLoading,
    formatCurrency,
    getDoctorsData,
    loadUserProfileData,
    setToken,
    setUserData,
    slotDateFormat,
    token,
    userData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContextProvider;
