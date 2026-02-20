import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

// Style cho link menu - thay đổi khi active
const linkClass = ({ isActive }) =>
  `flex items-center gap-3 py-3 px-6 text-sm font-medium transition-colors ${
    isActive
      ? "text-primary bg-[#F2F3FF] border-r-4 border-primary"
      : "text-gray-600 hover:bg-gray-50"
  }`;

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="w-64 min-h-[calc(100vh-73px)] bg-white border-r border-gray-200 py-6">
      {aToken && (
        <ul className="flex flex-col gap-1">
          <li>
            <NavLink className={linkClass} to="/">
              <img alt="" className="w-5 h-5" src={assets.home_icon} />
              <span className="hidden md:inline">Tổng quan</span>
            </NavLink>
          </li>
          <li>
            <NavLink className={linkClass} to="/all-appointments">
              <img alt="" className="w-5 h-5" src={assets.appointment_icon} />
              <span className="hidden md:inline">Lịch hẹn</span>
            </NavLink>
          </li>
          <li>
            <NavLink className={linkClass} to="/add-doctor">
              <img alt="" className="w-5 h-5" src={assets.add_icon} />
              <span className="hidden md:inline">Thêm bác sĩ</span>
            </NavLink>
          </li>
          <li>
            <NavLink className={linkClass} to="/doctor-list">
              <img alt="" className="w-5 h-5" src={assets.people_icon} />
              <span className="hidden md:inline">Danh sách bác sĩ</span>
            </NavLink>
          </li>
        </ul>
      )}

      {dToken && (
        <ul className="flex flex-col gap-1">
          <li>
            <NavLink className={linkClass} to="/doctor-dashboard">
              <img alt="" className="w-5 h-5" src={assets.home_icon} />
              <span className="hidden md:inline">Tổng quan</span>
            </NavLink>
          </li>
          <li>
            <NavLink className={linkClass} to="/doctor-appointments">
              <img alt="" className="w-5 h-5" src={assets.appointment_icon} />
              <span className="hidden md:inline">Lịch hẹn</span>
            </NavLink>
          </li>
          <li>
            <NavLink className={linkClass} to="/doctor-profile">
              <img alt="" className="w-5 h-5" src={assets.people_icon} />
              <span className="hidden md:inline">Hồ sơ</span>
            </NavLink>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
