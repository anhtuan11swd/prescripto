import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({
        message: "Chưa được xác thực, vui lòng đăng nhập lại",
        success: false,
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // Verify admin role from token payload
    if (
      token_decode.role !== "admin" ||
      token_decode.email !== process.env.ADMIN_EMAIL
    ) {
      return res.json({
        message: "Chưa được xác thực, vui lòng đăng nhập lại",
        success: false,
      });
    }

    next();
  } catch (error) {
    res.json({ message: error.message || "Lỗi xác thực", success: false });
  }
};

export default authAdmin;
