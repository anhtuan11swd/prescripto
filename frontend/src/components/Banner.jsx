import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/login");
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  return (
    <div className="flex bg-primary md:mx-10 my-20 px-6 sm:px-10 md:px-14 lg:px-12 rounded-lg">
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
        <div className="font-semibold text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl">
          <p>Đặt lịch hẹn</p>
          <p className="mt-4">Với hơn 100 bác sĩ uy tín</p>
        </div>
        <button
          className="bg-white mt-6 px-8 py-3 rounded-full text-[#595959] text-sm sm:text-base hover:scale-105 transition-all"
          onClick={handleCreateAccount}
          type="button"
        >
          Tạo tài khoản
        </button>
      </div>

      <div className="hidden md:block relative md:w-1/2 lg:w-[370px]">
        <img
          alt="Doctor appointment illustration"
          className="right-0 bottom-0 absolute w-full max-w-md"
          src={assets.appointment_img}
        />
      </div>
    </div>
  );
};

export default Banner;
