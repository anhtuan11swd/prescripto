import { assets } from "../assets/assets";

const About = () => (
  <div>
    <div className="pt-10 text-[#707070] text-2xl text-center">
      <p>
        VỀ <span className="font-semibold text-gray-700">CHÚNG TÔI</span>
      </p>
    </div>

    <div className="flex md:flex-row flex-col gap-12 my-10">
      <img
        alt="Về Prescripto"
        className="w-full md:max-w-[360px]"
        src={assets.about_image}
      />

      <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 text-sm">
        <p>
          Chào mừng đến với Prescripto, đối tác đáng tin cậy của bạn trong việc
          quản lý sức khỏe một cách thuận tiện và hiệu quả. Tại Prescripto,
          chúng tôi hiểu những thách thức mà mỗi cá nhân phải đối mặt khi đặt
          lịch hẹn bác sĩ và quản lý hồ sơ sức khỏe của mình.
        </p>
        <p>
          Prescripto cam kết mang đến sự xuất sắc trong công nghệ y tế. Chúng
          tôi không ngừng nỗ lực để nâng cấp nền tảng, tích hợp những tiến bộ
          mới nhất nhằm cải thiện trải nghiệm người dùng và cung cấp dịch vụ
          vượt trội. Dù bạn đang đặt lịch hẹn lần đầu tiên hay quản lý việc chăm
          sóc sức khỏe liên tục, Prescripto luôn sẵn sàng hỗ trợ bạn trong suốt
          quá trình.
        </p>
        <b className="text-gray-800">Tầm nhìn của chúng tôi</b>
        <p>
          Tầm nhìn của Prescripto là tạo ra một trải nghiệm chăm sóc sức khỏe
          liền mạch cho mọi người dùng. Chúng tôi hướng đến việc thu hẹp khoảng
          cách giữa bệnh nhân và các nhà cung cấp dịch vụ y tế, giúp bạn dễ dàng
          tiếp cận sự chăm sóc cần thiết, bất cứ khi nào bạn cần.
        </p>
      </div>
    </div>

    <div className="my-4 text-xl">
      <p>
        TẠI SAO{" "}
        <span className="font-semibold text-gray-700">CHỌN CHÚNG TÔI</span>
      </p>
    </div>

    <div className="flex md:flex-row flex-col mb-20">
      <div className="flex flex-col gap-5 hover:bg-primary px-10 md:px-16 py-8 sm:py-16 border text-[15px] text-gray-600 hover:text-white transition-all duration-300 cursor-pointer">
        <b>HIỆU QUẢ:</b>
        <p>Đặt lịch hẹn nhanh chóng, phù hợp với cuộc sống bận rộn của bạn.</p>
      </div>

      <div className="flex flex-col gap-5 hover:bg-primary px-10 md:px-16 py-8 sm:py-16 border text-[15px] text-gray-600 hover:text-white transition-all duration-300 cursor-pointer">
        <b>TIỆN LỢI:</b>
        <p>
          Truy cập vào mạng lưới các chuyên gia y tế đáng tin cậy trong khu vực
          của bạn.
        </p>
      </div>

      <div className="flex flex-col gap-5 hover:bg-primary px-10 md:px-16 py-8 sm:py-16 border text-[15px] text-gray-600 hover:text-white transition-all duration-300 cursor-pointer">
        <b>CÁ NHÂN HÓA:</b>
        <p>
          Đề xuất và nhắc nhở được cá nhân hóa để giúp bạn theo dõi sức khỏe tốt
          hơn.
        </p>
      </div>
    </div>
  </div>
);

export default About;
