import { useNavigate } from "react-router-dom";
import { doctors } from "../assets/assets.js";
import DoctorCard from "./DoctorCard";

/**
 * Hiển thị 10 bác sĩ nổi bật, click card mở trang đặt lịch, nút More đi tới /doctors.
 */
const TopDoctors = () => {
  const navigate = useNavigate();
  const list = doctors.slice(0, 10);

  const handleCardClick = (id) => () => navigate(`/appointment/${id}`);
  const handleMore = () => {
    window.scrollTo(0, 0);
    navigate("/doctors");
  };

  return (
    <div className="flex flex-col items-center gap-4 md:mx-10 my-16 text-[#262626]">
      <h1 className="font-medium text-3xl">Bác sĩ nổi bật</h1>
      <p className="sm:w-1/3 text-sm text-center">
        Lựa chọn từ danh sách bác sĩ uy tín của chúng tôi.
      </p>
      <div className="gap-4 gap-y-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-3 sm:px-0 pt-5 w-full">
        {list.map((item) => (
          <DoctorCard
            doctor={item}
            key={item._id}
            onClick={handleCardClick(item._id)}
          />
        ))}
      </div>
      <button
        className="bg-[#EAEFFF] mt-10 px-12 py-3 rounded-full text-gray-600"
        onClick={handleMore}
        type="button"
      >
        Xem thêm
      </button>
    </div>
  );
};

export default TopDoctors;
