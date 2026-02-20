import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  amount: { required: true, type: Number },
  cancelled: { default: false, type: Boolean },
  date: { required: true, type: Number },
  docData: { required: true, type: Object },
  docId: { required: true, type: String },
  isCompleted: { default: false, type: Boolean },
  payment: { default: false, type: Boolean },
  slotDate: { required: true, type: String },
  slotTime: { required: true, type: String },
  userData: { required: true, type: Object },
  userId: { required: true, type: String },
});

// Indexes for frequently queried fields
appointmentSchema.index({ docId: 1, slotDate: 1 });
appointmentSchema.index({ userId: 1 });
appointmentSchema.index({ date: -1 });

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
