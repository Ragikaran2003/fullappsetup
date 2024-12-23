import { useEffect, useState } from "react";
import { FaDownload, FaSort } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css"; // Import the calendar's CSS
import DatePicker from "react-datepicker"; // Import DatePicker
import { fetchAdminCenterData, fetchUsersByCenter } from "./adminService";
import axios from "axios";

function OnlineStudents() {
  const [students, setStudents] = useState([]); // This holds the data for download
  const [users, setUsers] = useState([]); // This holds filtered data for display
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "studentid",
    direction: "ascending",
  });
  const [adminCenter, setAdminCenter] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date()); // Track the selected date
  const [searchQuery, setSearchQuery] = useState("");
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
      await new Promise((resolve) => setTimeout(resolve, 500));
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

  const isSameDay = (dateString, dateToCompare) => {
    const logintime = new Date(dateString);
    return (
      logintime.getUTCFullYear() === dateToCompare.getFullYear() &&
      logintime.getUTCMonth() === dateToCompare.getMonth() &&
      logintime.getUTCDate() === dateToCompare.getDate()
    );
  };
  function formatTime(isoString) {
    if (!isoString) return "";
    const [hour, minute] = isoString.split("T")[1].split(":"); // Extract hour and minute
    return `${hour}:${minute}`;
  }
  useEffect(() => {
    const delayFetch = async () => {
      if (!adminCenter) return;
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const data = await fetchUsersByCenter(adminCenter);

        // Filter users by the selected date
        const filteredData = data.filter((student) =>
          isSameDay(student.logintime, selectedDate)
        );

        const sortedData = filteredData.sort((a, b) => {
          if (a.status === b.status) {
            return new Date(a.logintime) - new Date(b.logintime);
          }
          return a.status === "active" ? -1 : 1;
        });

        setUsers(sortedData);
        setStudents(sortedData); // Ensure students state is set as well
      } catch (error) {
        toast.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };

    delayFetch();
  }, [adminCenter, selectedDate]);

  const handleSort = (key) => {
    const isSameKey = sortConfig.key === key;
    const direction =
      isSameKey && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";

    const sortedUsers = [...users].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];

      if (key === "pcId") {
        valueA = parseInt(valueA.slice(2), 10);
        valueB = parseInt(valueB.slice(2), 10);
      } else {
        valueA = valueA ? valueA.toString().toLowerCase() : "";
        valueB = valueB ? valueB.toString().toLowerCase() : "";
      }

      if (valueA < valueB) return direction === "ascending" ? -1 : 1;
      if (valueA > valueB) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setStudents(sortedUsers);
    setUsers(sortedUsers);
    setSortConfig({ key, direction });
  };

  const downloadExcel = () => {
    if (students.length === 0) {
      toast.warn("No data available to download");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Online Students");
    XLSX.writeFile(workbook, "online_students.xlsx");
  };

  // Calculate the unique students based on studentId
  const uniqueStudents = Array.from(
    new Map(users.map((student) => [student.studentId, student])).values()
  );
  const uniqueCount = uniqueStudents.length;

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredUsers = students.filter((student) =>
      [student.studentId, student.fullname, student.pcId]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  return (
    <div className="p-4 bg-gray-900 shadow-lg text-white">
      <h2 className="text-3xl font-semibold mb-2">Online Students</h2>
      <p className="mb-2">Here you can list all currently online students.</p>

      <div className="flex flex-wrap justify items-center mb-4 gap-4">
        <button
          onClick={downloadExcel}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition duration-200"
        >
          <FaDownload className="mr-2" /> Download as Excel
        </button>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="bg-gray-800 text-white py-2 px-4 rounded-lg"
          dateFormat="yyyy-MM-dd"
        />
        <div className="ml-auto text-lg font-semibold">
          Unique Students: {uniqueCount < 10 ? "0" + uniqueCount : uniqueCount}
        </div>
      <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by Name, ID, or PC ID"
          className="bg-gray-800 text-white py-2 px-4 rounded-lg w-full sm:w-auto"
        />
      </div>

      <div className="overflow-auto" style={{ maxHeight: "470px" }}>
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white sticky top-0">
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
                  key={student._id}
                  className="border-b hover:bg-gray-700 cursor-pointer"
                >
                  <td className="p-4 text-sm">{student.studentId}</td>
                  <td className="p-4 text-sm">{student.fullname}</td>
                  <td className="p-4 text-sm">{student.pcId}</td>
                  <td className="p-4 text-sm">
                    {formatTime(student.logintime)}
                  </td>
                  <td className="p-4 text-sm">
                    {student.status !== "active"
                      ? formatTime(student.logouttime)
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

      <ToastContainer />
    </div>
  );
}

export default OnlineStudents;
