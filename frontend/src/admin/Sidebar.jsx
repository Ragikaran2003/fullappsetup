import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Use NavLink
import {
  FaTachometerAlt,
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaLink,
  FaChevronDown,
  FaChevronRight,
  FaClipboard,
  FaChartBar,
} from 'react-icons/fa'; // Example icons
import logo from '../assets/logo.png';
// import { HiOutlineBars3 } from "react-icons/hi2"; // Hamburger icon

function Sidebar() {
  // State to manage sidebar collapse and submenu expansion
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProMenuOpen, setIsProMenuOpen] = useState(false); // For submenu
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

  // Toggle submenu
  const toggleProMenu = () => {
    setIsProMenuOpen(!isProMenuOpen);
  };

  return (
    <div
      className={`w-${isCollapsed ? '0' : '66'} h-screen bg-gray-800 text-white p-3 transition-all duration-300 ease-in-out`}
    >
      {/* Top section with the dashboard title and the hamburger menu icon */}
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && <h2 className="text-2xl font-semibold">Dashboard</h2>}
        <button className="text-2xl" onClick={toggleSidebar}>
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
        <li>
          <NavLink
            to="/staff-dashboard/students-class-count"
            className={({ isActive }) =>
              `py-2 px-4 hover:bg-gray-700 rounded flex items-center ${
                isActive ? 'text-blue-400' : ''
              }`
            }
          >
            <FaChartBar className="w-6 h-6 mr-2" />
            {!isCollapsed && 'Students Class Count'}
          </NavLink>
        </li>
        {/* Pro Menu with Submenu */}
        <li>
          <button
            onClick={toggleProMenu}
            className="py-2 px-4 hover:bg-gray-700 rounded flex items-center w-full text-left"
          >
            <FaClipboard className="w-6 h-6 mr-2" />
            {!isCollapsed && (
              <span className="flex-1">Class Details</span>
            )}
            {!isCollapsed && (
              <span>{isProMenuOpen ? <FaChevronDown /> : <FaChevronRight />}</span>
            )}
          </button>
          {/* Submenu */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isProMenuOpen ? 'max-h-40' : 'max-h-0'
            }`}
          >
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <NavLink
                  to="/staff-dashboard/students-class"
                  className={({ isActive }) =>
                    `py-1 px-3 hover:bg-gray-700 rounded flex items-center ${
                      isActive ? 'text-blue-400' : ''
                    }`
                  }
                >
                  {!isCollapsed && 'Students Classes'}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/staff-dashboard/class-summary"
                  className={({ isActive }) =>
                    `py-1 px-3 hover:bg-gray-700 rounded flex items-center ${
                      isActive ? 'text-blue-400' : ''
                    }`
                  }
                >
                  {!isCollapsed && 'Class Summary'}
                </NavLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
