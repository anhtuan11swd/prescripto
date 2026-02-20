import { useContext, useEffect } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, formatCurrency } =
    useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken, getAllAppointments]);

  return (
    <div className="flex-1 p-8 bg-[#F8F9FD] min-h-screen">
      <h1 className="mb-6 text-xl font-semibold text-gray-800">
        Tất cả lịch hẹn
      </h1>

      {/* Container bảng dữ liệu */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
        {/* Header của bảng */}
        <div className="hidden md:grid grid-cols-[0.5fr_2fr_2fr_1fr_3fr_2fr_1fr_0.5fr] items-center px-6 py-4 border-b border-gray-200 bg-white text-sm font-medium text-gray-600">
          <p>#</p>
          <p>Bệnh nhân</p>
          <p>Khoa</p>
          <p>Tuổi</p>
          <p>Ngày & Giờ</p>
          <p>Bác sĩ</p>
          <p>Phí</p>
          <p className="text-center">Hành động</p>
        </div>

        {/* Nội dung danh sách */}
        <div className="flex flex-col">
          {appointments.map((item, index) => (
            <div
              className="grid grid-cols-1 md:grid-cols-[0.5fr_2fr_2fr_1fr_3fr_2fr_1fr_0.5fr] items-center px-6 py-4 border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors text-sm text-gray-700"
              key={item._id}
            >
              {/* STT */}
              <p className="hidden md:block">{index + 1}</p>

              {/* Bệnh nhân */}
              <div className="flex items-center gap-3">
                <img
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                  src={item.userData.image}
                />
                <span className="font-medium">{item.userData.name}</span>
              </div>

              {/* Khoa */}
              <p className="hidden md:block">{item.docData.speciality}</p>

              {/* Tuổi */}
              <p className="hidden md:block">
                {calculateAge(item.userData.dob)}
              </p>

              {/* Ngày & Giờ */}
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>

              {/* Bác sĩ */}
              <div className="flex items-center gap-3">
                <img
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                  src={item.docData.image}
                />
                <span>{item.docData.name}</span>
              </div>

              {/* Phí */}
              <p className="font-medium">{formatCurrency(item.amount)}</p>

              {/* Nút hủy */}
              <div className="flex justify-center">
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Đã hủy</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Hoàn thành
                  </p>
                ) : (
                  <button
                    className="flex items-center justify-center w-8 h-8 text-red-500 transition-colors bg-red-50 rounded-full hover:bg-red-100"
                    onClick={() => cancelAppointment(item._id)}
                    type="button"
                  >
                    <img
                      alt="Cancel"
                      className="w-4 h-4"
                      src={assets.cancel_icon}
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;
