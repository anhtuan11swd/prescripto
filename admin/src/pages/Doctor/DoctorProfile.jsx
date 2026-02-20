import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { formatCurrency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    console.log("=== updateProfile được gọi ===");
    console.log("dToken:", dToken);
    console.log("backendUrl:", backendUrl);
    console.log("profileData:", profileData);

    try {
      const updateData = {
        address: profileData.address,
        available: profileData.available,
        fee: profileData.fee,
      };

      console.log("updateData sẽ gửi:", updateData);

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        { headers: { Authorization: `Bearer ${dToken}` } },
      );

      console.log("Response từ server:", data);

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Lỗi khi update profile:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken, getProfileData]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              alt=""
              className="bg-primary/80 rounded-lg w-full sm:max-w-64"
              src={profileData.image}
            />
          </div>

          <div className="flex-1 bg-white p-8 py-7 border border-stone-100 rounded-lg">
            {/* Name, Degree, Experience */}
            <p className="flex items-center gap-2 font-medium text-gray-700 text-3xl">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button
                className="px-2 py-0.5 border rounded-full text-xs"
                type="button"
              >
                {profileData.experience}
              </button>
            </div>

            {/* Giới thiệu */}
            <div>
              <p className="flex items-center gap-1 mt-3 font-medium text-neutral-800 text-sm">
                Giới thiệu
              </p>
              <p className="mt-1 max-w-[700px] text-gray-600 text-sm">
                {profileData.about}
              </p>
            </div>

            {/* Phí khám */}
            <p className="mt-4 font-medium text-gray-600">
              Phí khám:{" "}
              <span className="text-gray-800">
                {isEdit ? (
                  <input
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fee: e.target.value,
                      }))
                    }
                    type="number"
                    value={profileData.fee}
                  />
                ) : (
                  formatCurrency(profileData.fee)
                )}
              </span>
            </p>

            {/* Địa chỉ */}
            <div className="flex gap-2 py-2">
              <p>Địa chỉ:</p>
              <p className="text-sm">
                {isEdit ? (
                  <input
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    type="text"
                    value={profileData.address.line1}
                  />
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    type="text"
                    value={profileData.address.line2}
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>

            {/* Checkbox có sẵn */}
            <div className="flex gap-1 pt-2">
              <input
                checked={profileData.available}
                id="available-checkbox"
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                type="checkbox"
              />
              <label htmlFor="available-checkbox">Còn trống lịch</label>
            </div>

            {/* Nút Chỉnh sửa/Lưu */}
            {isEdit ? (
              <button
                className="hover:bg-primary mt-5 px-4 py-1 border border-primary rounded-full hover:text-white text-sm transition-all"
                onClick={() => {
                  console.log("Nút Lưu được click");
                  updateProfile();
                }}
                type="button"
              >
                Lưu
              </button>
            ) : (
              <button
                className="hover:bg-primary mt-5 px-4 py-1 border border-primary rounded-full hover:text-white text-sm transition-all"
                onClick={() => {
                  console.log("Nút Chỉnh sửa được click");
                  setIsEdit(true);
                }}
                type="button"
              >
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
