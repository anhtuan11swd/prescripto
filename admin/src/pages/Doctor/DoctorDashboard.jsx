import { useContext, useEffect } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { DoctorContext } from "../../context/DoctorContext";

// Hàm format tiền theo kiểu Việt Nam
const formatCurrencyVN = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken, getDashData]);

  return (
    dashData && (
      <div className="m-5">
        {/* Stats Cards */}
        <div className="flex flex-wrap gap-3">
          {/* Earnings */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img alt="" className="w-14" src={assets.earning_icon} />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {formatCurrencyVN(dashData.earnings)} {currency}
              </p>
              <p className="text-gray-400">Thu nhập</p>
            </div>
          </div>

          {/* Appointments */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img alt="" className="w-14" src={assets.appointments_icon} />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Cuộc hẹn</p>
            </div>
          </div>

          {/* Patients */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img alt="" className="w-14" src={assets.patients_icon} />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Bệnh nhân</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img alt="" src={assets.list_icon} />
            <p className="font-semibold">Đặt lịch gần đây</p>
          </div>

          <div className="pt-4 border border-t-0">
            {dashData.latestAppointments.map((item) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={item._id}
              >
                <img
                  alt=""
                  className="rounded-full w-10"
                  src={item.userData.image}
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.userData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Đã hủy</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Hoàn thành
                  </p>
                ) : (
                  <div className="flex">
                    <button
                      className="w-10 cursor-pointer"
                      onClick={() => cancelAppointment(item._id)}
                      type="button"
                    >
                      <img alt="Hủy cuộc hẹn" src={assets.cancel_icon} />
                    </button>
                    <button
                      className="w-10 cursor-pointer"
                      onClick={() => completeAppointment(item._id)}
                      type="button"
                    >
                      <img alt="Hoàn thành cuộc hẹn" src={assets.tick_icon} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
