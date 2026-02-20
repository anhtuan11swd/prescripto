import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";

// API lấy danh sách bác sĩ
const doctorList = async (_req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    res.json({ doctors, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// API đăng nhập bác sĩ
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({
        message: "Thông tin đăng nhập không hợp lệ",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({
        doctor: {
          email: doctor.email,
          id: doctor._id,
          image: doctor.image,
          name: doctor.name,
          speciality: doctor.speciality,
        },
        success: true,
        token,
      });
    } else {
      res.json({ message: "Thông tin đăng nhập không hợp lệ", success: false });
    }
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// API lấy danh sách cuộc hẹn của bác sĩ
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.docId; // Từ middleware authDoctor

    const appointments = await appointmentModel.find({ docId });

    res.json({
      appointments,
      count: appointments.length,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// API đánh dấu cuộc hẹn hoàn thành
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.docId; // Từ middleware authDoctor
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (
      appointmentData &&
      appointmentData.docId.toString() === docId.toString()
    ) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ message: "Cuộc hẹn đã hoàn thành", success: true });
    }
    return res.json({ message: "Đánh dấu thất bại", success: false });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// API hủy cuộc hẹn
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.docId; // Từ middleware authDoctor
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (
      appointmentData &&
      appointmentData.docId.toString() === docId.toString()
    ) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ message: "Cuộc hẹn đã bị hủy", success: true });
    }
    return res.json({ message: "Hủy thất bại", success: false });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// API dashboard bác sĩ
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId; // Từ middleware authDoctor
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let pendingCount = 0;

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
        completedCount++;
      }
      if (item.cancelled) {
        cancelledCount++;
      }
      if (!item.isCompleted && !item.cancelled) {
        pendingCount++;
      }
    });

    const patients = [];
    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      appointments: appointments.length,
      cancelledAppointments: cancelledCount,
      completedAppointments: completedCount,
      earnings,
      latestAppointments: appointments.reverse().slice(0, 5),
      patients: patients.length,
      pendingAppointments: pendingCount,
    };

    res.json({ dashData, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// API lấy thông tin profile bác sĩ
const doctorProfile = async (req, res) => {
  try {
    const docId = req.docId; // Từ middleware authDoctor

    const profileData = await doctorModel.findById(docId).select("-password");

    res.json({ profileData, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// API cập nhật profile bác sĩ
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId; // From authDoctor middleware
    const { fee, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, {
      address,
      available,
      fee,
    });

    res.json({ message: "Hồ sơ đã được cập nhật", success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

export {
  appointmentCancel,
  appointmentComplete,
  appointmentsDoctor,
  doctorDashboard,
  doctorList,
  doctorProfile,
  loginDoctor,
  updateDoctorProfile,
};
