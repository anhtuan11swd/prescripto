import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        message: "Chưa được xác thực, vui lòng đăng nhập lại",
        success: false,
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ message: error.message || "Lỗi xác thực", success: false });
  }
};

export default authUser;
