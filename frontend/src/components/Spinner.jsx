/**
 * Component hiển thị loading spinner với các size khác nhau
 * @param {string} size - Kích thước spinner: 'sm', 'md', 'lg' (default: 'md')
 */
const Spinner = ({ size = "md" }) => {
  const sizeClasses = {
    lg: "h-16 w-16",
    md: "h-8 w-8",
    sm: "h-4 w-4",
  };

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default Spinner;
