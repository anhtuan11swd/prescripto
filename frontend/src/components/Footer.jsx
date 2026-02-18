import { assets } from "../assets/assets.js";

const Footer = () => (
  <div className="md:mx-10">
    <div className="flex flex-col gap-14 sm:grid grid-cols-[3fr_1fr_1fr] my-10 mt-40 text-sm">
      <div>
        <img alt="Prescripto" className="mb-5 w-40" src={assets.logo} />
        <p className="w-full md:w-2/3 text-gray-600 leading-6">
          Chúng tôi cung cấp nền tảng đặt lịch hẹn khám bệnh trực tuyến uy tín,
          giúp bạn dễ dàng kết nối với các bác sĩ chuyên nghiệp và đặt lịch hẹn
          nhanh chóng.
        </p>
      </div>

      <div>
        <p className="mb-5 font-medium text-xl">CÔNG TY</p>
        <ul className="flex flex-col gap-2 text-gray-600">
          <li>Trang chủ</li>
          <li>Về chúng tôi</li>
          <li>Dịch vụ</li>
          <li>Chính sách bảo mật</li>
        </ul>
      </div>

      <div>
        <p className="mb-5 font-medium text-xl">LIÊN HỆ</p>
        <ul className="flex flex-col gap-2 text-gray-600">
          <li>+84-848-995-246</li>
          <li>anhtuan11.swd@gmail.com</li>
        </ul>
      </div>
    </div>

    <div>
      <hr />
      <p className="py-5 text-sm text-center">
        Bản quyền 2026 @ Trần Anh Tuấn - Tất cả các quyền được bảo lưu.
      </p>
    </div>
  </div>
);

export default Footer;
