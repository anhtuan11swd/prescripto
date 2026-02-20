import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

const DEFAULT_ADMIN_EMAIL = "admin@prescripto.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";

const envAdminEmail = import.meta.env.VITE_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
const envAdminPassword =
  import.meta.env.VITE_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;

const Login = () => {
  const [state, setState] = useState("Quản trị viên");
  const [email, setEmail] = useState(envAdminEmail);
  const [password, setPassword] = useState(envAdminPassword);

  const navigate = useNavigate();
  const { aToken, setAToken, backendUrl } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  useEffect(() => {
    if (aToken || dToken) navigate("/", { replace: true });
  }, [aToken, dToken, navigate]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Quản trị viên") {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          navigate("/", { replace: true });
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          navigate("/", { replace: true });
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Đăng nhập
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            value={email}
          />
        </div>

        <div className="w-full">
          <p>Mật khẩu</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            value={password}
          />
        </div>

        <button
          className="bg-primary text-white w-full py-2 rounded-md text-base"
          type="submit"
        >
          Đăng nhập
        </button>

        {state === "Quản trị viên" ? (
          <p>
            Đăng nhập bác sĩ?{" "}
            <button
              className="text-primary underline cursor-pointer bg-transparent border-0 p-0 font-inherit"
              onClick={() => setState("Bác sĩ")}
              type="button"
            >
              Nhấn vào đây
            </button>
          </p>
        ) : (
          <p>
            Đăng nhập quản trị viên?{" "}
            <button
              className="text-primary underline cursor-pointer bg-transparent border-0 p-0 font-inherit"
              onClick={() => setState("Quản trị viên")}
              type="button"
            >
              Nhấn vào đây
            </button>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
