import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import validator from "validator";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
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

    const newUser = new userModel({ email, name, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: _, ...userData } = user.toObject();
    res.json({ success: true, token, user: userData });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ message: "Người dùng không tồn tại", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Sai thông tin đăng nhập", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: _, ...userData } = user.toObject();
    res.json({ success: true, token, user: userData });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // Lấy từ req thay vì req.body
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ message: "Thiếu thông tin", success: false });
    }

    const updatePayload = {
      address: typeof address === "string" ? JSON.parse(address) : address,
      dob,
      gender,
      name,
      phone,
    };

    await userModel.findByIdAndUpdate(userId, updatePayload);

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(
        `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`,
        { resource_type: "image" },
      );
      await userModel.findByIdAndUpdate(userId, {
        image: imageUpload.secure_url,
      });
    }

    const updatedUser = await userModel.findById(userId).select("-password");

    res.json({
      message: "Đã cập nhật hồ sơ",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi trong hàm updateProfile:", error);
    res.json({ message: error.message, success: false });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId; // Lấy từ req thay vì req.body
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData) {
      return res.json({ message: "Bác sĩ không tồn tại", success: false });
    }
    if (!docData.available) {
      return res.json({
        message: "Bác sĩ hiện không nhận lịch",
        success: false,
      });
    }

    const slotsBooked = { ...(docData.slotsBooked || {}) };

    if (slotsBooked[slotDate]?.includes(slotTime)) {
      return res.json({ message: "Slot không còn trống", success: false });
    }
    if (!slotsBooked[slotDate]) slotsBooked[slotDate] = [];
    slotsBooked[slotDate].push(slotTime);

    const userData = await userModel.findById(userId).select("-password");
    const docDataForAppointment = docData.toObject
      ? docData.toObject()
      : { ...docData };
    delete docDataForAppointment.slotsBooked;

    const appointmentPayload = {
      amount: docData.fee,
      date: Date.now(),
      docData: docDataForAppointment,
      docId,
      slotDate,
      slotTime,
      userData,
      userId,
    };

    const newAppointment = new appointmentModel(appointmentPayload);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slotsBooked });

    res.json({
      appointment: newAppointment,
      message: "Đã đặt lịch",
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

const listAppointment = async (req, res) => {
  try {
    const userId = req.userId; // Lấy từ req thay vì req.body
    const appointments = await appointmentModel.find({ userId });
    res.json({ appointments, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId; // Lấy từ req thay vì req.body
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ message: "Lịch hẹn không tồn tại", success: false });
    }
    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.json({ message: "Không có quyền thực hiện", success: false });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    const slotsBooked = { ...(doctorData.slotsBooked || {}) };
    if (slotsBooked[slotDate]) {
      slotsBooked[slotDate] = slotsBooked[slotDate].filter(
        (e) => e !== slotTime,
      );
    }
    await doctorModel.findByIdAndUpdate(docId, { slotsBooked });

    const cancelledAppointment = await appointmentModel.findById(appointmentId);
    res.json({
      appointment: cancelledAppointment,
      message: "Đã hủy lịch hẹn",
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
};
