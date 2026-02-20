import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Appointment from "./pages/Appointment";
import Contact from "./pages/Contact";
import Doctors from "./pages/Doctors";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Doctors />} path="/doctors" />
        <Route element={<Doctors />} path="/doctors/:speciality" />
        <Route element={<Login />} path="/login" />
        <Route element={<About />} path="/about" />
        <Route element={<Contact />} path="/contact" />
        <Route element={<MyProfile />} path="/my-profile" />
        <Route element={<MyAppointments />} path="/my-appointments" />
        <Route element={<Appointment />} path="/appointment/:docId" />
      </Routes>
      <Footer />
      <ToastContainer
        autoClose={500}
        closeOnClick
        draggable
        newestOnTop
        pauseOnHover={false}
        position="top-right"
        theme="light"
      />
    </div>
  );
};

export default App;
