import fs from "node:fs";
import path from "node:path";

// Tạo thư mục logs nếu chưa tồn tại
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Hàm ghi log lỗi
const logError = (error, req = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    ip: req?.ip,
    level: "ERROR",
    message: error.message,
    method: req?.method,
    stack: error.stack,
    timestamp,
    url: req?.url,
    userAgent: req?.get("User-Agent"),
  };

  const logFile = path.join(
    logsDir,
    `${new Date().toISOString().split("T")[0]}.log`,
  );
  const logLine = `${JSON.stringify(logEntry)}\n`;

  fs.appendFileSync(logFile, logLine);
  console.error(`[${timestamp}] ERROR:`, error.message);
};

// Middleware xử lý lỗi 404
export const notFoundHandler = (req, _res, next) => {
  const error = new Error(`Không tìm thấy route: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// Middleware xử lý lỗi tổng quát
export const errorHandler = (error, req, res, _next) => {
  // Ghi log lỗi
  logError(error, req);

  // Đặt status code
  const statusCode = error.status || 500;

  // Chuẩn bị response
  const response = {
    message:
      process.env.NODE_ENV === "production"
        ? "Đã xảy ra lỗi server"
        : error.message,
    success: false,
  };

  // Thêm stack trace trong development
  if (process.env.NODE_ENV !== "production") {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

// Middleware xử lý lỗi async
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware ghi log requests (development only)
export const requestLogger = (req, _res, next) => {
  if (process.env.NODE_ENV === "development") {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
  }
  next();
};
