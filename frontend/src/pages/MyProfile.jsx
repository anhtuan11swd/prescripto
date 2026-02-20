import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContextContext";

const MyProfile = () => {
  const { backendURL, token, userData, loadUserProfileData } =
    useContext(AppContext);

  const normalizeDob = (value) => {
    if (!value || typeof value !== "string") return "";
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const isoLike = trimmed.match(/^(\d{4}-\d{2}-\d{2})T/);
    return isoLike?.[1] || "";
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: {
      line1: "",
      line2: "",
    },
    dob: "",
    gender: "Chưa chọn",
    name: "",
    phone: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  const displayImage = useMemo(
    () => imagePreview || userData?.image || assets.profile_pic,
    [imagePreview, userData?.image],
  );

  useEffect(() => {
    if (!token) return;
    void loadUserProfileData();
  }, [token, loadUserProfileData]);

  const handleStartEdit = () => {
    if (!userData) return;
    setFormData({
      address: {
        line1: userData.address?.line1 || "",
        line2: userData.address?.line2 || "",
      },
      dob: normalizeDob(userData.dob),
      gender: userData.gender || "Chưa chọn",
      name: userData.name || "",
      phone: userData.phone || "",
    });
    setImagePreview(userData.image || "");
    setImageFile(null);
    setErrors({});
    setIsEditing(true);
  };

  const handleBasicChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    // Sử dụng spread operator cho object address lồng trong formData
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng file
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)",
      }));
      return;
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Kích thước ảnh không được vượt quá 5MB",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // Xem trước ảnh trước khi gửi lên server
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Tên không được để trống";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Tên phải có ít nhất 2 ký tự";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Tên không được vượt quá 50 ký tự";
    }

    // Validate phone
    if (formData.phone.trim()) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
      }
    }

    // Validate date of birth
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();

      if (dobDate > today) {
        newErrors.dob = "Ngày sinh không được là ngày trong tương lai";
      } else if (age > 150) {
        newErrors.dob = "Ngày sinh không hợp lệ";
      } else if (age < 0) {
        newErrors.dob = "Ngày sinh không hợp lệ";
      }
    }

    // Validate address
    if (formData.address.line1.trim().length > 100) {
      newErrors.addressLine1 = "Địa chỉ dòng 1 không được vượt quá 100 ký tự";
    }
    if (formData.address.line2.trim().length > 100) {
      newErrors.addressLine2 = "Địa chỉ dòng 2 không được vượt quá 100 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) return;

    // Kiểm tra form trước khi gửi
    if (!validateForm()) {
      return;
    }

    const body = new FormData();
    body.append("name", formData.name);
    body.append("phone", formData.phone);
    body.append("gender", formData.gender);
    body.append("dob", normalizeDob(formData.dob));
    body.append("address", JSON.stringify(formData.address));
    if (imageFile) body.append("image", imageFile);

    try {
      const response = await axios.post(
        `${backendURL}/api/user/update-profile`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        await loadUserProfileData();
        setIsEditing(false);
        toast.success("Cập nhật hồ sơ thành công");
      } else {
        toast.error(response.data.message || "Cập nhật hồ sơ thất bại");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cập nhật hồ sơ thất bại");
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col gap-2 pt-5 max-w-lg text-sm">
        <p className="text-gray-600">Vui lòng đăng nhập để xem hồ sơ.</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col gap-2 pt-5 max-w-lg text-sm">
        <p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="flex flex-col gap-2 pt-5 max-w-lg text-sm">
        <img alt={userData.name} className="rounded w-36" src={displayImage} />
        <p className="mt-4 font-medium text-[#262626] text-3xl">
          {userData.name}
        </p>
        <hr className="bg-[#ADADAD] border-none h-px" />

        <div>
          <p className="mt-3 text-gray-600 underline">THÔNG TIN LIÊN HỆ</p>
          <div className="gap-y-2.5 grid grid-cols-[1fr_3fr] mt-3 text-[#363636]">
            <p className="font-medium">Email:</p>
            <p className="text-blue-500">{userData.email}</p>

            <p className="font-medium">Số điện thoại:</p>
            <p className="text-blue-500">{userData.phone || "—"}</p>

            <p className="font-medium">Địa chỉ:</p>
            <p className="text-gray-500">
              {userData.address?.line1 || ""} <br />
              {userData.address?.line2 || ""}
            </p>
          </div>
        </div>

        <div>
          <p className="mt-3 text-[#797979] underline">THÔNG TIN CƠ BẢN</p>
          <div className="gap-y-2.5 grid grid-cols-[1fr_3fr] mt-3 text-gray-600">
            <p className="font-medium">Giới tính:</p>
            <p className="text-gray-500">{userData.gender || "Chưa chọn"}</p>

            <p className="font-medium">Ngày sinh:</p>
            <p className="text-gray-500">{userData.dob || "—"}</p>
          </div>
        </div>

        <div className="mt-10">
          <button
            className="hover:bg-primary px-8 py-2 border border-primary rounded-full hover:text-white transition-all"
            onClick={handleStartEdit}
            type="button"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-2 pt-5 max-w-lg text-sm"
      onSubmit={handleSubmit}
    >
      <label htmlFor="image">
        <div className="inline-block relative cursor-pointer">
          <img alt="" className="opacity-75 rounded w-36" src={displayImage} />
          <img
            alt="Upload"
            className="right-12 bottom-12 absolute w-10"
            src={assets.upload_icon}
          />
        </div>
        <input
          accept="image/*"
          hidden
          id="image"
          onChange={handleImageChange}
          type="file"
        />
      </label>
      {errors.image && (
        <p className="mt-1 text-red-500 text-xs">{errors.image}</p>
      )}

      <div>
        <input
          className={`bg-gray-50 text-3xl font-medium max-w-60 ${errors.name ? "border border-red-500" : ""}`}
          onChange={(event) => handleBasicChange("name", event.target.value)}
          type="text"
          value={formData.name}
        />
        {errors.name && (
          <p className="mt-1 text-red-500 text-xs">{errors.name}</p>
        )}
      </div>

      <hr className="bg-[#ADADAD] border-none h-px" />

      <div>
        <p className="mt-3 text-gray-600 underline">THÔNG TIN LIÊN HỆ</p>
        <div className="gap-y-2.5 grid grid-cols-[1fr_3fr] mt-3 text-[#363636]">
          <p className="font-medium">Email:</p>
          <p className="text-blue-500">{userData.email}</p>

          <p className="font-medium">Số điện thoại:</p>
          <div>
            <input
              className={`bg-gray-50 max-w-52 ${errors.phone ? "border border-red-500" : ""}`}
              onChange={(event) =>
                handleBasicChange("phone", event.target.value)
              }
              placeholder="0123456789"
              type="text"
              value={formData.phone}
            />
            {errors.phone && (
              <p className="mt-1 text-red-500 text-xs">{errors.phone}</p>
            )}
          </div>

          <p className="font-medium">Địa chỉ:</p>
          <div>
            <input
              className={`bg-gray-50 w-full ${errors.addressLine1 ? "border border-red-500" : ""}`}
              onChange={(event) =>
                handleAddressChange("line1", event.target.value)
              }
              placeholder="Số nhà, tên đường"
              type="text"
              value={formData.address.line1}
            />
            {errors.addressLine1 && (
              <p className="mt-1 text-red-500 text-xs">{errors.addressLine1}</p>
            )}
            <br />
            <input
              className={`bg-gray-50 w-full ${errors.addressLine2 ? "border border-red-500" : ""}`}
              onChange={(event) =>
                handleAddressChange("line2", event.target.value)
              }
              placeholder="Phường, Quận, Thành phố"
              type="text"
              value={formData.address.line2}
            />
            {errors.addressLine2 && (
              <p className="mt-1 text-red-500 text-xs">{errors.addressLine2}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="mt-3 text-[#797979] underline">THÔNG TIN CƠ BẢN</p>
        <div className="gap-y-2.5 grid grid-cols-[1fr_3fr] mt-3 text-gray-600">
          <p className="font-medium">Giới tính:</p>
          <select
            className="bg-gray-50 max-w-20"
            onChange={(event) =>
              handleBasicChange("gender", event.target.value)
            }
            value={formData.gender}
          >
            <option value="Chưa chọn">Chưa chọn</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>

          <p className="font-medium">Ngày sinh:</p>
          <div>
            <input
              className={`max-w-28 bg-gray-50 ${errors.dob ? "border border-red-500" : ""}`}
              max={new Date().toISOString().split("T")[0]}
              onChange={(event) => handleBasicChange("dob", event.target.value)}
              type="date"
              value={formData.dob}
            />
            {errors.dob && (
              <p className="mt-1 text-red-500 text-xs">{errors.dob}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-10">
        <button
          className="hover:bg-gray-100 px-8 py-2 border border-gray-300 rounded-full transition-all"
          onClick={() => setIsEditing(false)}
          type="button"
        >
          Hủy
        </button>
        <button
          className="hover:bg-primary px-8 py-2 border border-primary rounded-full hover:text-white transition-all"
          type="submit"
        >
          Lưu thông tin
        </button>
      </div>
    </form>
  );
};

export default MyProfile;
