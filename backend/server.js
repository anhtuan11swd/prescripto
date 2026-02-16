import cors from "cors";
import express from "express";
import "dotenv/config";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";
import adminRoute from "./routes/adminRoute.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send("API đang hoạt động");
});

app.use("/api/admin", adminRoute);

app.listen(port, () => console.log("Server đã khởi động trên PORT:", port));
