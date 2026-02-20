import { useContext, useEffect } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

// Danh sách tháng tiếng Việt
const MONTHS = [
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

// Chuyển đổi format ngày từ "ngày_tháng_năm" sang dạng hiển thị
const slotDateFormat = (slotDate) => {
  if (!slotDate) return "";
  const dateArray = String(slotDate).split("_");
  if (dateArray.length !== 3) return slotDate;
  return `${dateArray[0]} ${MONTHS[Number(dateArray[1])]} ${dateArray[2]}`;
};

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);
  const { formatCurrency } = useContext(AppContext);

  // Lấy dữ liệu dashboard khi có token
  useEffect(() => {
    if (aToken) getDashData();
  }, [aToken, getDashData]);

  if (!dashData) return null;

  const stats = [
    {
      count: formatCurrency(dashData.earnings ?? 0),
      icon: assets.earning_icon,
      title: "Doanh thu",
    },
    { count: dashData.doctors ?? 0, icon: assets.doctor_icon, title: "Bác sĩ" },
    {
      count: dashData.appointments ?? 0,
      icon: assets.appointments_icon,
      title: "Cuộc hẹn",
    },
    {
      count: dashData.patients ?? 0,
      icon: assets.patients_icon,
      title: "Bệnh nhân",
    },
  ];

  const list = dashData.latestAppointments ?? [];

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="flex flex-wrap gap-6 mb-8">
        {stats.map((stat) => (
          <div
            className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl min-w-[220px] hover:shadow-md transition-shadow"
            key={stat.title}
          >
            <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-full">
              <img alt="" className="w-7 h-7" src={stat.icon} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
          <img alt="" className="w-5 h-5" src={assets.list_icon} />
          <h2 className="text-base font-semibold text-gray-800">
            Cuộc hẹn gần đây
          </h2>
        </div>
        <div className="flex flex-col">
          {list.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 text-sm">
              Chưa có cuộc hẹn
            </div>
          ) : (
            list.map((item, idx) => (
              <div
                className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors"
                key={item._id ?? idx}
              >
                <div className="flex items-center gap-4">
                  <img
                    alt={item.docData?.name}
                    className="object-cover w-12 h-12 rounded-full"
                    src={item.docData?.image}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.docData?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                </div>
                {item.cancelled ? (
                  <span className="text-red-500 text-xs font-medium">
                    Đã hủy
                  </span>
                ) : item.isCompleted ? (
                  <span className="text-green-500 text-xs font-medium">
                    Hoàn thành
                  </span>
                ) : (
                  <button
                    aria-label="Hủy cuộc hẹn"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    onClick={() => cancelAppointment(item._id)}
                    type="button"
                  >
                    <img alt="" className="w-4 h-4" src={assets.cancel_icon} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
