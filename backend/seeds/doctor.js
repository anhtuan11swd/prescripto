import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import "dotenv/config";

// Lấy đường dẫn hiện tại của file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình Cloudinary
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

// Dữ liệu mẫu bác sĩ từ assets/assets.js
const doctorsData = [
  {
    _id: "doc1",
    about:
      "Bác sĩ Nguyễn Văn A cam kết cung cấp chăm sóc y tế toàn diện, tập trung vào phòng ngừa bệnh, chẩn đoán sớm và chiến lược điều trị hiệu quả. Với nhiều năm kinh nghiệm trong lĩnh vực y khoa đa khoa, bác sĩ luôn đặt sức khỏe bệnh nhân lên hàng đầu.",
    address: {
      line1: "123 Đường Lê Lợi",
      line2: "Quận 1, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "4 Năm",
    fee: 1250000,
    imageName: "doc1",
    name: "Bác sĩ. Nguyễn Văn A",
    speciality: "Bác sĩ đa khoa",
  },
  {
    _id: "doc2",
    about:
      "Bác sĩ. Trần Thị B chuyên sâu về sản phụ khoa với kiến thức chuyên môn vững vàng trong việc chăm sóc sức khỏe phụ nữ, từ khám thai định kỳ đến điều trị các bệnh phụ khoa. Bác sĩ luôn tận tâm lắng nghe và hỗ trợ bệnh nhân.",
    address: {
      line1: "456 Đường Nguyễn Trãi",
      line2: "Quận 5, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "3 Năm",
    fee: 1500000,
    imageName: "doc2",
    name: "Bác sĩ. Trần Thị B",
    speciality: "Bác sĩ phụ khoa",
  },
  {
    _id: "doc3",
    about:
      "Bác sĩ. Lê Thị C chuyên điều trị các bệnh về da liễu như mụn, eczema, viêm da và các vấn đề về tóc, móng. Bác sĩ cập nhật các phương pháp điều trị tiên tiến nhất để mang lại hiệu quả tốt nhất cho bệnh nhân.",
    address: {
      line1: "789 Đường Pasteur",
      line2: "Quận 3, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "1 Năm",
    fee: 750000,
    imageName: "doc3",
    name: "Bác sĩ. Lê Thị C",
    speciality: "Bác sĩ da liễu",
  },
  {
    _id: "doc4",
    about:
      "Bác sĩ. Phạm Văn D có kinh nghiệm trong việc chăm sóc sức khỏe trẻ em từ sơ sinh đến tuổi vị thành niên. Bác sĩ chuyên tiêm chủng, khám định kỳ và điều trị các bệnh nhi khoa thường gặp.",
    address: {
      line1: "321 Đường Võ Văn Tần",
      line2: "Quận 3, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "2 Năm",
    fee: 1000000,
    imageName: "doc4",
    name: "Bác sĩ. Phạm Văn D",
    speciality: "Bác sĩ nhi",
  },
  {
    _id: "doc5",
    about:
      "Bác sĩ. Hoàng Văn E chuyên điều trị các bệnh về tiêu hóa như viêm loét dạ dày, trào ngược acid, hội chứng ruột kích thích và các bệnh về gan. Bác sĩ sử dụng nội soi tiêu hóa hiện đại để chẩn đoán và điều trị chính xác.",
    address: {
      line1: "654 Đường Phan Đăng Lưu",
      line2: "Quận Phú Nhuận, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "4 Năm",
    fee: 1250000,
    imageName: "doc5",
    name: "Bác sĩ. Hoàng Văn E",
    speciality: "Bác sĩ tiêu hóa",
  },
  {
    _id: "doc6",
    about:
      "Bác sĩ. Đặng Văn F chuyên về các bệnh lý tiêu hóa như viêm dạ dày, viêm đại tràng, nhiễm H.pylori và các vấn đề về túi mật. Bác sĩ tư vấn chế độ ăn uống lành mạnh để cải thiện sức khỏe tiêu hóa cho bệnh nhân.",
    address: {
      line1: "987 Đường Nguyễn Oai",
      line2: "Quận 9, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "4 Năm",
    fee: 1250000,
    imageName: "doc6",
    name: "Bác sĩ. Đặng Văn F",
    speciality: "Bác sĩ tiêu hóa",
  },
  {
    _id: "doc7",
    about:
      "Bác sĩ. Vũ Văn G với hơn 4 năm kinh nghiệm trong lĩnh vực y đa khoa, chuyên khám tổng quát, tư vấn sức khỏe và điều trị các bệnh nội khoa thông thường. Bác sĩ đặt mục tiêu phòng ngừa và phát hiện sớm các vấn đề sức khỏe.",
    address: {
      line1: "147 Đường Điện Biên Phủ",
      line2: "Quận Bình Thạnh, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "4 Năm",
    fee: 1250000,
    imageName: "doc7",
    name: "Bác sĩ. Vũ Văn G",
    speciality: "Bác sĩ đa khoa",
  },
  {
    _id: "doc8",
    about:
      "Bác sĩ. Nguyễn Thị H chuyên về sản phụ khoa, tư vấn kế hoạch hóa gia đình, theo dõi thai kỳ và điều trị các bệnh phụ khoa. Bác sĩ tạo môi trường thoải mái để bệnh nhân có thể chia sẻ những vấn đề nhạy cảm.",
    address: {
      line1: "258 Đường Lý Thường Kiệt",
      line2: "Quận 10, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "3 Năm",
    fee: 1500000,
    imageName: "doc8",
    name: "Bác sĩ. Nguyễn Thị H",
    speciality: "Bác sĩ phụ khoa",
  },
  {
    _id: "doc9",
    about:
      "Bác sĩ. Trần Thị I chuyên điều trị các vấn đề về da như mụn trứng cá, viêm da dị ứng, nấm da và các bệnh da liễu khác. Bác sĩ tư vấn chế độ chăm sóc da phù hợp cho từng loại da.",
    address: {
      line1: "369 Đường Trần Hưng Đạo",
      line2: "Quận 1, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "1 Năm",
    fee: 750000,
    imageName: "doc9",
    name: "Bác sĩ. Trần Thị I",
    speciality: "Bác sĩ da liễu",
  },
  {
    _id: "doc10",
    about:
      "Bác sĩ. Lê Văn K chuyên chăm sóc sức khỏe trẻ em, từ sơ sinh đến thanh thiếu niên. Bác sĩ có kỹ năng giao tiếp tốt với trẻ nhỏ, giúp các em thoải mái trong quá trình khám bệnh.",
    address: {
      line1: "741 Đường Nguyễn Thị Minh Khai",
      line2: "Quận 3, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "2 Năm",
    fee: 1000000,
    imageName: "doc10",
    name: "Bác sĩ. Lê Văn K",
    speciality: "Bác sĩ nhi",
  },
  {
    _id: "doc11",
    about:
      "Bác sĩ. Bùi Văn L có chuyên môn cao trong việc chẩn đoán và điều trị các bệnh lý thần kinh như đau nửa đầu, động kinh, rối loạn vận động và các hội chứng thần kinh khác.",
    address: {
      line1: "852 Đường Hoàng Văn Thụ",
      line2: "Quận Phú Nhuận, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "4 Năm",
    fee: 1250000,
    imageName: "doc11",
    name: "Bác sĩ. Bùi Văn L",
    speciality: "Bác sĩ thần kinh",
  },
  {
    _id: "doc12",
    about:
      "Bác sĩ. Ngô Văn M chuyên khám và tư vấn về các vấn đề thần kinh như rối loạn giấc ngủ, suy nhược thần kinh, đau dây thần kinh và các bệnh lý liên quan đến não.",
    address: {
      line1: "963 Đường Nguyễn Văn Quá",
      line2: "Quận 12, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "4 Năm",
    fee: 1250000,
    imageName: "doc12",
    name: "Bác sĩ. Ngô Văn M",
    speciality: "Bác sĩ thần kinh",
  },
  {
    _id: "doc13",
    about:
      "Bác sĩ. Đỗ Thị N với kinh nghiệm nhiều năm trong lĩnh vực y đa khoa, khám tổng quát, tư vấn dinh dưỡng và phòng ngừa bệnh. Bác sĩ luôn lắng nghe và đồng hành cùng bệnh nhân trong hành trình chăm sóc sức khỏe.",
    address: {
      line1: "159 Đường Tô Hiến Thành",
      line2: "Quận 10, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "4 Năm",
    fee: 1250000,
    imageName: "doc13",
    name: "Bác sĩ. Đỗ Thị N",
    speciality: "Bác sĩ đa khoa",
  },
  {
    _id: "doc14",
    about:
      "Bác sĩ. Võ Thị P chuyên về sản phụ khoa với sự tận tâm trong việc chăm sóc sức khỏe phụ nữ. Bác sĩ cung cấp dịch vụ khám thai, tư vấn kế hoạch hóa gia đình và điều trị các bệnh phụ khoa.",
    address: {
      line1: "357 Đường Lê Hồng Phong",
      line2: "Quận Bình Thạnh, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "3 Năm",
    fee: 1500000,
    imageName: "doc14",
    name: "Bác sĩ. Võ Thị P",
    speciality: "Bác sĩ phụ khoa",
  },
  {
    _id: "doc15",
    about:
      "Bác sĩ. Trịnh Thị Q trẻ trung, năng động và cập nhật kiến thức y học mới nhất về da liễu. Bác sĩ chuyên điều trị mụn, các vấn đề về da và tư vấn thẩm mỹ da an toàn.",
    address: {
      line1: "486 Đường Phan Xích Long",
      line2: "Quận Phú Nhuận, TP. Hồ Chí Minh",
    },
    degree: "Bác sĩ",
    experience: "1 Năm",
    fee: 750000,
    imageName: "doc15",
    name: "Bác sĩ. Trịnh Thị Q",
    speciality: "Bác sĩ da liễu",
  },
];

/**
 * Upload ảnh lên Cloudinary từ file local
 */
async function uploadImageToCloudinary(imageName) {
  const assetsPath = path.join(__dirname, "..", "assets");
  const imagePath = path.join(assetsPath, `${imageName}.png`);

  try {
    // Đọc file ảnh
    const imageBuffer = fs.readFileSync(imagePath);

    // Upload lên Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBuffer.toString("base64")}`,
      {
        folder: "prescripto/doctors",
        resource_type: "image",
      },
    );

    return uploadResult.secure_url;
  } catch (error) {
    console.error(`Lỗi khi upload ảnh ${imageName}:`, error.message);
    return null;
  }
}

/**
 * Seed dữ liệu bác sĩ vào database
 */
async function seedDoctors() {
  try {
    // Kiểm tra nếu database đã có dữ liệu
    const existingDoctors = await doctorModel.countDocuments();
    if (existingDoctors > 0) {
      console.log(
        `Database da co ${existingDoctors} bac si. Bo qua seed du lieu.`,
      );
      console.log("Xoa du lieu neu muon seed lai.");
      return; // Chỉ return thay vì exit process
    }

    console.log("Bắt đầu seed dữ liệu bác sĩ...");

    // Mã hóa mật khẩu (sử dụng chung mật khẩu cho development)
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash("doctor123", salt);

    // Seed từng bác sĩ
    for (const doc of doctorsData) {
      // Upload ảnh lên Cloudinary
      const imageUrl = await uploadImageToCloudinary(doc.imageName);

      if (!imageUrl) {
        console.error(`Bo qua bac si ${doc.name} do loi upload anh`);
        continue;
      }

      // Tạo object bác sĩ theo cấu trúc doctorModel
      const doctorData = {
        about: doc.about,
        address: doc.address,
        available: true,
        date: Date.now(),
        degree: doc.degree,
        email: `${doc._id}@prescripto.com`.toLowerCase(),
        experience: doc.experience,
        fee: Number(doc.fee),
        image: imageUrl,
        name: doc.name,
        password: defaultPassword,
        slotsBooked: {},
        speciality: doc.speciality,
      };

      // Lưu vào database
      const newDoctor = new doctorModel(doctorData);
      await newDoctor.save();

      console.log(`Da them: ${doc.name} (${doc.speciality})`);
    }

    console.log("\nSeed du lieu bac si hoan tat!");
    console.log("Email dang nhap: doc1@prescripto.com");
    console.log("Mat khau: doctor123");
  } catch (error) {
    console.error("Loi khi seed du lieu:", error.message);
  }
}

export default seedDoctors;
