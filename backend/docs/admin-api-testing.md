# Hướng dẫn Test API Admin với Postman

## Tổng quan

Tài liệu này hướng dẫn cách test các API endpoint của Admin trong hệ thống Prescripto sử dụng Postman.

**Base URL:** `http://localhost:4000/api/admin`

## Chuẩn bị môi trường

### 1. Cài đặt Postman
- Tải và cài đặt Postman từ [postman.com](https://postman.com)

### 2. Cấu hình Environment Variables
Tạo một environment trong Postman với các biến:

```
BASE_URL = http://localhost:4000
ADMIN_TOKEN = (sẽ được set sau khi login)
```

### 3. Khởi động Server
```bash
cd backend
npm start
```

---

## 1. Đăng nhập Admin

**Endpoint:** `POST /api/admin/login`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "admin@prescripto.com",
  "password": "admin123"
}
```

**Response thành công:**
```json
{
  "success": true,
  "token": "jwt_token_here"
}
```

**Response thất bại:**
```json
{
  "success": false,
  "message": "Thông tin đăng nhập không đúng"
}
```

**Test Steps:**
1. Gửi request login
2. Copy token từ response
3. Set token vào environment variable `ADMIN_TOKEN`
4. Sử dụng token này cho tất cả các API khác

**Cách setup Bearer Token trong Postman:**
- Trong tab "Authorization" của request
- Chọn type: "Bearer Token"
- Nhập `{{ADMIN_TOKEN}}` vào field Token
- Hoặc sử dụng header: `Authorization: Bearer {{ADMIN_TOKEN}}`

---

## 2. Thêm bác sĩ mới

**Endpoint:** `POST /api/admin/add-doctor`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: multipart/form-data
```

**Body (form-data):**
- `name`: Nguyễn Văn A
- `email`: doctor@example.com
- `password`: doctor123456
- `speciality`: Nội khoa
- `degree`: Bác sĩ chuyên khoa
- `experience`: 5 năm
- `about`: Bác sĩ có kinh nghiệm trong điều trị bệnh nội khoa
- `fee`: 500000
- `address`: {"line1": "123 Đường ABC", "line2": "Quận 1, TP.HCM"}
- `image`: [Chọn file ảnh]

**Response thành công:**
```json
{
  "success": true,
  "message": "Đã thêm bác sĩ"
}
```

**Response thất bại:**
```json
{
  "success": false,
  "message": "Thiếu thông tin"
}
```

**Validation Rules:**
- Tất cả fields đều bắt buộc
- Email phải hợp lệ
- Password tối thiểu 8 ký tự
- Address phải là JSON string hợp lệ
- Image là file upload

---

## 3. Lấy danh sách tất cả bác sĩ

**Endpoint:** `GET /api/admin/all-doctors`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Response thành công:**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "doctor_id",
      "name": "Nguyễn Văn A",
      "email": "doctor@example.com",
      "speciality": "Nội khoa",
      "degree": "Bác sĩ chuyên khoa",
      "experience": "5 năm",
      "about": "Bác sĩ có kinh nghiệm...",
      "fee": 500000,
      "address": {
        "line1": "123 Đường ABC",
        "line2": "Quận 1, TP.HCM"
      },
      "image": "cloudinary_image_url",
      "date": "2024-01-01T00:00:00.000Z",
      "available": true,
      "slotsBooked": {}
    }
  ]
}
```

---

## 4. Thay đổi trạng thái khả dụng của bác sĩ

**Endpoint:** `POST /api/admin/change-availability`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json
```

**Body:**
```json
{
  "docId": "doctor_id_from_all_doctors"
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Đã đổi trạng thái khả dụng"
}
```

---

## 5. Lấy tất cả lịch hẹn

**Endpoint:** `GET /api/admin/appointments`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Response thành công:**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "appointment_id",
      "userId": "user_id",
      "docId": "doctor_id",
      "slotDate": "2024-01-15",
      "slotTime": "10:00",
      "userData": {
        "name": "Nguyễn Văn B",
        "email": "user@example.com",
        "phone": "0123456789"
      },
      "docData": {
        "name": "Nguyễn Văn A",
        "speciality": "Nội khoa",
        "fee": 500000
      },
      "amount": 500000,
      "date": "2024-01-01T00:00:00.000Z",
      "cancelled": false,
      "payment": false,
      "isCompleted": false
    }
  ]
}
```

---

## 6. Hủy lịch hẹn

**Endpoint:** `POST /api/admin/cancel-appointment`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json
```

