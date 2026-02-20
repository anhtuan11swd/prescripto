# Hướng dẫn Test API User với Postman

## Tổng quan

Tài liệu này hướng dẫn cách test các API endpoint của User trong hệ thống Prescripto sử dụng Postman.

**Base URL:** `http://localhost:4000/api/user`

## Chuẩn bị môi trường

### 1. Cài đặt Postman
- Tải và cài đặt Postman từ [postman.com](https://postman.com)

### 2. Cấu hình Environment Variables
Tạo một environment trong Postman với các biến:

```
BASE_URL = http://localhost:4000
USER_TOKEN = (sẽ được set sau khi login)
USER_ID = (sẽ được set sau khi login hoặc lấy profile)
```

### 3. Khởi động Server
```bash
cd backend
npm start
```

---

## 1. Đăng ký tài khoản người dùng

**Endpoint:** `POST /api/user/register`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123"
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
  "message": "Thiếu thông tin"
}
```

**Validation Rules:**
- Tất cả fields đều bắt buộc (name, email, password)
- Email phải có format hợp lệ
- Password tối thiểu 8 ký tự

**Test Steps:**
1. Gửi request đăng ký với thông tin hợp lệ
2. Copy token từ response
3. Set token vào environment variable `USER_TOKEN`

---

## 2. Đăng nhập người dùng

**Endpoint:** `POST /api/user/login`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123"
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
  "message": "Sai thông tin đăng nhập"
}
```

**Test Steps:**
1. Gửi request login với thông tin đã đăng ký
2. Copy token từ response
3. Set token vào environment variable `USER_TOKEN`
4. Sử dụng token này cho tất cả các API khác

**Cách setup Bearer Token trong Postman:**
- Trong tab "Authorization" của request
- Chọn type: "Bearer Token"
- Nhập `{{USER_TOKEN}}` vào field Token
- Hoặc sử dụng header: `Authorization: Bearer {{USER_TOKEN}}`

---

## 3. Lấy thông tin hồ sơ

**Endpoint:** `GET /api/user/get-profile`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "userId": "6992ae0a58568c075072b14e"
}
```

**Response thành công:**
```json
{
  "success": true,
  "userData": {
    "_id": "user_id",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "address": {
      "line1": "123 Đường ABC",
      "line2": "Quận 1, TP.HCM"
    },
    "dob": "1990-01-01",
    "gender": "Nam",
    "image": "cloudinary_image_url"
  }
}
```

**Response thất bại:**
```json
{
  "success": false,
  "message": "Không tìm thấy người dùng"
}
```

**Lưu ý:** 
- API này yêu cầu authentication
- Cần truyền userId trong body request
- Password sẽ không được trả về trong response

---

## 4. Cập nhật hồ sơ người dùng

**Endpoint:** `POST /api/user/update-profile`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: multipart/form-data
```

**Body (form-data):**
- `userId`: {{USER_ID}}
- `name`: Nguyễn Văn B (đã cập nhật)
- `phone`: 0123456789
- `address`: {"line1": "456 Đường XYZ", "line2": "Quận 2, TP.HCM"}
- `dob`: 1990-01-01
- `gender`: Nam
- `image`: [Chọn file ảnh - tùy chọn]

**Response thành công:**
```json
{
  "success": true,
  "message": "Đã cập nhật hồ sơ"
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
- Tất cả fields đều bắt buộc: userId, name, phone, dob, gender
- Address phải là JSON string hợp lệ
- Image là file upload tùy chọn (nếu có sẽ upload lên Cloudinary)

---

## 5. Đặt lịch hẹn với bác sĩ

**Endpoint:** `POST /api/user/book-appointment`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "userId": "{{USER_ID}}",
  "docId": "doctor_id_from_doctor_list",
  "slotDate": "2024-01-15",
  "slotTime": "10:00"
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Đã đặt lịch"
}
```

**Response thất bại:**
```json
{
  "success": false,
  "message": "Bác sĩ không tồn tại"
}
```

**Validation Rules:**
- Tất cả fields đều bắt buộc
- Bác sĩ phải tồn tại và khả dụng (available: true)
- Slot time phải còn trống (không có trong slotsBooked)
- Date format: YYYY-MM-DD
- Time format: HH:mm

**Lưu ý:**
- Sau khi đặt lịch thành công, slot sẽ được đánh dấu là đã đặt trong `slotsBooked` của bác sĩ

---

## 6. Lấy danh sách lịch hẹn

**Endpoint:** `GET /api/user/appointments`

