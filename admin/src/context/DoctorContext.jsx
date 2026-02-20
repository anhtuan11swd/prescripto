import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { DoctorContext } from "./DoctorContext.context";

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

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : "",
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // Lấy dữ liệu dashboard của bác sĩ
  const getDashData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    // backendUrl is a constant from env, no need to include in deps
  }, [dToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lấy dữ liệu hồ sơ của bác sĩ
  const getProfileData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    // backendUrl is a constant from env, no need to include in deps
  }, [dToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lấy danh sách tất cả lịch hẹn của bác sĩ
  const getAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        {
          headers: { Authorization: `Bearer ${dToken}` },
        },
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    // backendUrl is a constant from env, no need to include in deps
  }, [dToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hoàn thành lịch hẹn
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } },
      );
      if (data.success) {
        toast.success(data.message);
        getDashData();
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Hủy lịch hẹn
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } },
      );
      if (data.success) {
        toast.success(data.message);
        getDashData();
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    appointments,
    backendUrl,
    cancelAppointment,
    completeAppointment,
    dashData,
    dToken,
    getAppointments,
    getDashData,
    getProfileData,
    profileData,
    setAppointments,
    setDashData,
    setDToken,
    setProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export { DoctorContext };
export default DoctorContextProvider;
