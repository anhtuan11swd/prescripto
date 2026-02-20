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
        { email: process.env.ADMIN_EMAIL, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
      return res.json({
        admin: { email: process.env.ADMIN_EMAIL },
        message: "Đăng nhập thành công",
        success: true,
        token,
      });
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
      fee,
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
      !fee ||
      !address ||
      !imageFile
    ) {
      return res.json({ message: "Thiếu thông tin hoặc ảnh", success: false });
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

    const imageUpload = await cloudinary.uploader.upload(
      `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`,
      {
        resource_type: "image",
      },
    );

    const doctorData = {
      about,
      address: JSON.parse(address),
      date: Date.now(),
      degree,
      email,
      experience,
      fee: Number(fee),
      image: imageUpload.secure_url,
      name,
      password: hashedPassword,
      speciality,
    };

    const newDoctor = new doctorModel(doctorData);
    const savedDoctor = await newDoctor.save();

    res.json({
      doctor: {
        available: savedDoctor.available,
        email: savedDoctor.email,
        id: savedDoctor._id,
        name: savedDoctor.name,
        speciality: savedDoctor.speciality,
      },
      message: "Đã thêm bác sĩ thành công",
      success: true,
    });
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
    const newAvailability = !docData.available;

    await doctorModel.findByIdAndUpdate(docId, {
      available: newAvailability,
    });

    res.json({
      doctor: {
        available: newAvailability,
        id: docId,
        name: docData.name,
      },
      message: "Đã đổi trạng thái khả dụng",
      success: true,
    });
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

    res.json({
      appointment: {
        cancelled: true,
        id: appointmentId,
        slotDate: slotDate,
        slotTime: slotTime,
      },
      message: "Đã hủy lịch hẹn thành công",
      success: true,
    });
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

    // Thống kê bổ sung
    const totalRevenue = appointments
      .filter((apt) => !apt.cancelled && apt.isCompleted)
      .reduce((sum, apt) => sum + apt.amount, 0);

    const cancelledAppointments = appointments.filter(
      (apt) => apt.cancelled,
    ).length;
    const completedAppointments = appointments.filter(
      (apt) => apt.isCompleted,
    ).length;
    const pendingAppointments = appointments.filter(
      (apt) => !apt.cancelled && !apt.isCompleted,
    ).length;

    const dashData = {
      appointments: appointments.length,
      cancelledAppointments,
      completedAppointments,
      doctors: doctors.length,
      earnings: totalRevenue,
      latestAppointments,
      patients: users.length,
      pendingAppointments,
      totalRevenue,
    };

    res.json({
      dashData,
      message: "Lấy dữ liệu dashboard thành công",
      success: true,
    });
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
