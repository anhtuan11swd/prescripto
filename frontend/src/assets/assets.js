import appointment_img from "./appointment_img.png";
import header_img from "./header_img.png";
import group_profiles from "./group_profiles.png";
import profile_pic from "./profile_pic.png";
import contact_image from "./contact_image.png";
import about_image from "./about_image.png";
import logo from "./logo.svg";
import dropdown_icon from "./dropdown_icon.svg";
import menu_icon from "./menu_icon.svg";
import cross_icon from "./cross_icon.png";
import chats_icon from "./chats_icon.svg";
import verified_icon from "./verified_icon.svg";
import arrow_icon from "./arrow_icon.svg";
import info_icon from "./info_icon.svg";
import upload_icon from "./upload_icon.png";
import stripe_logo from "./stripe_logo.png";
import razorpay_logo from "./razorpay_logo.png";
import doc1 from "./doc1.png";
import doc2 from "./doc2.png";
import doc3 from "./doc3.png";
import doc4 from "./doc4.png";
import doc5 from "./doc5.png";
import doc6 from "./doc6.png";
import doc7 from "./doc7.png";
import doc8 from "./doc8.png";
import doc9 from "./doc9.png";
import doc10 from "./doc10.png";
import doc11 from "./doc11.png";
import doc12 from "./doc12.png";
import doc13 from "./doc13.png";
import doc14 from "./doc14.png";
import doc15 from "./doc15.png";
import Dermatologist from "./Dermatologist.svg";
import Gastroenterologist from "./Gastroenterologist.svg";
import General_physician from "./General_physician.svg";
import Gynecologist from "./Gynecologist.svg";
import Neurologist from "./Neurologist.svg";
import Pediatricians from "./Pediatricians.svg";

export const assets = {
  appointment_img,
  header_img,
  group_profiles,
  logo,
  chats_icon,
  verified_icon,
  info_icon,
  profile_pic,
  arrow_icon,
  contact_image,
  about_image,
  menu_icon,
  cross_icon,
  dropdown_icon,
  upload_icon,
  stripe_logo,
  razorpay_logo,
};

export const specialityData = [
  {
    speciality: "Bác sĩ đa khoa",
    image: General_physician,
  },
  {
    speciality: "Bác sĩ phụ khoa",
    image: Gynecologist,
  },
  {
    speciality: "Bác sĩ da liễu",
    image: Dermatologist,
  },
  {
    speciality: "Bác sĩ nhi",
    image: Pediatricians,
  },
  {
    speciality: "Bác sĩ thần kinh",
    image: Neurologist,
  },
  {
    speciality: "Bác sĩ tiêu hóa",
    image: Gastroenterologist,
  },
];

