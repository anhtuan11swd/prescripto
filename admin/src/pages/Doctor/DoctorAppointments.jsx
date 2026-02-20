import { Check, X } from "lucide-react";
import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken, getAppointments]);

  return (
    <div className="flex-1 p-8 bg-[#F8F9FD] min-h-screen">
      <h1 className="mb-6 text-xl font-semibold text-gray-800">
        Tất cả lịch hẹn
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Header Bảng */}
        <div className="hidden md:grid grid-cols-[0.5fr_3fr_1fr_3fr_1.5fr] items-center px-6 py-4 border-b border-gray-200 bg-white text-sm font-medium text-gray-600">
          <p>#</p>
          <p>Bệnh nhân</p>
          <p>Tuổi</p>
          <p>Ngày & Giờ</p>
          <p className="text-center">Hành động</p>
        </div>

        {/* Nội dung danh sách */}
        <div className="flex flex-col">
          {appointments.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <p>Không có lịch hẹn nào</p>
            </div>
          ) : (
            appointments.map((item, index) => (
              <div
                className="grid grid-cols-1 md:grid-cols-[0.5fr_3fr_1fr_3fr_1.5fr] items-center px-6 py-4 border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors text-sm text-gray-700"
                key={item._id}
              >
                <p className="hidden md:block">{index + 1}</p>

                <div className="flex items-center gap-3">
                  <img
                    alt={item.userData?.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    src={item.userData?.image}
                  />
                  <span className="font-semibold text-gray-800">
                    {item.userData?.name}
                  </span>
                </div>

                <p className="hidden md:block">
                  {item.userData?.dob ? calculateAge(item.userData.dob) : "N/A"}
                </p>
                <p className="text-gray-600">
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>

                <div className="flex items-center justify-center gap-2">
                  {item.cancelled ? (
                    <span className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">
                      Đã hủy
                    </span>
                  ) : item.isCompleted ? (
                    <span className="text-xs font-medium text-green-500 bg-green-50 px-3 py-1 rounded-full">
                      Hoàn thành
                    </span>
                  ) : (
                    <div className="flex gap-3">
                      {/* Nút Hủy */}
                      <button
                        className="flex items-center justify-center w-9 h-9 text-red-500 transition-all bg-red-50 rounded-full hover:bg-red-500 hover:text-white"
                        onClick={() => cancelAppointment(item._id)}
                        title="Hủy lịch hẹn"
                        type="button"
                      >
                        <X size={18} />
                      </button>
                      {/* Nút Hoàn thành */}
                      <button
                        className="flex items-center justify-center w-9 h-9 text-green-500 transition-all bg-green-50 rounded-full hover:bg-green-500 hover:text-white"
                        onClick={() => completeAppointment(item._id)}
                        title="Đánh dấu hoàn thành"
                        type="button"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
