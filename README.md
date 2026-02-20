# Prescripto - Hệ thống Đặt lịch Khám bệnh Trực tuyến

Prescripto là một nền tảng đặt lịch khám bệnh trực tuyến toàn diện, được xây dựng bằng MERN stack (MongoDB, Express.js, React, Node.js). Hệ thống cho phép bệnh nhân đặt lịch hẹn với bác sĩ, bác sĩ quản lý lịch hẹn của mình, và quản trị viên quản lý toàn bộ hệ thống.

## 🌟 Tính năng chính

### Dành cho Bệnh nhân (Frontend)
- 🔐 Đăng ký và đăng nhập tài khoản
- 👤 Quản lý hồ sơ cá nhân (thông tin, ảnh đại diện)
- 🔍 Tìm kiếm và xem danh sách bác sĩ theo chuyên khoa
- 📅 Đặt lịch hẹn với bác sĩ
- 📋 Xem lịch sử lịch hẹn
- ❌ Hủy lịch hẹn
- 💳 Thanh toán trực tuyến (Razorpay integration)

### Dành cho Bác sĩ (Admin Panel)
- 🔐 Đăng nhập hệ thống
- 📊 Dashboard thống kê (thu nhập, lịch hẹn, bệnh nhân)
- 📅 Xem và quản lý lịch hẹn
- ✅ Xác nhận hoàn thành lịch hẹn
- ❌ Hủy lịch hẹn
- 👤 Cập nhật thông tin cá nhân (phí khám, địa chỉ, trạng thái khả dụng)

### Dành cho Quản trị viên (Admin Panel)
- 🔐 Đăng nhập quản trị
- 📊 Dashboard tổng quan (số lượng bác sĩ, bệnh nhân, lịch hẹn)
- ➕ Thêm bác sĩ mới vào hệ thống
- 📋 Quản lý danh sách bác sĩ
- 🔄 Thay đổi trạng thái khả dụng của bác sĩ
- 📅 Xem tất cả lịch hẹn trong hệ thống
- ❌ Hủy lịch hẹn

## 🏗️ Kiến trúc hệ thống

```
prescripto/
├── backend/          # Node.js + Express API Server
├── frontend/         # React App cho bệnh nhân
└── admin/            # React App cho bác sĩ và quản trị viên
```

### Tech Stack

#### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB với Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer + Cloudinary
- **Security:** Helmet, CORS, bcrypt
- **Rate Limiting:** express-rate-limit
- **Payment:** Razorpay
- **Validation:** validator

#### Frontend & Admin
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Icons:** Lucide React (Admin)
- **Code Quality:** Biome, ESLint

## 📋 Yêu cầu hệ thống

- Node.js >= 18.x
- MongoDB >= 6.x
- npm hoặc yarn
- Tài khoản Cloudinary (cho upload ảnh)
- Tài khoản Razorpay (cho thanh toán - tùy chọn)

## 🚀 Cài đặt và Chạy dự án

### 1. Clone repository

```bash
git clone <repository-url>
cd prescripto
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cấu hình file `.env`:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prescripto

# Server
PORT=4000

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret_key

# Admin Credentials
ADMIN_EMAIL=admin@prescripto.com
ADMIN_PASSWORD=admin123
```

Khởi động Backend:

```bash
# Development mode với nodemon
npm run dev

# Production mode
npm start
```

Backend sẽ chạy tại: `http://localhost:4000`

### 3. Cài đặt Frontend

```bash
cd frontend
npm install
```

Tạo file `.env`:

```bash
cp .env.example .env
```

Cấu hình:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Khởi động Frontend:

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### 4. Cài đặt Admin Panel

```bash
cd admin
npm install
```

Tạo file `.env`:

```bash
cp .env.example .env
```

Cấu hình:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_ADMIN_EMAIL=admin@prescripto.com
VITE_ADMIN_PASSWORD=admin123
```

Khởi động Admin:

```bash
npm run dev
```

Admin Panel sẽ chạy tại: `http://localhost:5174`

