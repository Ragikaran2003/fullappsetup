import { useEffect, useState } from "react";
import { FaUserCircle, FaTimesCircle } from "react-icons/fa"; // Importing React Icons

const Dashboard = ({ token }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [studentDetails, setStudentDetails] = useState([]);
  const students = [
    { name: "John Doe", certificateCount: 5, center: "Center A" },
    { name: "Jane Smith", certificateCount: 3, center: "Center B" },
    { name: "Alice Johnson", certificateCount: 7, center: "Center A" },
    { name: "Bob Brown", certificateCount: 4, center: "Center C" },
    { name: "Charlie Davis", certificateCount: 2, center: "Center B" },
    { name: "David Wilson", certificateCount: 6, center: "Center A" },
    { name: "Eve Lee", certificateCount: 1, center: "Center C" },
    { name: "Frank Miller", certificateCount: 8, center: "Center B" },
    { name: "Grace Lewis", certificateCount: 9, center: "Center A" },
    { name: "Hannah Walker", certificateCount: 3, center: "Center C" },
    { name: "David Wilson", certificateCount: 6, center: "Center A" },
    { name: "Eve Lee", certificateCount: 1, center: "Center C" },
    { name: "Frank Miller", certificateCount: 8, center: "Center B" },
    { name: "Grace Lewis", certificateCount: 9, center: "Center A" },
    { name: "Hannah Walker", certificateCount: 3, center: "Center C" },
    { name: "David Wilson", certificateCount: 6, center: "Center A" },
    { name: "Eve Lee", certificateCount: 1, center: "Center C" },
    { name: "Frank Miller", certificateCount: 8, center: "Center B" },
    { name: "Grace Lewis", certificateCount: 9, center: "Center A" },
    { name: "Hannah Walker", certificateCount: 3, center: "Center C" },
  ];
  useEffect(() => {
    const storedID = localStorage.getItem("id_token"); // Retrieve fullname from localStorage

    fetch(`${import.meta.env.VITE_API_URL}/students/details/${storedID}`)
      .then((response) => response.json())
      .then((data) => {
        setStudentDetails(data); // Set the fetched details
      })
      .catch((error) =>
        console.error("Error fetching student details:", error)
      );
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return (window.location.href = "/");
      }

      // Send POST request to logout endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("id_token");
        setTimeout(() => {
          window.location.replace("/");
        }, 1000);
      } else {
        console.error("Logout failed: ", data.message);
      }
    } catch (error) {
      console.error("An error occurred during logout: ", error);
    }
  };

  const handleProfileClick = () => {
    setIsModalOpen(true); // Open the modal when the profile icon is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Top Header */}
      <header className="p-5 bg-gray-900 shadow-lg flex justify-between items-center">
        {/* Left - User Greeting */}
        <h1 className="text-2xl font-bold">
          Hello, {studentDetails.fullName}!
        </h1>{" "}
        {/* Reduced font size for header */}
        {/* Right - Profile Icon and Logout Button */}
        <div className="flex items-center space-x-5">
          <button onClick={handleProfileClick} className="text-white">
            <FaUserCircle className="text-3xl" /> {/* Profile Icon */}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:outline-none"
          >
            END YOUR SESSION
          </button>
        </div>
      </header>

      {/* Main Content Area with Full Height */}
      <div className="flex flex-col sm:flex-row h-full p-6 space-x-10">
        {/* Left - Table of University Students */}
        <div className="w-full sm:w-2/5 bg-gray-700 p-5 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            University Students Name and Certificate Count
          </h2>
          <div className="overflow-x-auto max-h-72">
            {/* Set max height and enable scrolling */}
            <table className="min-w-full">
              <thead>
                <tr className="sticky top-0 bg-gray-800">
                  {/* Sticky header */}
                  <th className="text-left px-4 py-2">
                    University Students Name
                  </th>
                  <th className="text-left px-4 py-2">Certificate Count</th>
                  <th className="text-left px-4 py-2">Certificate Count</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="bg-gray-800 hover:bg-gray-600">
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{student.certificateCount}</td>
                    <td className="px-4 py-2">{student.center}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right - Centered Buttons and Text Box */}
        <div className="flex flex-col justify-center items-center w-full sm:w-2/5 h-full space-y-6">
          {/* Text Box with Stylish Font */}
          <div className="text-5xl font-bold text-center text-blue-500 mr-0 mb-8 mt-3">
            MY Dream Academy
          </div>
          {/* Buttons */}
          <a
            href="https://dpedumonitoring.site/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-blue-600 hover:bg-blue-700 w-96 mr-20 sm:mr-0 text-white py-7 px-5 rounded-md text-2xl">
              DP MONITORING SYSTEM
            </button>
          </a>

          <a
            href="https://www.dpcode.lk/ta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-green-600 hover:bg-green-700 w-96 mr-20 sm:mr-0 text-white py-7 px-5 rounded-md text-2xl">
              DP CODE
            </button>
          </a>

          <a href="https://code.org" target="_blank" rel="noopener noreferrer">
            <button className="bg-yellow-600 hover:bg-yellow-700 w-96 mr-20 sm:mr-0 text-white py-7 px-5 rounded-md text-2xl">
              CODE.ORG
            </button>
          </a>
        </div>
      </div>

      {/* Modal for Profile Details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Profile Details</h2>
              <button onClick={handleCloseModal} className="text-white text-xl">
                <FaTimesCircle />
              </button>
            </div>

            {/* Profile Information */}
            <div className="space-y-2 text-white">
              {studentDetails ? (
                <>
                  <p>
                    <strong>Name:</strong> {studentDetails.fullName}
                  </p>
                  <p>
                    <strong>Student ID:</strong> {studentDetails.studentId}
                  </p>
                  <p>
                    <strong>Grade:</strong> {studentDetails.grade}
                  </p>
                  <p>
                    <strong>GN:</strong> {studentDetails.gn}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong> {studentDetails.dob}
                  </p>
                  <p>
                    <strong>Gender:</strong> {studentDetails.gender}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {studentDetails.phoneNumber}
                  </p>
                  <p>
                    <strong>Parent Number:</strong>{" "}
                    {studentDetails.parentNumber}
                  </p>
                  <p>
                    <strong>Address:</strong> {studentDetails.address}
                  </p>
                  <p>
                    <strong>Center:</strong> {studentDetails.center}
                  </p>
                  <p>
                    <strong>Project:</strong> {studentDetails.project}
                  </p>
                  <p>
                    <strong>Homework:</strong> {studentDetails.homework}
                  </p>
                  <p>
                    <strong>Certificates:</strong>{" "}
                    {studentDetails.certificates || "None"}
                  </p>
                  <div>
                    <strong>Classes:</strong>
                    <ul className="ml-4 space-y-1">
                      {studentDetails.classes?.length > 0 ? (
                        studentDetails.classes.map((classItem, index) => (
                          <li key={index}>{classItem}</li>
                        ))
                      ) : (
                        <li>No classes available</li>
                      )}
                    </ul>
                  </div>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>

            {/* Footer/Close button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 mt-16 text-white py-4 text-center">
        <p>
          © {new Date().getFullYear()} Created by{" "}
          <a
            href="http://ragikaran2003.free.nf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline mx-2"
          >
            Baskaran Ragikaran
          </a>{" "}
          |{" "}
          <a
            href="https://www.mydreamacademy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline mx-2"
          >
            My Dream Academy Nelliady
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
