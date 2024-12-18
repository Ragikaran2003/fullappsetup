import { useEffect, useState } from "react";
import { FaDownload, FaSort } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchAdminCenterData, fetchUsersByCenter } from "./adminService";
import axios from "axios";
function OnlineStudents() {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [sortConfig, setSortConfig] = useState({
    key: "studentid",
    direction: "ascending",
  });
  const [adminCenter, setAdminCenter] = useState("");

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const data = await fetchAdminCenterData();
        setAdminCenter(data.center);
      } catch (error) {
        toast.error("Unable to fetch admin center data", error);
      }
    };
    loadAdminData();
  }, []);

  const handleLogoutUser = async (userId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/logout/${userId}`
      );

      if (response?.data?.message === "Logout successful") {
        toast.success("Logout successful");
        return true;
      } else {
        toast.error("Logout failed");
        return false;
      }
    } catch (error) {
      console.error("Error during logout", error);
      toast.error("Error during logout");
      return false;
    }
  };

  // Function to check if a date's logintime is today
  const isSameDay = (dateString) => {
    const logintime = new Date(dateString);
    const now = new Date();
    return (
      logintime.getUTCFullYear() === now.getUTCFullYear() &&
      logintime.getUTCMonth() === now.getUTCMonth() &&
      logintime.getUTCDate() === now.getUTCDate()
    );
  };

  useEffect(() => {
    const delayFetch = async () => {
      if (!adminCenter) return; // Ensure adminCenter is available before fetching
      try {
        setLoading(true); // Set loading to true before fetching
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a small delay
        const data = await fetchUsersByCenter(adminCenter);
        // Filter users whose logintime is today
        const filteredData = data.filter((student) =>
          isSameDay(student.logintime)
        );
        const sortedData = filteredData.sort((a, b) => {
          // Prioritize status: Active comes before inactive
          if (a.status === b.status) {
            // If statuses are the same, sort by logintime descending
            return new Date(a.logintime) - new Date(b.logintime);
          }
          return a.status === "active" ? -1 : 1; // Active students come first
        });
        // Store the filtered data in the state
        setUsers(sortedData);
      } catch (error) {
        toast.error("Error loading data", error);
      } finally {
        setLoading(false); // Always set loading back to false
      }
    };

    delayFetch();
  }, [adminCenter]);

  // Function to handle sorting
  const handleSort = (key) => {
    const isSameKey = sortConfig.key === key;
    const direction = isSameKey && sortConfig.direction === "ascending" ? "descending" : "ascending";
  
    const sortedUsers = [...users].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];
  
      if (key === "pcId") {
        // Extract numeric value from pcId for accurate number comparison
        valueA = parseInt(valueA.slice(2), 10);
        valueB = parseInt(valueB.slice(2), 10);
      } else {
        // Default string comparison for other columns
        valueA = valueA ? valueA.toString().toLowerCase() : "";
        valueB = valueB ? valueB.toString().toLowerCase() : "";
      }
  
      if (valueA < valueB) return direction === "ascending" ? -1 : 1;
      if (valueA > valueB) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setStudents(sortedUsers)
    setUsers(sortedUsers);
    setSortConfig({ key, direction });
  };
  
  
  // Function to download the data as an Excel file
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Online Students");

    // Save the file
    XLSX.writeFile(workbook, "online_students.xlsx");
  };

  return (
    <div className="p-4 bg-gray-900 shadow-lg text-white">
      <h2 className="text-3xl font-semibold mb-2">Online Students</h2>
      <p className="mb-2">Here you can list all currently online students.</p>

      <button
        onClick={downloadExcel}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-2 mb-2 flex items-center hover:bg-blue-700 transition duration-200"
      >
        <FaDownload className="mr-2" /> Download as Excel
      </button>

      <div className="overflow-auto" style={{ maxHeight: "400px" }}>
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white sticky top-0 z-10">
            <tr>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("studentid")}
              >
                Student ID
                <FaSort className="inline ml-2" />
                {sortConfig.key === "studentid" &&
                  (sortConfig.direction === "ascending" ? " ↑" : " ↓")}
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name
                <FaSort className="inline ml-2" />
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "ascending" ? " ↑" : " ↓")}
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("pcId")}
              >
                PC ID
                <FaSort className="inline ml-2" />
                {sortConfig.key === "pcId" &&
                  (sortConfig.direction === "ascending" ? " ↑" : " ↓")}
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("logintime")}
              >
                Login Time
                <FaSort className="inline ml-2" />
                {sortConfig.key === "logintime" &&
                  (sortConfig.direction === "ascending" ? " ↑" : " ↓")}
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("logouttime")}
              >
                Logout Time
                <FaSort className="inline ml-2" />
                {sortConfig.key === "logouttime" &&
                  (sortConfig.direction === "ascending" ? " ↑" : " ↓")}
              </th>
              <th className="p-4 text-left text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-white bg-gray-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
                    <p className="mt-3 text-lg text-blue-400">
                      Loading data...
                    </p>
                  </div>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((student) => (
                <tr
                  key={student.studentid}
                  className="border-b hover:bg-gray-700 cursor-pointer"
                >
                  <td className="p-4 text-sm">{student.studentId}</td>
                  <td className="p-4 text-sm">{student.fullname}</td>
                  <td className="p-4 text-sm">{student.pcId}</td>
                  <td className="p-4 text-sm">{student.logintime}</td>
                  <td className="p-4 text-sm">
                    {student.status !== "active"
                      ? student.logouttime
                      : "Still Working"}
                  </td>
                  <td className="p-4 text-sm">
                    {student.status === "active" ? (
                      <button
                        className="py-2 px-5 bg-green-400 text-black rounded-md"
                        onClick={() => handleLogoutUser(student._id)}
                      >
                        Online
                      </button>
                    ) : (
                      <button className="py-2 px-6 bg-red-500 text-black rounded-md">
                        Offline
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
}

export default OnlineStudents;
