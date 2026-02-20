import cors from "cors";
import express from "express";
import helmet from "helmet";
import "dotenv/config";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
} from "./middlewares/errorHandler.js";
import {
  apiLimiter,
  authLimiter,
  bookingLimiter,
} from "./middlewares/rateLimiter.js";
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

// Security headers với Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);

// Request logging (development only)
app.use(requestLogger);

app.use(express.json());

// CORS configuration với origins cụ thể
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173", // Frontend
      "http://localhost:5174", // Admin
    ],
  }),
);

// Rate limiting middleware
app.use("/api/", apiLimiter); // Rate limiting cho tất cả API routes

app.get("/", (_req, res) => {
  res.send("API đang hoạt động");
});

// Auth rate limiting cho login endpoints
app.use("/api/admin/login", authLimiter);
app.use("/api/doctor/login", authLimiter);
app.use("/api/user/login", authLimiter);

// Booking rate limiting
app.use("/api/user/book-appointment", bookingLimiter);

app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/user", userRoute);

// Error handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => console.log("Server đã khởi động trên PORT:", port));
