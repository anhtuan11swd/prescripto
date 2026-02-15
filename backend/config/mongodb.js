import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  mongoose.connection.on("connected", () => {
    console.log("Đã kết nối database");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Lỗi database:", err.message);
  });
};

export default connectDB;
