import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContextContext";

const MyAppointments = () => {
  const { backendURL, getDoctorsData, slotDateFormat, token } =
    useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const loadAppointments = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendURL}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data?.success && Array.isArray(data.appointments)) {
        setAppointments(data.appointments);
      } else {
        setAppointments([]);
      }
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [backendURL, token]);

  useEffect(() => {
    window.scrollTo({ behavior: "smooth", top: 0 });
    void loadAppointments();
  }, [loadAppointments]);

  const handleCancel = async (appointmentId) => {
    if (!token || !appointmentId) return;
    try {
      setCancellingId(appointmentId);
      await axios.post(
        `${backendURL}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await Promise.all([loadAppointments(), getDoctorsData()]);
    } finally {
      setCancellingId(null);
    }
  };

  const renderStatusActions = (appointment) => {
    if (appointment.isCompleted) {
      return (
        <div className="flex flex-col justify-end gap-2 text-center text-sm">
          <button
            className="sm:min-w-48 rounded border border-emerald-500 py-2 text-emerald-600"
            type="button"
          >
            Hoàn thành
          </button>
        </div>
      );
    }

    if (appointment.cancelled) {
      return (
        <div className="flex flex-col justify-end gap-2 text-center text-sm">
          <button
            className="sm:min-w-48 rounded border border-red-500 py-2 text-red-500"
            type="button"
          >
            Đã hủy lịch hẹn
          </button>
        </div>
      );
    }

    if (!appointment.payment) {
      return (
        <div className="flex flex-col justify-end gap-2 text-center text-sm">
          <button
            className="sm:min-w-48 rounded border py-2 text-[#696969] transition-all duration-300 hover:bg-primary hover:text-white"
            type="button"
          >
            Thanh toán online
          </button>
          <button
            className="sm:min-w-48 rounded border py-2 text-[#696969] transition-all duration-300 hover:bg-red-600 hover:text-white"
            disabled={cancellingId === appointment._id}
            onClick={() => handleCancel(appointment._id)}
            type="button"
          >
            {cancellingId === appointment._id ? "Đang hủy..." : "Hủy lịch hẹn"}
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-end gap-2 text-center text-sm">
        <button
          className="sm:min-w-48 rounded border py-2 text-[#696969]"
          type="button"
        >
          Đã thanh toán
        </button>
      </div>
    );
  };

  if (!token) {
    return (
      <div className="px-4 py-10 text-center text-gray-600 sm:px-10">
        Vui lòng đăng nhập để xem lịch hẹn của bạn.
      </div>
    );
  }

  return (
    <div className="px-4 pb-10 sm:px-10">
      <p className="mt-12 border-b pb-3 text-lg font-medium text-gray-600">
        Lịch hẹn của tôi
      </p>

      {loading && !appointments.length ? (
        <div className="py-8 text-sm text-gray-500">Đang tải lịch hẹn...</div>
      ) : null}

      {!loading && !appointments.length ? (
        <div className="py-8 text-sm text-gray-500">
          Bạn chưa có lịch hẹn nào.
        </div>
      ) : null}

      <div>
        {appointments.map((appointment) => {
          const doc = appointment.docData || {};
          const addressLines = Array.isArray(doc.address)
            ? doc.address
            : [doc.address?.line1, doc.address?.line2].filter(Boolean);

          return (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 border-b py-4 sm:flex sm:gap-6"
              key={appointment._id}
            >
              <div>
                <img
                  alt={doc.name || "Doctor"}
                  className="w-36 bg-[#EAEFFF]"
                  src={
                    doc.image ||
                    "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc1.png"
                  }
                />
              </div>

              <div className="flex-1 text-sm text-[#5E5E5E]">
                <p className="text-base font-semibold text-[#262626]">
                  {doc.name}
                </p>
                <p>{doc.speciality}</p>

                <p className="mt-1 font-medium text-[#464646]">Địa chỉ:</p>
                {addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}

                <p className="mt-1">
                  <span className="text-sm font-medium text-[#3C3C3C]">
                    Ngày &amp; giờ:
                  </span>{" "}
                  {slotDateFormat
                    ? slotDateFormat(appointment.slotDate)
                    : appointment.slotDate}{" "}
                  | {appointment.slotTime}
                </p>
              </div>

              <div className="hidden flex-1 sm:block" />

              {renderStatusActions(appointment)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointments;