**Body:**
```json
{
  "appointmentId": "appointment_id_from_appointments"
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Đã hủy lịch hẹn"
}
```

**Lưu ý:** Khi hủy lịch hẹn, slot time sẽ được giải phóng trong `slotsBooked` của bác sĩ.

---

## 7. Dashboard thống kê

**Endpoint:** `GET /api/admin/dashboard`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Response thành công:**
```json
{
  "success": true,
  "dashData": {
    "doctors": 5,
    "patients": 100,
    "appointments": 25,
    "latestAppointments": [
      {
        "_id": "appointment_id",
        "userId": "user_id",
        "docId": "doctor_id",
        "slotDate": "2024-01-15",
        "slotTime": "10:00",
        "userData": {
          "name": "Nguyễn Văn B",
          "email": "user@example.com"
        },
        "docData": {
          "name": "Nguyễn Văn A",
          "speciality": "Nội khoa"
        },
        "amount": 500000,
        "date": "2024-01-10T00:00:00.000Z",
        "cancelled": false,
        "payment": false,
        "isCompleted": false
      }
    ]
  }
}
```

---

## Error Handling

### Common Error Responses

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Không có quyền truy cập"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Thiếu thông tin"
}
```

**Server Error:**
```json
{
  "success": false,
  "message": "Internal server error message"
}
```

### Authentication Flow
1. Gọi API login để nhận JWT token
2. Set token vào environment variable `ADMIN_TOKEN`
3. Sử dụng token cho tất cả API protected bằng header:
   ```
   Authorization: Bearer {{ADMIN_TOKEN}}
   ```

**Lưu ý:** API sử dụng chuẩn Bearer Token authentication. Header `Authorization` phải có format `Bearer <token>`.

---

## Test Scenarios

### 1. Happy Path Testing
1. ✅ Login admin thành công
2. ✅ Thêm bác sĩ mới với đầy đủ thông tin
3. ✅ Lấy danh sách bác sĩ
4. ✅ Thay đổi trạng thái bác sĩ
5. ✅ Xem dashboard thống kê

### 2. Error Testing
1. ❌ Login với thông tin sai
2. ❌ Gọi API protected mà không có token
3. ❌ Thêm bác sĩ thiếu thông tin bắt buộc
4. ❌ Thêm bác sĩ với email không hợp lệ
5. ❌ Hủy lịch hẹn không tồn tại

### 3. Edge Cases
1. 📝 Thêm bác sĩ với address JSON phức tạp
2. 📝 Upload ảnh bác sĩ với các định dạng khác nhau
3. 📝 Test với token hết hạn (nếu có implement)
4. 📝 Test đồng thời nhiều request

---

## Tips for Testing

### 1. Environment Setup
- Tạo environment riêng cho dev/staging/prod
- Sử dụng variables cho BASE_URL và tokens
- Setup Bearer Token authentication trong Authorization tab của từng request

### 2. Collection Organization
```json
{
  "info": {
    "name": "Prescripto Admin API",
    "description": "Test collection for admin endpoints"
  },
  "variable": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:4000"
    },
    {
      "key": "ADMIN_TOKEN",
      "value": ""
    }
  ]
}
```

### 3. Automated Testing
Sử dụng Postman Tests để tự động verify responses:

```javascript
// Test login và set Bearer token
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.collectionVariables.set("ADMIN_TOKEN", jsonData.token);
});

// Test authentication cho các API protected
pm.test("Authentication successful", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

// Set Authorization header trong Pre-request Script
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.collectionVariables.get("ADMIN_TOKEN")
});
```

### 4. Data Preparation
- Tạo một số bác sĩ mẫu trước khi test
- Chuẩn bị file ảnh cho test upload
- Note lại các ID để sử dụng trong các test sau

---

## Troubleshooting

### Common Issues

1. **CORS Error:** Đảm bảo server đã enable CORS
2. **Token Invalid:** Check token format và expiration
3. **File Upload Failed:** Verify multer middleware và Cloudinary config
4. **Database Connection:** Check MongoDB connection string
5. **Validation Failed:** Double-check required fields và data types

### Debug Steps
1. Check server logs trong terminal
2. Verify environment variables trong .env
3. Test với simple requests trước
4. Use Postman Console để xem request/response details