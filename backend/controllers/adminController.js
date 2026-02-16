import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import validator from "validator";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";

/**
 * Đăng nhập admin - xác thực với ADMIN_EMAIL, ADMIN_PASSWORD trong .env
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD,
        process.env.JWT_SECRET,
      );
      return res.json({ success: true, token });
    }
    res.json({ message: "Thông tin đăng nhập không đúng", success: false });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

/**
 * Thêm bác sĩ - authAdmin + multer single image. Model dùng field `fee`.
 */
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ message: "Thiếu thông tin", success: false });
    }
    if (!validator.isEmail(email)) {
      return res.json({ message: "Email không hợp lệ", success: false });
    }
    if (password.length < 8) {
      return res.json({
        message: "Mật khẩu phải từ 8 ký tự trở lên",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const doctorData = {
      about,
      address: JSON.parse(address),
      date: Date.now(),
      degree,
      email,
      experience,
      fee: Number(fees),
      image: imageUpload.secure_url,
      name,
      password: hashedPassword,
      speciality,
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ message: "Đã thêm bác sĩ", success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

/**
 * Lấy danh sách tất cả bác sĩ (không trả password)
 */
const allDoctors = async (_req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ doctors, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

/**
 * Đổi trạng thái available của bác sĩ
 */
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ message: "Đã đổi trạng thái khả dụng", success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

/**
 * Lấy tất cả lịch hẹn (admin)
 */
const appointmentsAdmin = async (_req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ appointments, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

/**
 * Hủy lịch hẹn và giải phóng slot bác sĩ
 */
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    const slotsBooked = { ...doctorData.slotsBooked };
    if (slotsBooked[slotDate]) {
      slotsBooked[slotDate] = slotsBooked[slotDate].filter(
        (e) => e !== slotTime,
      );
    }
    await doctorModel.findByIdAndUpdate(docId, { slotsBooked });

    res.json({ message: "Đã hủy lịch hẹn", success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

/**
 * Dashboard admin: số bác sĩ, appointments, patients, 5 lịch mới nhất
 */
const adminDashboard = async (_req, res) => {
  try {
    const [doctors, users, appointments] = await Promise.all([
      doctorModel.find({}),
      userModel.find({}),
      appointmentModel.find({}),
    ]);

    const latestAppointments = [...appointments].reverse().slice(0, 5);

    const dashData = {
      appointments: appointments.length,
      doctors: doctors.length,
      latestAppointments,
      patients: users.length,
    };

    res.json({ dashData, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

export {
  loginAdmin,
  addDoctor,
  allDoctors,
  changeAvailability,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};
