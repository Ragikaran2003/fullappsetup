import { useEffect, useState } from 'react';
import { NavLink,useNavigate } from 'react-router-dom'; // Use NavLink
import { FaTachometerAlt, FaUsers, FaUserCheck,FaUserSlash, FaLink  } from 'react-icons/fa'; // Example icons
import logo from '../assets/logo.png';
// import { HiOutlineBars3 } from "react-icons/hi2"; // Hamburger icon

function Sidebar() {
  // State to manage sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);
  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`w-${isCollapsed ? '0' : '66'} h-screen bg-gray-800 text-white p-3 transition-all duration-300 ease-in-out`}>
      {/* Top section with the dashboard title and the hamburger menu icon */}
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && <h2 className="text-2xl font-semibold">Dashboard</h2>}
        <button className="text-2xl w-" onClick={toggleSidebar}>
          {/* <HiOutlineBars3 /> */}
        </button>
      </div>

      {/* Logo (only show when not collapsed) */}
      {!isCollapsed && (
        <div className="flex justify-center mb-3">
          <img src={logo} alt="Logo" className="rounded-full w-32" />
        </div>
      )}

      {/* Academy Information (only show when not collapsed) */}
      {!isCollapsed && (
        <>
          <h1 className="text-3xl font-bold text-center mb-1">MY DREAM ACADEMY</h1>
          <p className="text-center mb-6 text-sm text-blue-400">Student Monitoring System</p>
        </>
      )}

      {/* Sidebar Links */}
      <ul>
        <li>
          <NavLink
            to="/staff-dashboard/center-manager"
            className={({ isActive }) =>
              `py-2 px-4 hover:bg-gray-700 rounded flex items-center ${
                isActive ? 'text-blue-400' : ''
              }`
            }
          >
            <FaTachometerAlt className="w-6 h-6 mr-2" />
            {!isCollapsed && 'Dashboard'}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/staff-dashboard/all-users"
            className={({ isActive }) =>
              `py-2 px-4 hover:bg-gray-700 rounded flex items-center ${
                isActive ? 'text-blue-400' : ''
              }`
            }
          >
            <FaUsers className="w-6 h-6 mr-2" />
            {!isCollapsed && 'All Users'}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/staff-dashboard/online-users"
            className={({ isActive }) =>
              `py-2 px-4 hover:bg-gray-700 rounded flex items-center ${
                isActive ? 'text-blue-400' : ''
              }`
            }
          >
            <FaUserCheck className="w-6 h-6 mr-2" />
            {!isCollapsed && 'Online Users'}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/staff-dashboard/dropout-users"
            className={({ isActive }) =>
              `py-2 px-4 hover:bg-gray-700 rounded flex items-center ${
                isActive ? 'text-blue-400' : ''
              }`
            }
          >
            <FaUserSlash className="w-6 h-6 mr-2" />
            {!isCollapsed && 'Dropout Students'}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/staff-dashboard/usefull-links"
            className={({ isActive }) =>
              `py-2 px-4 hover:bg-gray-700 rounded flex items-center ${
                isActive ? 'text-blue-400' : ''
              }`
            }
          >
            <FaLink className="w-6 h-6 mr-2" />
            {!isCollapsed && 'Usefull Links'}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
