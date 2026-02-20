import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  // Lấy danh sách bác sĩ khi có token
  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  return (
    <div className="flex-1 p-8 bg-[#F8F9FD] min-h-screen">
      <h1 className="mb-6 text-xl font-semibold text-gray-800">
        Tất cả bác sĩ
      </h1>

      {/* Grid hiển thị danh sách */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {doctors.map((item, index) => (
          <div
            className="overflow-hidden transition-all duration-300 bg-white border border-blue-100 cursor-pointer rounded-xl hover:-translate-y-2 hover:shadow-lg group"
            key={item._id || index}
          >
            {/* Vùng chứa ảnh với nền xanh nhạt */}
            <div className="bg-[#EAEFFF] overflow-hidden">
              <img
                alt={item.name}
                className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-105"
                src={item.image}
              />
            </div>

            {/* Thông tin bác sĩ */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-red-500"}`}
                />
                <p
                  className={`text-xs ${item.available ? "text-green-500" : "text-red-500"}`}
                >
                  {item.available ? "Còn trống lịch" : "Đầy lịch"}
                </p>
              </div>
              <h3 className="text-base font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.speciality}</p>

              {/* Checkbox "Available" */}
              <div className="flex items-center gap-2 mt-3">
                <input
                  checked={item.available}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                />
                <span className="text-xs text-gray-600">Còn trống lịch</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
