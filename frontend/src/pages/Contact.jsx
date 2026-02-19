import { assets } from "../assets/assets";

const Contact = () => (
  <div>
    <div className="pt-10 text-[#707070] text-2xl text-center">
      <p>
        LIÊN HỆ{" "}
        <span className="font-semibold text-gray-700">VỚI CHÚNG TÔI</span>
      </p>
    </div>

    <div className="flex md:flex-row flex-col justify-center gap-10 my-10 mb-28 text-sm">
      <img
        alt="Contact Prescripto"
        className="w-full md:max-w-[360px]"
        src={assets.contact_image}
      />

      <div className="flex flex-col justify-center items-start gap-6">
        <p className="font-semibold text-gray-600 text-lg">
          VĂN PHÒNG CỦA CHÚNG TÔI
        </p>

        <p className="text-gray-500">
          12 Nguyễn Văn Bảo <br />
          Phường Hạnh Thông, Thành phố Hồ Chí Minh
        </p>

        <p className="text-gray-500">
          Tel: +84-848-995-246 <br />
          Email: anhtuan11.swd@gmail.com
        </p>

        <p className="font-semibold text-gray-600 text-lg">
          CƠ HỘI NGHỀ NGHIỆP TẠI PRESCRIPTO
        </p>

        <p className="text-gray-500">
          Tìm hiểu thêm về đội ngũ và các vị trí tuyển dụng hiện có.
        </p>

        <button
          className="hover:bg-black px-8 py-4 border border-black hover:text-white text-sm transition-all duration-500"
          type="button"
        >
          Xem cơ hội việc làm
        </button>
      </div>
    </div>
  </div>
);

export default Contact;
