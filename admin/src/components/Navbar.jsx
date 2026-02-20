import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <img
          alt="Prescripto"
          className="h-8 w-auto cursor-pointer"
          src={assets.admin_logo}
        />
        <span className="px-3 py-0.5 ml-2 text-xs font-medium text-gray-600 border border-gray-300 rounded-full">
          {aToken ? "Quản trị viên" : "Bác sĩ"}
        </span>
      </div>

      <button
        className="px-6 py-2 text-sm font-medium text-white transition-colors bg-blue-500 hover:bg-blue-600 rounded-full"
        onClick={logout}
        type="button"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Navbar;
