import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doctors, specialityData } from "../assets/assets";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);

  const filteredDoctors = speciality
    ? doctors.filter((doc) => doc.speciality === speciality)
    : doctors;

  return (
    <div>
      <p className="text-gray-600">
        Duyệt qua danh sách các bác sĩ chuyên khoa.
      </p>
      <div className="flex sm:flex-row flex-col items-start gap-5 mt-5">
        {/* Nút Filter cho mobile */}
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "bg-primary text-white" : ""}`}
          onClick={() => setShowFilter((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setShowFilter((prev) => !prev);
            }
          }}
          type="button"
        >
          Bộ lọc
        </button>

        {/* Sidebar filters */}
        <div
          className={`flex-col gap-4 text-sm text-gray-600 shrink-0 ${showFilter ? "flex" : "hidden"} sm:flex sm:w-64`}
        >
          {specialityData.map((item) => (
            <button
              className={`w-[94vw] sm:w-full pl-3 py-1.5 pr-3 border border-gray-300 rounded transition-all cursor-pointer text-left whitespace-nowrap ${
                speciality === item.speciality ? "bg-indigo-100 text-black" : ""
              }`}
              key={item.speciality}
              onClick={() =>
                speciality === item.speciality
                  ? navigate("/doctors")
                  : navigate(`/doctors/${item.speciality}`)
              }
              type="button"
            >
              {item.speciality}
            </button>
          ))}
        </div>

        {/* Grid doctors */}
        <div className="gap-4 gap-y-6 grid grid-cols-auto w-full">
          {filteredDoctors.map((item) => (
            <div
              className="border border-[#C9D8FF] rounded-xl overflow-hidden transition-all hover:translate-y-[-10px] duration-500 cursor-pointer"
              key={item._id}
            >
              <img alt="" className="bg-[#EAEFFF]" src={item.image} />
              <div className="p-4">
                <div className="flex items-center gap-2 text-green-500 text-sm text-center">
                  <p className="bg-green-500 rounded-full w-2 h-2" />
                  <p>Còn trống lịch</p>
                </div>
                <p className="font-medium text-[#262626] text-lg">
                  {item.name}
                </p>
                <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
