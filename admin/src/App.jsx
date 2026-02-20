import { useContext } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";
import AddDoctor from "./pages/Admin/AddDoctor";
import AllAppointments from "./pages/Admin/AllAppointments";
import Dashboard from "./pages/Admin/Dashboard";
import DoctorsList from "./pages/Admin/DoctorsList";
import Login from "./pages/Login";

const ProtectedRoute = ({ children }) => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  if (!aToken && !dToken) return <Navigate replace to="/login" />;
  return children;
};

const Layout = () => (
  <>
    <Navbar />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  </>
);

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route element={<Dashboard />} path="/" />
          <Route element={<AllAppointments />} path="/all-appointments" />
          <Route element={<AddDoctor />} path="/add-doctor" />
          <Route element={<DoctorsList />} path="/doctor-list" />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
