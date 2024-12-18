import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Correct way to use navigation
import MdaLogo from "../assets/mda.png";
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!email || !password) {
      toast.error('Both email and password are required.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setTimeout(() => {
          localStorage.setItem('admin_token', result.id);
          navigate('/staff-dashboard/center-manager');
        }, 2000); // 2-second delay
      } else {
        toast.error(result.error || 'Login failed.');
      }
    } catch (error) {
      console.error('Error during login request', error);
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="flex w-full min-h-screen">
        {/* Left side image (Only for large screens) */}
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${MdaLogo})` }}></div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-800 p-8 text-white">
          <img
            src={MdaLogo}
            alt="MDA Logo"
            className="w-32 h-32 rounded-full object-cover mb-6 md:hidden"
          />
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-semibold text-center mb-6">Admin Login</h2>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {/* Email field */}
              <div className="mb-4">
                <label htmlFor="email" className="block">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Password field */}
              <div className="mb-6">
                <label htmlFor="password" className="block">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 mt-2 border bg-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
