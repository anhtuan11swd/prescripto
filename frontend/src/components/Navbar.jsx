import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContextContext";

/**
 * Navbar hiển thị logo, menu, nút đăng nhập và dropdown profile.
 */
const Navbar = () => {
  const { token, setToken, userData } = useContext(AppContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const handleLogout = () => {
    // Đăng xuất: clear token qua AppContext và điều hướng về trang chủ
    setToken("");
    setIsProfileOpen(false);
    toast.success("Đăng xuất thành công");
    navigate("/");
  };

  const menuItems = [
    { label: "Trang chủ", to: "/" },
    { label: "Tất cả bác sĩ", to: "/doctors" },
    { label: "Giới thiệu", to: "/about" },
    { label: "Liên hệ", to: "/contact" },
  ];

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]">
      {/* Logo */}
      <button
        className="p-0 border-none bg-transparent cursor-pointer"
        onClick={() => navigate("/")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") navigate("/");
        }}
        type="button"
      >
        <img alt="Logo Prescripto" className="w-44" src={assets.logo} />
      </button>

      {/* Desktop menu */}
      <ul className="md:flex items-start gap-5 font-medium hidden">
        {menuItems.map((item) => (
          <NavLink
            className={({ isActive }) => (isActive ? "active" : "")}
            key={item.to}
            to={item.to}
          >
            <li className="py-1">{item.label}</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
        ))}
        <a
          className="border px-5 text-xs py-1.5 rounded-full"
          href="https://prescripto-admin.vercel.app/"
          rel="noreferrer"
          target="_blank"
        >
          Bảng điều khiển Admin
        </a>
      </ul>

      {/* Actions + mobile menu button */}
      <div className="flex items-center gap-4">
        {/* Khi chưa đăng nhập: nút Create account */}
        {!token && (
          <button
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
            onClick={handleCreateAccount}
            type="button"
          >
            Tạo tài khoản
          </button>
        )}

        {/* Khi đã đăng nhập: avatar + dropdown */}
        {token && (
          <div className="relative hidden md:block">
            <button
              className="flex items-center gap-2"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              type="button"
            >
              <img
                alt="Ảnh hồ sơ"
                className="w-9 h-9 rounded-full object-cover cursor-pointer"
                src={userData?.image || assets.profile_pic}
              />
              <span className="text-sm font-medium max-w-[140px] truncate">
                {userData?.name || "Tài khoản"}
              </span>
              <img
                alt="Mở menu hồ sơ"
                className="w-3"
                src={assets.dropdown_icon}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 rounded-2xl border bg-white shadow-lg text-sm z-30">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/my-profile");
                  }}
                  type="button"
                >
                  Hồ sơ của tôi
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/my-appointments");
                  }}
                  type="button"
                >
                  Lịch hẹn của tôi
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={handleLogout}
                  type="button"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile menu icon */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
          type="button"
        >
          <img alt="Mở menu" className="w-6" src={assets.menu_icon} />
        </button>
      </div>

      {/* Mobile overlay menu */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 z-20 bg-white transition-all duration-300 ${
          isMobileMenuOpen ? "w-full h-full" : "w-0 h-0 overflow-hidden"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6 border-b border-gray-200">
          <img alt="Logo Prescripto" className="w-36" src={assets.logo} />
          <button onClick={() => setIsMobileMenuOpen(false)} type="button">
            <img alt="Đóng menu" className="w-7" src={assets.cross_icon} />
          </button>
        </div>

        <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
          {menuItems.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              key={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              to={item.to}
            >
              <p className="px-4 py-2 rounded-full inline-block">
                {item.label}
              </p>
            </NavLink>
          ))}
        </ul>

        <div className="mt-6 px-5 flex flex-col items-center gap-3">
          {!token && (
            <button
              className="bg-primary text-white px-8 py-3 rounded-full font-light w-full max-w-xs"
              onClick={handleCreateAccount}
              type="button"
            >
              Tạo tài khoản
            </button>
          )}

          {token && (
            <div className="w-full max-w-xs space-y-2 text-sm">
              <button
                className="w-full text-left px-4 py-2 rounded-full border border-gray-200"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/my-profile");
                }}
                type="button"
              >
                Hồ sơ của tôi
              </button>
              <button
                className="w-full text-left px-4 py-2 rounded-full border border-gray-200"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/my-appointments");
                }}
                type="button"
              >
                Lịch hẹn của tôi
              </button>
              <button
                className="w-full text-left px-4 py-2 rounded-full border border-red-200 text-red-600"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                type="button"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
