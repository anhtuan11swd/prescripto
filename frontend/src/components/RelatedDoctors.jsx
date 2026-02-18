import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { doctors } from "../assets/assets";
import DoctorCard from "./DoctorCard";

const RelatedDoctors = ({ docId, speciality }) => {
  const navigate = useNavigate();

  const related = useMemo(
    () =>
      doctors
        .filter((doc) => doc.speciality === speciality && doc._id !== docId)
        .slice(0, 5),
    [docId, speciality],
  );

  if (!related.length) return null;

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-[#262626]">
      <h1 className="font-medium text-3xl">Bác sĩ liên quan</h1>
      <p className="w-11/12 sm:w-2/3 md:w-1/2 text-sm text-center md:whitespace-nowrap">
        Xem thêm các bác sĩ uy tín khác có chuyên môn tương tự để đặt lịch hẹn.
      </p>

      <div className="gap-4 gap-y-6 grid grid-cols-auto px-3 sm:px-0 pt-5 w-full">
        {related.map((doc) => (
          <DoctorCard
            doctor={doc}
            key={doc._id}
            onClick={() => navigate(`/appointment/${doc._id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedDoctors;
