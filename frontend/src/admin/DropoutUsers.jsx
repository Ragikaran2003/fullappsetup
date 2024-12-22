import { useEffect, useState } from "react";
import { FaDownload, FaSort } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchAdminCenterData, fetchStudentData } from "./adminService";
import axios from "axios";

function DropoutUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
  const [sortConfig, setSortConfig] = useState(null);
  const [visiblePages, setVisiblePages] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen1, setIsDialogOpen1] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminCenter, setAdminCenter] = useState("");
  const [studentsData, setStudentsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState("fullName"); // Default column
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    setFilteredUsers(
      studentsData.filter(
        (user) => user[searchColumn]?.toLowerCase().includes(query) // Filter dynamically by the selected column
      )
    );
  };

  useEffect(() => {
    setFilteredUsers(studentsData); // Initially show all users
  }, [studentsData]);

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

  useEffect(() => {
    const delayFetch = async () => {
      if (!adminCenter) return;
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const data = await fetchStudentData(adminCenter);

        const filteredData = data.filter(
          (student) => student.studentStatus !== "come"
        );
        setStudentsData(filteredData);
      } catch (error) {
        toast.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };
    delayFetch();
  }, [adminCenter]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    const sortedUsers = [...studentsData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setStudentsData(sortedUsers);
    setSortConfig({ key, direction });
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);

    const startPage = Math.floor((pageNumber - 1) / 10) * 10 + 1; // Determine the block range for pagination
    const endPage = startPage + 9; // Define end range for visible page numbers

    const newVisiblePages = [];
    for (
      let i = startPage;
      i <= Math.min(endPage, Math.ceil(studentsData.length / usersPerPage));
      i++
    ) {
      newVisiblePages.push(i);
    }

    setVisiblePages(newVisiblePages);
  };
  // Helper function to calculate age
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Call paginate logic when component is first rendered (on initial load)
  useEffect(() => {
    paginate(1); // Initialize pagination logic and visible pages to the first page
  }, [studentsData]);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(studentsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "dropoutStudents.xlsx");
  };

  const totalPageNumbers = Math.ceil(studentsData.length / usersPerPage);

  const handleDropoutClick = (user) => {
    setSelectedUser(user);
    setIsDialogOpen1(true);
  };

  const handleCancelDialog = () => {
    setIsDialogOpen1(false);
    setSelectedUser(null);
  };

  const handleConfirmDropout = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/students/${selectedUser._id}`,
        { studentStatus: "come" } // Send only the updated field
      );

      if (response.status === 200) {
        setStudentsData((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id
              ? { ...user, studentStatus: "come" }
              : user
          )
        );
        toast.success("User Restore Success!");
        handleCancelDialog();
      }
    } catch (error) {
      toast.error("Error updating status to dropout.");
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-gray-900 shadow-lg text-white">
      <ToastContainer />
      <h2 className="text-3xl font-semibold mb-2">Dropout Users</h2>
      <p className="mb-2">Here you can list all dropout users.</p>

      <div className="grid grid-cols-2 gap-4 w-2/5">
        <div className="mb-4">
          <select
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="fullName">Search by Name</option>
            <option value="studentId">Search by Student ID</option>
            <option value="phoneNumber">Search by Phone Number</option>
            <option value="parentNumber">Search by Parent Number</option>
          </select>
        </div>

        {/* Search Input Section */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Type your search..."
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <button
        onClick={downloadExcel}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-2 mb-2 flex items-center hover:bg-blue-700 transition duration-200"
      >
        <FaDownload className="mr-2" /> Download as Excel
      </button>

      <div className="overflow-auto" style={{ maxHeight: "400px" }}>
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("studentId")}
              >
                StudentID <FaSort className="inline ml-2" />
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("fullName")}
              >
                Name <FaSort className="inline ml-2" />
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("phoneNumber")}
              >
                Phone Number <FaSort className="inline ml-2" />
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("parentNumber")}
              >
                Parent Number <FaSort className="inline ml-2" />
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("dob")}
              >
                Age <FaSort className="inline ml-2" />
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("gender")}
              >
                Gender <FaSort className="inline ml-2" />
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("address")}
              >
                Address <FaSort className="inline ml-2" />
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("project")}
              >
                Project <FaSort className="inline ml-2" />
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("homework")}
              >
                Homework <FaSort className="inline ml-2" />
              </th>
              <th
                className="p-4 text-left text-sm font-medium cursor-pointer"
                onClick={() => handleSort("certificates")}
              >
                Certificates <FaSort className="inline ml-2" />
              </th>
              <th className="p-4 text-left text-sm font-medium">Restore</th>
            </tr>
          </thead>
          <tbody className="text-white bg-gray-800">
            {loading ? (
              <tr>
                <td colSpan="15" className="text-center p-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
                    <p className="mt-3 text-lg text-blue-400">
                      Loading data...
                    </p>
                  </div>
                </td>
              </tr>
            ) : studentsData.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-700 cursor-pointer"
                >
                  <td className="p-4 text-sm">{user.studentId}</td>
                  <td className="p-4 text-sm">{user.fullName}</td>
                  <td className="p-4 text-sm">{user.phoneNumber}</td>
                  <td className="p-4 text-sm">{user.parentNumber}</td>
                  <td className="p-4 text-sm">{calculateAge(user.dob)}</td>
                  <td className="p-4 text-sm">{user.gender}</td>
                  <td className="p-4 text-sm">{user.address}</td>
                  <td className="p-4 text-sm">{user.project}</td>
                  <td className="p-4 text-sm">{user.homework}</td>
                  <td className="p-4 text-sm">
                    {user.certificates || "No Certificate"}
                  </td>
                  <td className="p-4 text-sm">
                    <button
                      onClick={() => handleDropoutClick(user)}
                      className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="text-center p-4 text-gray-500">
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex justify-center items-center space-x-4 bg-blue-600 p-2">
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
        >
          First
        </button>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
        >
          Previous
        </button>

        {visiblePages.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`py-2 px-4 rounded-lg ${
              currentPage === number
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPageNumbers}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
        >
          Next
        </button>

        <button
          onClick={() => paginate(totalPageNumbers)}
          disabled={currentPage === totalPageNumbers}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
        >
          Last
        </button>
      </div>


      {isDialogOpen1 && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-700 p-6 rounded-lg w-auto">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Confirm Restore
            </h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to mark {selectedUser.fullName} as a
              Restore?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDialog}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDropout}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DropoutUsers;
