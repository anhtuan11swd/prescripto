import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Đã kết nối database");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Lỗi database:", err.message);
  });

  await mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;
