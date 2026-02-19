import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({
        message: "Chưa được xác thực, vui lòng đăng nhập lại",
        success: false,
      });
    }

    const token = authHeader.substring(7); // Loại bỏ tiền tố "Bearer "
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.docId = token_decode.id; // Lưu vào req thay vì req.body
    next();
  } catch (error) {
    console.log(error);
    res.json({ message: error.message || "Lỗi xác thực", success: false });
  }
};

export default authDoctor;