## 📚 API Documentation

### Base URLs

- Backend API: `http://localhost:4000/api`
- Admin API: `http://localhost:4000/api/admin`
- Doctor API: `http://localhost:4000/api/doctor`
- User API: `http://localhost:4000/api/user`

### Authentication

Hệ thống sử dụng JWT Bearer Token authentication:

```
Authorization: Bearer <token>
```

### API Endpoints

#### Admin APIs
- `POST /api/admin/login` - Đăng nhập admin
- `POST /api/admin/add-doctor` - Thêm bác sĩ mới
- `GET /api/admin/all-doctors` - Lấy danh sách bác sĩ
- `POST /api/admin/change-availability` - Thay đổi trạng thái bác sĩ
- `GET /api/admin/appointments` - Lấy tất cả lịch hẹn
- `POST /api/admin/cancel-appointment` - Hủy lịch hẹn
- `GET /api/admin/dashboard` - Dashboard thống kê

#### Doctor APIs
- `POST /api/doctor/login` - Đăng nhập bác sĩ
- `GET /api/doctor/list` - Lấy danh sách bác sĩ (public)
- `GET /api/doctor/appointments` - Lấy lịch hẹn của bác sĩ
- `POST /api/doctor/complete-appointment` - Hoàn thành lịch hẹn
- `POST /api/doctor/cancel-appointment` - Hủy lịch hẹn
- `GET /api/doctor/dashboard` - Dashboard bác sĩ
- `GET /api/doctor/profile` - Lấy thông tin profile
- `POST /api/doctor/update-profile` - Cập nhật profile

#### User APIs
- `POST /api/user/register` - Đăng ký tài khoản
- `POST /api/user/login` - Đăng nhập
- `GET /api/user/get-profile` - Lấy thông tin profile
- `POST /api/user/update-profile` - Cập nhật profile
- `POST /api/user/book-appointment` - Đặt lịch hẹn
- `GET /api/user/appointments` - Lấy danh sách lịch hẹn
- `POST /api/user/cancel-appointment` - Hủy lịch hẹn

Chi tiết API testing: Xem thư mục `backend/docs/`

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: { line1: String, line2: String },
  dob: Date,
  gender: String,
  image: String (Cloudinary URL)
}
```

### Doctor Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  speciality: String,
  degree: String,
  experience: String,
  about: String,
  fee: Number,
  address: { line1: String, line2: String },
  image: String (Cloudinary URL),
  available: Boolean,
  slotsBooked: Object,
  date: Date
}
```

### Appointment Model
```javascript
{
  userId: ObjectId (ref: User),
  docId: ObjectId (ref: Doctor),
  slotDate: String,
  slotTime: String,
  userData: Object,
  docData: Object,
  amount: Number,
  date: Number,
  cancelled: Boolean,
  payment: Boolean,
  isCompleted: Boolean
}
```

## 🔒 Bảo mật

- **Password Hashing:** bcrypt với salt rounds
- **JWT Authentication:** Secure token-based auth
- **Rate Limiting:** 
  - API general: 100 requests/15 phút
  - Auth endpoints: 5 requests/15 phút
  - Booking: 10 requests/15 phút
- **Security Headers:** Helmet middleware
- **CORS:** Configured cho specific origins
- **Input Validation:** validator library
- **Environment Variables:** Sensitive data trong .env

## 📁 Cấu trúc thư mục Backend

