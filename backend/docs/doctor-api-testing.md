# Doctor API Testing Guide

## Base URL
```
http://localhost:4000/api/doctor
```

## 1. GET /list
Lấy danh sách tất cả bác sĩ (không cần authentication)

**Request:**
```bash
GET http://localhost:4000/api/doctor/list
```

**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "...",
      "name": "Dr. Richard James",
      "speciality": "General physician",
      "degree": "MBBS",
      "experience": "4 Years",
      "about": "Dr. Davis has a strong commitment to delivering comprehensive medical care",
      "fee": 50,
      "address": {
        "line1": "17th Cross, Richmond",
        "line2": "Circle, Ring Road, London"
      },
      "available": true
    }
  ]
}
```

## 2. POST /login
Đăng nhập bác sĩ

**Request:**
```bash
POST http://localhost:4000/api/doctor/login
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 3. GET /appointments
Lấy danh sách cuộc hẹn của bác sĩ (cần authentication)

**Request:**
```bash
GET http://localhost:4000/api/doctor/appointments
Authorization: Bearer <doctor_token>
```

**Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "...",
      "userId": "...",
      "docId": "...",
      "slotDate": "2024-01-15",
      "slotTime": "10:00 AM",
      "userData": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "docData": {
        "name": "Dr. Richard James",
        "speciality": "General physician"
      },
      "amount": 50,
      "date": 1705305600000,
      "cancelled": false,
      "payment": false,
      "isCompleted": false
    }
  ]
}
```

## 4. POST /complete-appointment
Đánh dấu cuộc hẹn hoàn thành (cần authentication)

**Request:**
```bash
POST http://localhost:4000/api/doctor/complete-appointment
Content-Type: application/json
Authorization: Bearer <doctor_token>

{
  "appointmentId": "appointment_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment Completed"
}
```

## 5. POST /cancel-appointment
Hủy cuộc hẹn (cần authentication)

**Request:**
```bash
POST http://localhost:4000/api/doctor/cancel-appointment
Content-Type: application/json
Authorization: Bearer <doctor_token>

{
  "appointmentId": "appointment_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment Cancelled"
}
```

## 6. GET /dashboard
Lấy thông tin dashboard bác sĩ (cần authentication)

**Request:**
```bash
GET http://localhost:4000/api/doctor/dashboard
Authorization: Bearer <doctor_token>
```

**Response:**
```json
{
  "success": true,
  "dashData": {
    "earnings": 500,
    "appointments": 10,
    "patients": 8,
    "latestAppointments": [
      {
        "_id": "...",
        "slotDate": "2024-01-15",
        "slotTime": "10:00 AM",
        "userData": {
          "name": "John Doe"
        }
      }
    ]
  }
}
```

## 7. GET /profile
Lấy thông tin profile bác sĩ (cần authentication)

**Request:**
```bash
GET http://localhost:4000/api/doctor/profile
Authorization: Bearer <doctor_token>
```

**Response:**
```json
{
  "success": true,
  "profileData": {
    "_id": "...",
    "name": "Dr. Richard James",
    "email": "doctor@example.com",
    "speciality": "General physician",
    "degree": "MBBS",
    "experience": "4 Years",
    "about": "Dr. Davis has a strong commitment to delivering comprehensive medical care",
    "fee": 50,
    "address": {
      "line1": "17th Cross, Richmond",
      "line2": "Circle, Ring Road, London"
    },
    "available": true
  }
}
```

## 8. POST /update-profile
Cập nhật profile bác sĩ (cần authentication)

**Request:**
```bash
POST http://localhost:4000/api/doctor/update-profile
Content-Type: application/json
Authorization: Bearer <doctor_token>

{
  "fees": 60,
  "address": {
    "line1": "New Address Line 1",
    "line2": "New Address Line 2"
  },
  "available": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile Updated"
}
```

## Lưu ý
- Các endpoint cần authentication phải gửi kèm header `Authorization: Bearer <token>` với giá trị là token nhận được từ API login
- Token được tạo bằng JWT với secret key từ biến môi trường `JWT_SECRET`
- Middleware `authDoctor` sẽ tự động thêm `docId` vào `req.body` từ token
- Format Bearer token theo chuẩn OAuth 2.0
