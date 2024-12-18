import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminRegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googlesheet, setGoogleSheet] = useState("");
  const [Idmodel, setIdModel] = useState("");
  const [center, setCenter] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !googlesheet || !Idmodel || !center) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/register`,
        {
          email,
          password,
          googlesheet,
          Idmodel,
          center,
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        setEmail("");
        setPassword("");
        setGoogleSheet("");
        setIdModel("");
        setCenter("");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(
        error.response?.data?.error || "Something went wrong during registration"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
          Admin Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2  text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-gray-700 border  text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Google Sheet Link */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Google Sheet URL</label>
            <input
              type="url"
              className="w-full px-4 py-2 bg-gray-700 border  text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter Google Sheet URL"
              value={googlesheet}
              onChange={(e) => setGoogleSheet(e.target.value)}
            />
          </div>

          {/* ID Model */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">ID Model</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-700 border text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter ID Model"
              value={Idmodel}
              onChange={(e) => setIdModel(e.target.value)}
            />
          </div>

          {/* Center */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Center</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter Center Name"
              value={center}
              onChange={(e) => setCenter(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-md shadow-md transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegisterForm;
