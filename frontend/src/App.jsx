import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminLogin from './components/AdminLogin';
import { ToastContainer } from 'react-toastify';
import AdminRegisterForm from './components/AdminRegister';
import Dashboard from './admin/Dashboard';
import AllUsers from './admin/AllUsers';
import OnlineUsers from './admin/OnlineUsers';
import AbsenceTable from './admin/AbsenceTable';
import Sidebar from './admin/Sidebar';
import DropoutUsers from './admin/DropoutUsers';
import ErrorPage from './components/ErrorPage';
import { UsefullLinks } from './admin/UsefullLinks';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* General Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register-centers" element={<AdminRegisterForm />} />

        {/* Admin Routes with Sidebar and Dashboard */}
        <Route path="/staff-dashboard/*" element={
          <div className="flex">
            <div className="w-1/5 bg-gray-800 ">
            <Sidebar />
            </div>
            <div className="w-4/5 bg-gray-900 overflow-y-auto">
              <Routes>
                <Route path="center-manager" element={<Dashboard />} />
                <Route path="all-users" element={<AllUsers />} />
                <Route path="online-users" element={<OnlineUsers />} />
                <Route path="absencestudents" element={<AbsenceTable />} />
                <Route path="dropout-users" element={<DropoutUsers />} />
                <Route path="usefull-links" element={<UsefullLinks />} />
              </Routes>
            </div>
          </div>
        } />

        {/* Handle 404 for unmatched routes */}
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