```
backend/
├── config/
│   ├── cloudinary.js      # Cloudinary configuration
│   └── mongodb.js          # MongoDB connection
├── controllers/
│   ├── adminController.js  # Admin business logic
│   ├── doctorController.js # Doctor business logic
│   └── userController.js   # User business logic
├── middleware/
│   ├── authAdmin.js        # Admin authentication
│   ├── authDoctor.js       # Doctor authentication
│   ├── authUser.js         # User authentication
│   └── multer.js           # File upload handling
├── middlewares/
│   ├── errorHandler.js     # Error handling
│   └── rateLimiter.js      # Rate limiting
├── models/
│   ├── appointmentModel.js # Appointment schema
│   ├── doctorModel.js      # Doctor schema
│   └── userModel.js        # User schema
├── routes/
│   ├── adminRoute.js       # Admin routes
│   ├── doctorRoute.js      # Doctor routes
│   └── userRoute.js        # User routes
├── seeds/
│   └── doctor.js           # Seed doctors data
├── docs/                   # API documentation
├── .env                    # Environment variables
└── server.js               # Entry point
```

## 🎨 Cấu trúc Frontend/Admin

```
src/
├── assets/                 # Images, icons, SVGs
├── components/             # Reusable components
│   ├── Navbar.jsx
│   └── Sidebar.jsx
├── context/                # React Context
│   ├── AdminContext.jsx
│   ├── AppContext.jsx
│   └── DoctorContext.jsx
├── pages/                  # Page components
│   ├── Admin/
│   │   ├── AddDoctor.jsx
│   │   ├── AllAppointments.jsx
│   │   ├── Dashboard.jsx
│   │   └── DoctorsList.jsx
│   ├── Doctor/
│   │   ├── DoctorAppointments.jsx
│   │   ├── DoctorDashboard.jsx
│   │   └── DoctorProfile.jsx
│   └── Login.jsx
├── App.jsx                 # Main app component
└── main.jsx                # Entry point
```

## 🧪 Testing

### Backend Testing với Postman

1. Import Postman collection từ `backend/docs/`
2. Setup environment variables
3. Test theo thứ tự:
   - Admin login → Add doctor → Manage doctors
   - Doctor login → View appointments → Update profile
   - User register → Login → Book appointment

### Scripts có sẵn

```bash
# Backend
npm run dev          # Development với nodemon
npm start            # Production
npm run seed         # Seed dữ liệu bác sĩ
npm run format       # Format code với Biome
npm run lint         # Lint code
npm run check        # Check và fix code

# Frontend/Admin
npm run dev          # Development server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run format       # Format code
```

## 🌐 Deployment

### Backend Deployment

1. Setup MongoDB Atlas
2. Setup Cloudinary account
3. Configure environment variables
4. Deploy to platforms: Heroku, Railway, Render, hoặc VPS

### Frontend/Admin Deployment

1. Build production:
```bash
npm run build
```

2. Deploy `dist` folder to: Vercel, Netlify, hoặc static hosting

3. Update `VITE_BACKEND_URL` với production API URL

## 🔧 Troubleshooting

### Common Issues

1. **CORS Error**
   - Kiểm tra CORS configuration trong `server.js`
   - Đảm bảo frontend URL được thêm vào allowed origins

2. **Database Connection Failed**
   - Verify MongoDB URI trong `.env`
   - Check network access trong MongoDB Atlas

3. **File Upload Failed**
   - Verify Cloudinary credentials
   - Check multer middleware configuration

4. **Authentication Error**
   - Verify JWT_SECRET trong `.env`
   - Check token format: `Bearer <token>`

5. **Rate Limit Exceeded**
   - Đợi 15 phút hoặc restart server (development)
   - Adjust rate limit trong `rateLimiter.js`

## 📝 Scripts hữu ích

```bash
# Seed dữ liệu bác sĩ mẫu
cd backend
npm run seed

# Format toàn bộ code
npm run format

# Check code quality
npm run check

# Build production
cd frontend && npm run build
cd admin && npm run build
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 License

ISC License

## 👨‍💻 Author

Trần Anh Tuấn

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trong repository.

---

**Note:** Đây là dự án học tập/demo. Để sử dụng trong production, cần thêm các tính năng bảo mật và testing đầy đủ hơn.
