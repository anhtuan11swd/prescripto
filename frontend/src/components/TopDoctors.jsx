import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContextContext";
import DoctorCard from "./DoctorCard";
import DoctorCardSkeleton from "./DoctorCardSkeleton";

/**
 * Hiển thị 10 bác sĩ nổi bật, click card mở trang đặt lịch, nút More đi tới /doctors.
 */
const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors, doctorsLoading } = useContext(AppContext);
  const list = (doctors || []).slice(0, 10);

  const handleCardClick = (id) => () => navigate(`/appointment/${id}`);
  const handleMore = () => {
    window.scrollTo(0, 0);
    navigate("/doctors");
  };

  if (!list.length) return null;

  return (
    <div className="flex flex-col items-center gap-4 md:mx-10 my-16 text-[#262626]">
      <h1 className="font-medium text-3xl">Bác sĩ nổi bật</h1>
      <p className="sm:w-1/3 text-sm text-center">
        Lựa chọn từ danh sách bác sĩ uy tín của chúng tôi.
      </p>
      <div className="gap-4 gap-y-6 grid grid-cols-auto px-3 sm:px-0 pt-5 w-full">
        {doctorsLoading
          ? // Hiển thị 8 skeleton cards khi đang loading
            [
              <DoctorCardSkeleton key="skeleton-1" />,
              <DoctorCardSkeleton key="skeleton-2" />,
              <DoctorCardSkeleton key="skeleton-3" />,
              <DoctorCardSkeleton key="skeleton-4" />,
              <DoctorCardSkeleton key="skeleton-5" />,
              <DoctorCardSkeleton key="skeleton-6" />,
              <DoctorCardSkeleton key="skeleton-7" />,
              <DoctorCardSkeleton key="skeleton-8" />,
            ]
          : list.map((item) => (
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