**Method:** GET

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "userId": "{{USER_ID}}"
}
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
        "name": "Nguyễn Văn A",
        "email": "user@example.com",
        "phone": "0123456789"
      },
      "docData": {
        "name": "Nguyễn Văn Bác sĩ",
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

**Response thất bại:**
```json
{
  "success": false,
  "message": "Lỗi server"
}
```

---

## 7. Hủy lịch hẹn

**Endpoint:** `POST /api/user/cancel-appointment`

**Method:** POST

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "userId": "{{USER_ID}}",
  "appointmentId": "appointment_id_from_appointments_list"
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Đã hủy lịch hẹn"
}
```

**Response thất bại:**
```json
{
  "success": false,
  "message": "Lịch hẹn không tồn tại"
}
```

**Validation Rules:**
- appointmentId phải tồn tại
- Chỉ user sở hữu lịch hẹn mới có thể hủy
- Lịch hẹn chưa bị hủy trước đó

**Lưu ý:**
- Khi hủy lịch hẹn thành công, slot time sẽ được giải phóng trong `slotsBooked` của bác sĩ
- Status `cancelled` sẽ được set thành `true`

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

**Not Found:**
```json
{
  "success": false,
  "message": "Bác sĩ không tồn tại"
}
```

**Forbidden:**
```json
{
  "success": false,
  "message": "Không có quyền thực hiện"
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
1. Đăng ký hoặc đăng nhập để nhận JWT token
2. Set token vào environment variable `USER_TOKEN`
3. Sử dụng token cho tất cả API protected bằng header:
   ```
   Authorization: Bearer {{USER_TOKEN}}
   ```

**Lưu ý:** API sử dụng chuẩn Bearer Token authentication. Header `Authorization` phải có format `Bearer <token>`.

---

## Test Scenarios

### 1. Happy Path Testing
1. Đăng ký tài khoản thành công
2. Đăng nhập với thông tin hợp lệ
3. Lấy thông tin hồ sơ cá nhân
4. Cập nhật hồ sơ với đầy đủ thông tin
5. Đặt lịch hẹn với bác sĩ khả dụng
6. Xem danh sách lịch hẹn
7. Hủy lịch hẹn thành công

### 2. Error Testing
1. Đăng ký với thông tin thiếu
2. Đăng ký với email không hợp lệ
3. Đăng nhập với thông tin sai
4. Gọi API protected mà không có token
5. Cập nhật profile thiếu thông tin bắt buộc
6. Đặt lịch với bác sĩ không tồn tại
7. Đặt lịch với slot đã được đặt
8. Hủy lịch hẹn không sở hữu

### 3. Edge Cases
1. 📝 Đặt lịch với address JSON phức tạp
2. 📝 Upload ảnh profile với các định dạng khác nhau
3. 📝 Test với token hết hạn (nếu có implement)
4. 📝 Test đồng thời nhiều request đặt lịch
5. 📝 Hủy lịch hẹn ngay trước giờ hẹn

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
    "name": "Prescripto User API",
    "description": "Test collection for user endpoints"
  },
  "variable": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:4000"
    },
    {
      "key": "USER_TOKEN",
      "value": ""
    },
    {
      "key": "USER_ID",
      "value": ""
    }
  ]
}
```

### 3. Automated Testing
Sử dụng Postman Tests để tự động verify responses:

```javascript
// Test đăng ký/đăng nhập và set Bearer token
pm.test("Authentication successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    if (jsonData.token) {
        pm.collectionVariables.set("USER_TOKEN", jsonData.token);
    }
});

// Test response structure
pm.test("Response has expected structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.a('boolean');
});

// Set Authorization header trong Pre-request Script
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.collectionVariables.get("USER_TOKEN")
});

// Test validation cho required fields
pm.test("Validation works", function () {
    var jsonData = pm.response.json();
    if (!jsonData.success) {
        pm.expect(jsonData).to.have.property('message');
    }
});
```

### 4. Data Preparation
- Tạo tài khoản user mẫu trước khi test
- Chuẩn bị file ảnh cho test upload profile
- Tạo một số bác sĩ mẫu qua admin API để test đặt lịch
- Note lại các ID (userId, doctorId, appointmentId) để sử dụng trong test

---

## Dependencies & Prerequisites

### 1. Admin API Setup
Trước khi test User API, cần setup dữ liệu qua Admin API:
- Tạo ít nhất 1 bác sĩ để test đặt lịch hẹn
- Đảm bảo có bác sĩ với `available: true`

### 2. Environment Variables
Đảm bảo server có các environment variables:
```env
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

### 3. Database Models
Đảm bảo các models đã được setup đúng:
- `userModel`: name, email, password, phone, address, dob, gender, image
- `doctorModel`: name, email, speciality, degree, experience, about, fee, address, image, available, slotsBooked
- `appointmentModel`: userId, docId, slotDate, slotTime, userData, docData, amount, date, cancelled, payment, isCompleted

---

## Troubleshooting

### Common Issues

1. **CORS Error:** Đảm bảo server đã enable CORS
2. **Token Invalid:** Check token format và expiration
3. **File Upload Failed:** Verify multer middleware và Cloudinary config
4. **Database Connection:** Check MongoDB connection string
5. **Validation Failed:** Double-check required fields và data types
6. **Slots Booked Logic:** Đảm bảo slotsBooked được cập nhật đúng khi đặt/hủy lịch

### Debug Steps
1. Check server logs trong terminal
2. Verify environment variables trong .env
3. Test với simple requests trước (register/login)
4. Use Postman Console để xem request/response details
5. Verify database data trực tiếp qua MongoDB Compass
6. Test từng API riêng lẻ trước khi test flow hoàn chỉnh

### Common Validation Messages
- "Thiếu thông tin" - Missing required fields
- "Email không hợp lệ" - Invalid email format
- "Mật khẩu phải từ 8 ký tự trở lên" - Password too short
- "Người dùng không tồn tại" - User not found
- "Sai thông tin đăng nhập" - Wrong login credentials
- "Bác sĩ không tồn tại" - Doctor not found
- "Bác sĩ hiện không nhận lịch" - Doctor not available
- "Slot không còn trống" - Slot already booked
- "Lịch hẹn không tồn tại" - Appointment not found
- "Không có quyền thực hiện" - Unauthorized action