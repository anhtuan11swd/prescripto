import PropTypes from "prop-types";

const DoctorCard = ({
  doctor,
  onClick,
  availabilityLabel = "Còn trống lịch",
}) => {
  if (!doctor) return null;

  return (
    <button
      className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 text-left w-full bg-transparent"
      onClick={onClick}
      type="button"
    >
      <img
        alt={doctor.name || ""}
        className="bg-[#EAEFFF] w-full object-cover"
        src={doctor.image}
      />
      <div className="p-4">
        <div className="flex items-center gap-2 text-green-500 text-sm text-center">
          <span
            aria-hidden
            className="bg-green-500 rounded-full w-2 h-2 shrink-0"
          />
          <span>{availabilityLabel}</span>
        </div>
        <p className="font-medium text-[#262626] text-lg mt-1">{doctor.name}</p>
        <p className="text-[#5C5C5C] text-sm">{doctor.speciality}</p>
      </div>
    </button>
  );
};

DoctorCard.propTypes = {
  availabilityLabel: PropTypes.string,
  doctor: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    speciality: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

export default DoctorCard;
