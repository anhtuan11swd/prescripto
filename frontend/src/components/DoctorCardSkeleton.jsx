/**
 * Component skeleton loader cho DoctorCard
 * Hiển thị layout giống với DoctorCard thật để UX mượt mà
 */
const DoctorCardSkeleton = () => (
  <div className="border border-[#C9D8FF] rounded-xl overflow-hidden animate-pulse bg-white">
    {/* Image placeholder */}
    <div className="bg-[#EAEFFF] w-full h-48" />

    <div className="p-4 space-y-3">
      {/* Availability indicator skeleton */}
      <div className="flex items-center gap-2">
        <div className="bg-gray-200 rounded-full w-2 h-2" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>

      {/* Doctor name skeleton */}
      <div className="h-5 bg-gray-200 rounded w-3/4" />

      {/* Doctor speciality skeleton */}
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

export default DoctorCardSkeleton;
