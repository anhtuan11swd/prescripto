import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContextContext";

/**
 * Trang Login/Sign Up.
 */
const Login = () => {
  const navigate = useNavigate();
  const { backendURL, token, setToken } = useContext(AppContext);

  const [state, setState] = useState("Login"); // 'Sign Up' | 'Login'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendURL}/api/user/register`, {
          email,
          name,
          password,
        });

        if (data?.success) {
          toast.success("Đăng ký thành công, vui lòng đăng nhập");
          setState("Login");
          setPassword("");
        } else {
          toast.error(data?.message || "Đăng ký thất bại");
        }
      } else {
        const { data } = await axios.post(`${backendURL}/api/user/login`, {
          email,
          password,
        });

        if (data?.success && data?.token) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Đăng nhập thành công");
        } else {
          toast.error(data?.message || "Đăng nhập thất bại");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const isLogin = state === "Login";

  return (
    <form className="flex items-center min-h-[80vh]" onSubmit={onSubmitHandler}>
      <div className="flex flex-col items-start gap-3 shadow-lg m-auto p-8 border rounded-xl min-w-[340px] sm:min-w-96 text-[#5E5E5E] text-sm">
        <p className="font-semibold text-2xl">
          {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
        </p>
        <p>
          {isLogin
            ? "Vui lòng đăng nhập để đặt lịch khám"
            : "Vui lòng đăng ký để đặt lịch khám"}
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>Họ và tên</p>
            <input
              className="mt-1 p-2 border border-[#DADADA] rounded w-full"
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên"
              required
              type="text"
              value={name}
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="mt-1 p-2 border border-[#DADADA] rounded w-full"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
            type="email"
            value={email}
          />
        </div>

        <div className="w-full">
          <p>Mật khẩu</p>
          <input
            className="mt-1 p-2 border border-[#DADADA] rounded w-full"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
            type="password"
            value={password}
          />
        </div>

        <button
          className="bg-primary my-2 py-2 rounded-md w-full text-white text-base"
          type="submit"
        >
          {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
        </button>

        {isLogin ? (
          <p>
            Chưa có tài khoản?{" "}
            <button
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Sign Up")}
              type="button"
            >
              Đăng ký ngay
            </button>
          </p>
        ) : (
          <p>
            Đã có tài khoản?{" "}
            <button
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Login")}
              type="button"
            >
              Đăng nhập ngay
            </button>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
