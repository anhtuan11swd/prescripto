import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AddDoctor = () => {
  // State quản lý form input
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 năm");
  const [fee, setFee] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("Bác sĩ đa khoa");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [errors, setErrors] = useState({});

  const { backendUrl, aToken, getAllDoctors } = useContext(AdminContext);
  const { formatCurrency } = useContext(AppContext);

  // Hàm validate từng trường input
  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          error = "Tên bác sĩ không được để trống";
        } else if (value.trim().length < 2) {
          error = "Tên bác sĩ phải có ít nhất 2 ký tự";
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value.trim())) {
          error = "Tên bác sĩ chỉ được chứa chữ cái và khoảng trắng";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email không được để trống";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Email không hợp lệ";
        }
        break;

      case "password":
        if (!value) {
          error = "Mật khẩu không được để trống";
        } else if (value.length < 8) {
          error = "Mật khẩu phải có ít nhất 8 ký tự";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số";
        }
        break;

      case "fee":
        if (!value) {
          error = "Phí khám không được để trống";
        } else if (Number.isNaN(Number(value)) || Number(value) <= 0) {
          error = "Phí khám phải là số dương";
        } else if (Number(value) < 50000) {
          error = `Phí khám tối thiểu là ${formatCurrency(50000)}`;
        } else if (Number(value) > 5000000) {
          error = `Phí khám tối đa là ${formatCurrency(5000000)}`;
        }
        break;

      case "degree":
        if (!value.trim()) {
          error = "Học vấn không được để trống";
        } else if (value.trim().length < 3) {
          error = "Học vấn phải có ít nhất 3 ký tự";
        }
        break;

      case "address1":
        if (!value.trim()) {
          error = "Địa chỉ dòng 1 không được để trống";
        } else if (value.trim().length < 5) {
          error = "Địa chỉ phải có ít nhất 5 ký tự";
        }
        break;

      case "address2":
        if (!value.trim()) {
          error = "Địa chỉ dòng 2 không được để trống";
        } else if (value.trim().length < 5) {
          error = "Địa chỉ phải có ít nhất 5 ký tự";
        }
        break;

      case "about":
        if (!value.trim()) {
          error = "Giới thiệu không được để trống";
        } else if (value.trim().length < 20) {
          error = "Giới thiệu phải có ít nhất 20 ký tự";
        } else if (value.trim().length > 500) {
          error = "Giới thiệu không được quá 500 ký tự";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate toàn bộ form trước khi submit
  const validateForm = () => {
    const newErrors = {};

    // Validate từng field
    newErrors.name = validateField("name", name);
    newErrors.email = validateField("email", email);
    newErrors.password = validateField("password", password);
    newErrors.fee = validateField("fee", fee);
    newErrors.degree = validateField("degree", degree);
    newErrors.address1 = validateField("address1", address1);
    newErrors.address2 = validateField("address2", address2);
    newErrors.about = validateField("about", about);

    // Xóa các error rỗng
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý validation khi blur khỏi input
  const handleFieldValidation = (fieldName, value) => {
    const error = validateField(fieldName, value);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  // Xử lý submit form - gửi dữ liệu lên server
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Chưa chọn hình ảnh");
      }

      // Validate toàn bộ form
      if (!validateForm()) {
        return toast.error("Vui lòng kiểm tra lại thông tin nhập vào");
      }

      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fee", Number(fee));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 }),
      );

      // console log formdata
      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        { headers: { Authorization: `Bearer ${aToken}` } },
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("1 năm");
        setFee("");
        setAbout("");
        setSpeciality("Bác sĩ đa khoa");
        setDegree("");
        setAddress1("");
        setAddress2("");
        setErrors({}); // Reset validation errors
        getAllDoctors(); // Refresh danh sách doctors
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form
      autoComplete="off"
      className="flex-1 bg-[#F8F9FD] p-8 min-h-screen"
      onSubmit={onSubmitHandler}
    >
      {/* Tiêu đề trang */}
      <h1 className="mb-6 font-semibold text-gray-800 text-xl">Thêm Bác Sĩ</h1>

      {/* Card Form */}
      <div className="bg-white p-8 border border-gray-200 rounded-xl max-w-4xl">
        {/* Phần Upload Ảnh */}
        <div className="flex items-center gap-4 mb-8">
          <label
            className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 rounded-full w-20 h-20 transition-colors cursor-pointer"
            htmlFor="doc-img"
          >
            <img
              alt="Bác sĩ"
              className="rounded-full w-16 h-16 object-cover"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
            />
            <input
              hidden
              id="doc-img"
              onChange={(e) => setDocImg(e.target.files[0])}
              type="file"
            />
          </label>
          <div className="text-gray-500 text-sm cursor-pointer">
            <p>Tải lên ảnh</p>
            <p>bác sĩ</p>
          </div>
        </div>

        {/* Lưới nhập liệu 2 cột */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {/* Cột trái */}
          <div className="flex flex-col gap-4">
            <div>
              <label
                className="block mb-2 text-gray-600 text-sm"
                htmlFor="name"
              >
                Tên bác sĩ
              </label>
              <input
                autoComplete="off"
                className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                id="name"
                onBlur={(e) => handleFieldValidation("name", e.target.value)}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A (chỉ chữ cái và khoảng trắng)"
                required
                type="text"
                value={name}
              />
              {errors.name && (
                <p className="mt-1 text-red-600 text-xs">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                className="block mb-2 text-gray-600 text-sm"
                htmlFor="email"
              >
                Email bác sĩ
              </label>
              <input
                autoComplete="off"
                className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                id="email"
                onBlur={(e) => handleFieldValidation("email", e.target.value)}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ví dụ: doctor@example.com"
                required
                type="email"
                value={email}
              />
              {errors.email && (
                <p className="mt-1 text-red-600 text-xs">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                className="block mb-2 text-gray-600 text-sm"
                htmlFor="password"
              >
                Mật khẩu bác sĩ
              </label>
              <input
                autoComplete="new-password"
                className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                id="password"
                onBlur={(e) =>
                  handleFieldValidation("password", e.target.value)
                }
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự, chứa chữ hoa, thường và số"
                required
                type="password"
                value={password}
              />
              {errors.password && (
                <p className="mt-1 text-red-600 text-xs">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                className="block mb-2 text-gray-600 text-sm"
                htmlFor="experience"
              >
                Kinh nghiệm
              </label>
              <select
                className="px-4 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full text-gray-500 text-sm appearance-none"
                id="experience"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              >
                <option value="1 năm">1 năm</option>
                <option value="2 năm">2 năm</option>
                <option value="3 năm">3 năm</option>
                <option value="4 năm">4 năm</option>
                <option value="5 năm">5 năm</option>
                <option value="6 năm">6 năm</option>
                <option value="7 năm">7 năm</option>
                <option value="8 năm">8 năm</option>
                <option value="9 năm">9 năm</option>
                <option value="10 năm">10 năm</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-600 text-sm" htmlFor="fee">
                Phí khám
              </label>
              <input
                autoComplete="off"
                className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                  errors.fee
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                id="fee"
                max="5000000"
                min="50000"
                onBlur={(e) => handleFieldValidation("fee", e.target.value)}
                onChange={(e) => setFee(e.target.value)}
                placeholder={`Ví dụ: 200000 (${formatCurrency(50000)} - ${formatCurrency(5000000)})`}
                required
                type="number"
                value={fee}
              />
              <p className="mt-1 text-gray-500 text-xs">
                Nhập số tiền bằng VND (không bao gồm ký hiệu tiền tệ)
              </p>
              {fee && !errors.fee && (
                <p className="mt-1 text-green-600 text-xs">
                  {formatCurrency(Number(fee))}
                </p>
              )}
              {errors.fee && (
                <p className="mt-1 text-red-600 text-xs">{errors.fee}</p>
              )}
            </div>
          </div>

          {/* Cột phải */}
          <div className="flex flex-col gap-4">
            <div>
              <label
                className="block mb-2 text-gray-600 text-sm"
                htmlFor="speciality"
              >
                Chuyên khoa
              </label>
              <select
                className="px-4 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full text-gray-500 text-sm appearance-none"
                id="speciality"
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
              >
                <option value="Bác sĩ đa khoa">Bác sĩ đa khoa</option>
                <option value="Bác sĩ phụ khoa">Bác sĩ phụ khoa</option>
                <option value="Bác sĩ da liễu">Bác sĩ da liễu</option>
                <option value="Bác sĩ nhi">Bác sĩ nhi</option>
                <option value="Bác sĩ thần kinh">Bác sĩ thần kinh</option>
                <option value="Bác sĩ tiêu hóa">Bác sĩ tiêu hóa</option>
              </select>
            </div>

            <div>
              <label
                className="block mb-2 text-gray-600 text-sm"
                htmlFor="degree"
              >
                Học vấn
              </label>
              <input
                autoComplete="off"
                className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                  errors.degree
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                id="degree"
                onBlur={(e) => handleFieldValidation("degree", e.target.value)}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="Ví dụ: Bác sĩ đa khoa, Đại học Y Hà Nội"
                required
                type="text"
                value={degree}
              />
              {errors.degree && (
                <p className="mt-1 text-red-600 text-xs">{errors.degree}</p>
              )}
            </div>

            <div>
              <label
                className="block mb-2 text-gray-600 text-sm"
                htmlFor="address1"
              >
                Địa chỉ
              </label>
              <div className="flex flex-col gap-3">
                <input
                  autoComplete="off"
                  className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                    errors.address1
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  id="address1"
                  onBlur={(e) =>
                    handleFieldValidation("address1", e.target.value)
                  }
                  onChange={(e) => setAddress1(e.target.value)}
                  placeholder="Ví dụ: 123 Đường ABC, Phường XYZ"
                  required
                  type="text"
                  value={address1}
                />
                {errors.address1 && (
                  <p className="mt-1 text-red-600 text-xs">{errors.address1}</p>
                )}
                <input
                  autoComplete="off"
                  className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                    errors.address2
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  id="address2"
                  onBlur={(e) =>
                    handleFieldValidation("address2", e.target.value)
                  }
                  onChange={(e) => setAddress2(e.target.value)}
                  placeholder="Ví dụ: Quận 1, TP.HCM"
                  required
                  type="text"
                  value={address2}
                />
                {errors.address2 && (
                  <p className="mt-1 text-red-600 text-xs">{errors.address2}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Phần About me (Full width) */}
        <div className="mt-6">
          <label className="block mb-2 text-gray-600 text-sm" htmlFor="about">
            Giới thiệu
          </label>
          <textarea
            autoComplete="off"
            className={`w-full h-32 px-4 py-3 text-sm border rounded-md resize-none focus:outline-none focus:ring-1 ${
              errors.about
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
            id="about"
            onBlur={(e) => handleFieldValidation("about", e.target.value)}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Hãy viết về kinh nghiệm, chuyên môn và điểm mạnh của bác sĩ (20-500 ký tự)"
            required
            rows={5}
            value={about}
          />
          <div className="flex justify-between mt-1">
            {errors.about && (
              <p className="text-red-600 text-xs">{errors.about}</p>
            )}
            <p
              className={`text-xs ml-auto ${about.length > 500 ? "text-red-600" : "text-gray-500"}`}
            >
              {about.length}/500 ký tự
            </p>
          </div>
        </div>

        {/* Nút Submit */}
        <button
          className="bg-blue-500 hover:bg-blue-600 mt-8 px-10 py-3 rounded-full font-medium text-white text-sm transition-colors"
          type="submit"
        >
          Thêm bác sĩ
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
