import cors from "cors";
import express from "express";
import "dotenv/config";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";
import adminRoute from "./routes/adminRoute.js";
import doctorRoute from "./routes/doctorRoute.js";
import userRoute from "./routes/userRoute.js";
import seedDoctors from "./seeds/doctor.js";

const app = express();
const port = process.env.PORT || 4000;

// Kết nối database và cloudinary
await connectDB();
connectCloudinary();

// Seed dữ liệu bác sĩ nếu database rỗng
await seedDoctors();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send("API đang hoạt động");
});

app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/user", userRoute);

app.listen(port, () => console.log("Server đã khởi động trên PORT:", port));
