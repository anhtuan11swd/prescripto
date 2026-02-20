import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
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
      const { data } = await axios.post(
        `${backendURL}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data?.success) {
        toast.success("Hủy lịch hẹn thành công");
      } else {
        toast.error(data?.message || "Hủy lịch hẹn thất bại");
      }
      await Promise.all([loadAppointments(), getDoctorsData()]);
    } catch {
      toast.error("Hủy lịch hẹn thất bại");
    } finally {
      setCancellingId(null);
    }
  };

  const renderStatusActions = (appointment) => {
    if (appointment.isCompleted) {
      return (
        <div className="flex flex-col justify-end gap-2 text-sm text-center">
          <button
            className="py-2 border border-emerald-500 rounded sm:min-w-48 text-emerald-600"
            type="button"
          >
            Hoàn thành
          </button>
        </div>
      );
    }

    if (appointment.cancelled) {
      return (
        <div className="flex flex-col justify-end gap-2 text-sm text-center">
          <button
            className="py-2 border border-red-500 rounded sm:min-w-48 text-red-500"
            type="button"
          >
            Đã hủy lịch hẹn
          </button>
        </div>
      );
    }

    if (!appointment.payment) {
      return (
        <div className="flex flex-col justify-end gap-2 text-sm text-center">
          <button
            className="hover:bg-primary py-2 border rounded sm:min-w-48 text-[#696969] hover:text-white transition-all duration-300"
            type="button"
          >
            Thanh toán online
          </button>
          <button
            className="hover:bg-red-600 py-2 border rounded sm:min-w-48 text-[#696969] hover:text-white transition-all duration-300"
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
      <div className="flex flex-col justify-end gap-2 text-sm text-center">
        <button
          className="py-2 border rounded sm:min-w-48 text-[#696969]"
          type="button"
        >
          Đã thanh toán
        </button>
      </div>
    );
  };

  if (!token) {
    return (
      <div className="px-4 sm:px-10 py-10 text-gray-600 text-center">
        Vui lòng đăng nhập để xem lịch hẹn của bạn.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-10 pb-10">
      <p className="mt-12 pb-3 border-b font-medium text-gray-600 text-lg">
        Lịch hẹn của tôi
      </p>

      {loading && !appointments.length ? <Spinner size="lg" /> : null}

      {!loading && !appointments.length ? (
        <div className="py-8 text-gray-500 text-sm">
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
              className="sm:flex gap-4 sm:gap-6 grid grid-cols-[1fr_2fr] py-4 border-b"
              key={appointment._id}
            >
              <div>
                <img
                  alt={doc.name || "Doctor"}
                  className="bg-[#EAEFFF] w-36"
                  src={
                    doc.image ||
                    "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc1.png"
                  }
                />
              </div>

              <div className="flex-1 text-[#5E5E5E] text-sm">
                <p className="font-semibold text-[#262626] text-base">
                  {doc.name}
                </p>
                <p>{doc.speciality}</p>

                <p className="mt-1 font-medium text-[#464646]">Địa chỉ:</p>
                {addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}

                <p className="mt-1">
                  <span className="font-medium text-[#3C3C3C] text-sm">
                    Ngày &amp; giờ:
                  </span>{" "}
                  {slotDateFormat
                    ? slotDateFormat(appointment.slotDate)
                    : appointment.slotDate}{" "}
                  | {appointment.slotTime}
                </p>
              </div>

              <div className="hidden sm:block flex-1" />

              {renderStatusActions(appointment)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointments;
