import rateLimit from "express-rate-limit";

// Rate limiter cho API endpoints chung
export const apiLimiter = rateLimit({
  legacyHeaders: false,
  max: 1000, // Giới hạn 1000 requests per windowMs (tăng cho dev)
  message: {
    message: "Quá nhiều requests, vui lòng thử lại sau",
    success: false,
  },
  standardHeaders: true,
  windowMs: 15 * 60 * 1000, // 15 phút
});

// Rate limiter nghiêm ngặt hơn cho authentication endpoints
export const authLimiter = rateLimit({
  legacyHeaders: false,
  max: 50, // Cho phép 50 login attempts per windowMs (tăng cho dev)
  message: {
    message: "Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 15 phút",
    success: false,
  },
  standardHeaders: true,
  windowMs: 15 * 60 * 1000, // 15 phút
});

// Rate limiter cho booking appointments
export const bookingLimiter = rateLimit({
  legacyHeaders: false,
  max: 100, // Giới hạn 100 bookings per giờ (tăng cho dev)
  message: {
    message: "Quá nhiều lần đặt lịch, vui lòng thử lại sau",
    success: false,
  },
  standardHeaders: true,
  windowMs: 60 * 60 * 1000, // 1 giờ
});
