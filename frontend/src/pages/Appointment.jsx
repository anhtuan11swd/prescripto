import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, doctors } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import {
  getVietnameseTimeLabel,
  getVietnameseWeekdayLabel,
} from "../utils/dateDisplay";

const Appointment = () => {
  const { docId } = useParams();

  useEffect(() => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  }, []);

  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const docInfo = useMemo(
    () => doctors.find((doc) => doc._id === docId),
    [docId],
  );

  const docSlots = useMemo(() => {
    if (!docInfo) return [];

    const today = new Date();
    const slotsByDay = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        const nextHour =
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10;
        currentDate.setHours(nextHour);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0, 0, 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        const slotDate = `${currentDate.getDate()}_${
          currentDate.getMonth() + 1
        }_${currentDate.getFullYear()}`;

        const slotTimeStr = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const isBooked =
          docInfo.slots_booked?.[slotDate]?.includes(slotTimeStr);

        if (!isBooked) {
          timeSlots.push({
            datetime: new Date(currentDate),
            displayTime: getVietnameseTimeLabel(currentDate),
            time: slotTimeStr,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slotsByDay.push(timeSlots);
    }

    return slotsByDay;
  }, [docInfo]);

  const bookAppointment = () => {
    if (!docInfo || !docSlots[slotIndex]) return;
    const selected = docSlots[slotIndex].find((s) => s.time === slotTime);
    if (!selected) return;

    // TODO: Tích hợp API/bookAppointment thực tế
    // Tạm thời chỉ log ra console để kiểm tra
    console.log("Booking appointment:", {
      datetime: selected.datetime,
      doctorId: docInfo._id,
      time: selected.time,
    });
  };

  if (!docInfo) {
    return (
      <div className="px-4 sm:px-10 py-10 text-gray-600 text-center">
        Không tìm thấy thông tin bác sĩ.
      </div>
    );
  }

  const currentDaySlots = docSlots[slotIndex] || [];

  return (
    <div>
      <div className="flex sm:flex-row flex-col gap-4">
        <div>
          <img
            alt={docInfo.name}
            className="bg-primary rounded-lg w-full sm:max-w-72"
            src={docInfo.image}
          />
        </div>

        <div className="flex-1 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0 p-8 py-7 border border-[#ADADAD] rounded-lg">
          <p className="flex items-center gap-2 font-medium text-gray-700 text-3xl">
            {docInfo.name}
            <img alt="verified" className="w-5" src={assets.verified_icon} />
          </p>

          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>{`${docInfo.degree} - ${docInfo.speciality}`}</p>
            <button
              className="px-2 py-0.5 border rounded-full text-xs"
              type="button"
            >
              {docInfo.experience}
            </button>
          </div>

          <div>
            <p className="flex items-center gap-1 mt-3 font-medium text-[#262626] text-sm">
              Giới thiệu
              <img alt="information" className="w-3" src={assets.info_icon} />
            </p>
            <p className="mt-1 max-w-[700px] text-gray-600 text-sm">
              {docInfo.about}
            </p>
          </div>

          <p className="mt-4 font-medium text-gray-600">
            Phí khám:{" "}
            <span className="text-gray-800">
              {docInfo.fees.toLocaleString("vi-VN")} VND
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:ml-72 sm:pl-4 font-medium text-[#565656]">
        <p>Đặt lịch hẹn</p>

        <div className="flex items-center gap-3 mt-4 w-full overflow-x-scroll">
          {docSlots.map((daySlots, index) => {
            const date =
              daySlots[0]?.datetime ||
              (() => {
                const d = new Date();
                d.setDate(d.getDate() + index);
                return d;
              })();

            const dayLabel = getVietnameseWeekdayLabel(date);

            const dayNumber = date.getDate();

            const isActive = slotIndex === index;

            return (
              <button
                className={`text-center py-6 w-20 rounded-full cursor-pointer ${
                  isActive ? "bg-primary text-white" : "border border-[#DDDDDD]"
                }`}
                key={date.toISOString()}
                onClick={() => {
                  setSlotIndex(index);
                  setSlotTime("");
                }}
                type="button"
              >
                <p>{dayLabel}</p>
                <p>{dayNumber}</p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4 w-full">
          {currentDaySlots.map((slot) => {
            const isSelected = slot.time === slotTime;
            return (
              <button
                className={`px-4 py-2 rounded-full text-sm border min-w-fit ${
                  isSelected
                    ? "bg-primary text-white border-primary"
                    : "border-[#DDDDDD] text-[#565656]"
                }`}
                key={slot.time}
                onClick={() => setSlotTime(slot.time)}
                type="button"
              >
                {slot.displayTime || slot.time}
              </button>
            );
          })}
          {!currentDaySlots.length && (
            <p className="text-gray-500 text-sm">
              Không có slot trống cho ngày này.
            </p>
          )}
        </div>

        <button
          className="bg-primary disabled:opacity-60 my-6 px-20 py-3 rounded-full font-light text-white text-sm disabled:cursor-not-allowed"
          disabled={!slotTime || !currentDaySlots.length}
          onClick={bookAppointment}
          type="button"
        >
          Đặt lịch hẹn ngay
        </button>
      </div>

      <RelatedDoctors docId={docInfo._id} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
