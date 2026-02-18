import { Link } from "react-router-dom";
import { specialityData } from "../assets/assets.js";

const scrollToTop = () => window.scrollTo(0, 0);

const SpecialityMenu = () => {
  return (
    <div
      className="flex flex-col items-center gap-4 py-16 text-[#262626]"
      id="speciality"
    >
      <h1 className="font-medium text-3xl">Tìm kiếm theo chuyên khoa</h1>
      <p className="sm:w-1/3 text-sm text-center">
        Khám phá danh sách bác sĩ chuyên nghiệp và đặt lịch khám dễ dàng.
      </p>
      <div className="[&::-webkit-scrollbar]:hidden flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
        {specialityData.map((item) => (
          <Link
            className="flex flex-col flex-shrink-0 items-center text-xs transition-all hover:-translate-y-[10px] duration-500 cursor-pointer"
            key={item.speciality}
            onClick={scrollToTop}
            to={`/doctors/${encodeURIComponent(item.speciality)}`}
          >
            <img
              alt={item.speciality}
              className="mb-2 w-16 sm:w-24"
              src={item.image}
            />
            <p>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
