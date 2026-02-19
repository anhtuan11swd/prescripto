import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { specialityData } from "../assets/assets";
import DoctorCard from "../components/DoctorCard";
import { AppContext } from "../context/AppContextContext";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);

  const allDoctors = doctors || [];

  const filteredDoctors = speciality
    ? allDoctors.filter((doc) => doc.speciality === speciality)
    : allDoctors;

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
            <DoctorCard
              doctor={item}
              key={item._id}
              onClick={() => navigate(`/appointment/${item._id}`)}
            />
          ))}
          {!filteredDoctors.length && (
            <p className="col-span-full py-4 text-center text-gray-500 text-sm">
              Hiện chưa có bác sĩ nào phù hợp bộ lọc.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
