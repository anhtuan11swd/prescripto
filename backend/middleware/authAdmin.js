import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({
        message: "Chưa được xác thực, vui lòng đăng nhập lại",
        success: false,
      });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({
        message: "Chưa được xác thực, vui lòng đăng nhập lại",
        success: false,
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.json({ message: error.message || "Lỗi xác thực", success: false });
  }
};

export default authAdmin;