export const doctors = [
  {
    _id: "doc1",
    name: "Bác sĩ. Nguyễn Văn A",
    image: doc1,
    speciality: "Bác sĩ đa khoa",
    degree: "Bác sĩ",
    experience: "4 Năm",
    about:
      "Bác sĩ Nguyễn Văn A cam kết cung cấp chăm sóc y tế toàn diện, tập trung vào phòng ngừa bệnh, chẩn đoán sớm và chiến lược điều trị hiệu quả. Với nhiều năm kinh nghiệm trong lĩnh vực y khoa đa khoa, bác sĩ luôn đặt sức khỏe bệnh nhân lên hàng đầu.",
    fees: 1250000,
    address: {
      line1: "123 Đường Lê Lợi",
      line2: "Quận 1, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc2",
    name: "Bác sĩ. Trần Thị B",
    image: doc2,
    speciality: "Bác sĩ phụ khoa",
    degree: "Bác sĩ",
    experience: "3 Năm",
    about:
      "Bác sĩ. Trần Thị B chuyên sâu về sản phụ khoa với kiến thức chuyên môn vững vàng trong việc chăm sóc sức khỏe phụ nữ, từ khám thai định kỳ đến điều trị các bệnh phụ khoa. Bác sĩ luôn tận tâm lắng nghe và hỗ trợ bệnh nhân.",
    fees: 1500000,
    address: {
      line1: "456 Đường Nguyễn Trãi",
      line2: "Quận 5, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc3",
    name: "Bác sĩ. Lê Thị C",
    image: doc3,
    speciality: "Bác sĩ da liễu",
    degree: "Bác sĩ",
    experience: "1 Năm",
    about:
      "Bác sĩ. Lê Thị C chuyên điều trị các bệnh về da liễu như mụn, eczema, viêm da và các vấn đề về tóc, móng. Bác sĩ cập nhật các phương pháp điều trị tiên tiến nhất để mang lại hiệu quả tốt nhất cho bệnh nhân.",
    fees: 750000,
    address: {
      line1: "789 Đường Pasteur",
      line2: "Quận 3, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc4",
    name: "Bác sĩ. Phạm Văn D",
    image: doc4,
    speciality: "Bác sĩ nhi",
    degree: "Bác sĩ",
    experience: "2 Năm",
    about:
      "Bác sĩ. Phạm Văn D có kinh nghiệm trong việc chăm sóc sức khỏe trẻ em từ sơ sinh đến tuổi vị thành niên. Bác sĩ chuyên tiêm chủng, khám định kỳ và điều trị các bệnh nhi khoa thường gặp.",
    fees: 1000000,
    address: {
      line1: "321 Đường Võ Văn Tần",
      line2: "Quận 3, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc5",
    name: "Bác sĩ. Hoàng Văn E",
    image: doc5,
    speciality: "Bác sĩ tiêu hóa",
    degree: "Bác sĩ",
    experience: "4 Năm",
    about:
      "Bác sĩ. Hoàng Văn E chuyên điều trị các bệnh về tiêu hóa như viêm loét dạ dày, trào ngược acid, hội chứng ruột kích thích và các bệnh về gan. Bác sĩ sử dụng nội soi tiêu hóa hiện đại để chẩn đoán và điều trị chính xác.",
    fees: 1250000,
    address: {
      line1: "654 Đường Phan Đăng Lưu",
      line2: "Quận Phú Nhuận, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc6",
    name: "Bác sĩ. Đặng Văn F",
    image: doc6,
    speciality: "Bác sĩ tiêu hóa",
    degree: "Bác sĩ",
    experience: "4 Năm",
    about:
      "Bác sĩ. Đặng Văn F chuyên về các bệnh lý tiêu hóa như viêm dạ dày, viêm đại tràng, nhiễm H.pylori và các vấn đề về túi mật. Bác sĩ tư vấn chế độ ăn uống lành mạnh để cải thiện sức khỏe tiêu hóa cho bệnh nhân.",
    fees: 1250000,
    address: {
      line1: "987 Đường Nguyễn Oai",
      line2: "Quận 9, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc7",
    name: "Bác sĩ. Vũ Văn G",
    image: doc7,
    speciality: "Bác sĩ đa khoa",
    degree: "Bác sĩ",
    experience: "4 Năm",
    about:
      "Bác sĩ. Vũ Văn G với hơn 4 năm kinh nghiệm trong lĩnh vực y đa khoa, chuyên khám tổng quát, tư vấn sức khỏe và điều trị các bệnh nội khoa thông thường. Bác sĩ đặt mục tiêu phòng ngừa và phát hiện sớm các vấn đề sức khỏe.",
    fees: 1250000,
    address: {
      line1: "147 Đường Điện Biên Phủ",
      line2: "Quận Bình Thạnh, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc8",
    name: "Bác sĩ. Nguyễn Thị H",
    image: doc8,
    speciality: "Bác sĩ phụ khoa",
    degree: "Bác sĩ",
    experience: "3 Năm",
    about:
      "Bác sĩ. Nguyễn Thị H chuyên về sản phụ khoa, tư vấn kế hoạch hóa gia đình, theo dõi thai kỳ và điều trị các bệnh phụ khoa. Bác sĩ tạo môi trường thoải mái để bệnh nhân có thể chia sẻ những vấn đề nhạy cảm.",
    fees: 1500000,
    address: {
      line1: "258 Đường Lý Thường Kiệt",
      line2: "Quận 10, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc9",
    name: "Bác sĩ. Trần Thị I",
    image: doc9,
    speciality: "Bác sĩ da liễu",
    degree: "Bác sĩ",
    experience: "1 Năm",
    about:
      "Bác sĩ. Trần Thị I chuyên điều trị các vấn đề về da như mụn trứng cá, viêm da dị ứng, nấm da và các bệnh da liễu khác. Bác sĩ tư vấn chế độ chăm sóc da phù hợp cho từng loại da.",
    fees: 750000,
    address: {
      line1: "369 Đường Trần Hưng Đạo",
      line2: "Quận 1, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc10",
    name: "Bác sĩ. Lê Văn K",
    image: doc10,
    speciality: "Bác sĩ nhi",
    degree: "Bác sĩ",
    experience: "2 Năm",
    about:
      "Bác sĩ. Lê Văn K chuyên chăm sóc sức khỏe trẻ em, từ sơ sinh đến thanh thiếu niên. Bác sĩ có kỹ năng giao tiếp tốt với trẻ nhỏ, giúp các em thoải mái trong quá trình khám bệnh.",
    fees: 1000000,
    address: {
      line1: "741 Đường Nguyễn Thị Minh Khai",
      line2: "Quận 3, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc11",
    name: "Bác sĩ. Bùi Văn L",
    image: doc11,
    speciality: "Bác sĩ thần kinh",
    degree: "Bác sĩ",
    experience: "4 Năm",
    about:
      "Bác sĩ. Bùi Văn L có chuyên môn cao trong việc chẩn đoán và điều trị các bệnh lý thần kinh như đau nửa đầu, động kinh, rối loạn vận động và các hội chứng thần kinh khác.",
    fees: 1250000,
    address: {
      line1: "852 Đường Hoàng Văn Thụ",
      line2: "Quận Phú Nhuận, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc12",
    name: "Bác sĩ. Ngô Văn M",
    image: doc12,
    speciality: "Bác sĩ thần kinh",
    degree: "Bác sĩ",
    experience: "4 Năm",
    about:
      "Bác sĩ. Ngô Văn M chuyên khám và tư vấn về các vấn đề thần kinh như rối loạn giấc ngủ, suy nhược thần kinh, đau dây thần kinh và các bệnh lý liên quan đến não.",
    fees: 1250000,
    address: {
      line1: "963 Đường Nguyễn Văn Quá",
      line2: "Quận 12, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc13",
    name: "Bác sĩ. Đỗ Thị N",
    image: doc13,
    speciality: "Bác sĩ đa khoa",
    degree: "Bác sĩ",
    experience: "4 Năm",
    about:
      "Bác sĩ. Đỗ Thị N với kinh nghiệm nhiều năm trong lĩnh vực y đa khoa, khám tổng quát, tư vấn dinh dưỡng và phòng ngừa bệnh. Bác sĩ luôn lắng nghe và đồng hành cùng bệnh nhân trong hành trình chăm sóc sức khỏe.",
    fees: 1250000,
    address: {
      line1: "159 Đường Tô Hiến Thành",
      line2: "Quận 10, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc14",
    name: "Bác sĩ. Võ Thị P",
    image: doc14,
    speciality: "Bác sĩ phụ khoa",
    degree: "Bác sĩ",
    experience: "3 Năm",
    about:
      "Bác sĩ. Võ Thị P chuyên về sản phụ khoa với sự tận tâm trong việc chăm sóc sức khỏe phụ nữ. Bác sĩ cung cấp dịch vụ khám thai, tư vấn kế hoạch hóa gia đình và điều trị các bệnh phụ khoa.",
    fees: 1500000,
    address: {
      line1: "357 Đường Lê Hồng Phong",
      line2: "Quận Bình Thạnh, TP. Hồ Chí Minh",
    },
  },
  {
    _id: "doc15",
    name: "Bác sĩ. Trịnh Thị Q",
    image: doc15,
    speciality: "Bác sĩ da liễu",
    degree: "Bác sĩ",
    experience: "1 Năm",
    about:
      "Bác sĩ. Trịnh Thị Q trẻ trung, năng động và cập nhật kiến thức y học mới nhất về da liễu. Bác sĩ chuyên điều trị mụn, các vấn đề về da và tư vấn thẩm mỹ da an toàn.",
    fees: 750000,
    address: {
      line1: "486 Đường Phan Xích Long",
      line2: "Quận Phú Nhuận, TP. Hồ Chí Minh",
    },
  },
];
