import { useEffect, useState } from "react";
import { fetchAdminCenterData, fetchStudentData, updateStudentClasses } from "./adminService";
import { toast } from "react-toastify";

export const StudentsClass = () => {
  const [adminCenter, setAdminCenter] = useState("");
  const [studentsData, setStudentsData] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editStudent, setEditStudent] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", classes: [] });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const data = await fetchAdminCenterData();
        setAdminCenter(data.center);
      } catch (error) {
        toast.error("Unable to fetch admin center data",error);
      }
    };
    loadAdminData();
  }, []);

  useEffect(() => {
    const delayFetch = async () => {
      if (!adminCenter) return;

      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const data = await fetchStudentData(adminCenter);

        const filteredData = data.filter(
          (student) => student.studentStatus === "come"
        );

        setStudentsData(filteredData);
        setFilteredStudents(filteredData);
      } catch (error) {
        toast.error("Error loading data", error);
      }
    };

    delayFetch();
  }, [adminCenter]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter students based on the search query
    const updatedFilteredStudents = studentsData.filter(
      (student) =>
        student.fullName.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query)
    );

    setFilteredStudents(updatedFilteredStudents);
  };

  const handleEditClick = (student) => {
    setEditStudent(student);
    setFormData({ fullName: student.fullName, classes: student.classes });
    setIsDialogOpen(true); // Open the dialog for class selection
  };

  const handleSaveClick = async () => {
    try {
      const updatedStudent = await updateStudentClasses(
        editStudent._id,
        formData.classes
      ); // API call to update classes
      const updatedStudents = studentsData.map((student) =>
        student._id === updatedStudent._id
          ? {
              ...student,
              fullName: updatedStudent.fullName,
              classes: updatedStudent.classes,
            }
          : student
      );
      setStudentsData(updatedStudents);
      setIsDialogOpen(false); // Close the dialog
      setEditStudent(null); // Clear the edit state
      toast.success("Student updated successfully");
    } catch (error) {
      toast.error("Failed to update student classes", error);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updatedClasses = checked
        ? [...prevData.classes, value]
        : prevData.classes.filter((item) => item !== value);
      return { ...prevData, classes: updatedClasses };
    });
  };

  const handleSubmitClasses = () => {
    handleSaveClick(); // Save the selected classes
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  return (
    <div className="p-4 bg-gray-900 shadow-lg text-white" style={{ maxHeight: "450px" }}>
  <h2 className="text-3xl font-semibold mb-2">Students Class List</h2>
  {/* Search box */}
  <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

  <div className="overflow-x-auto max-h-[550px]"> {/* Add scrollable container for the table */}
    <table className="min-w-full table-auto shadow-md rounded-lg">
      <thead className="sticky top-0 bg-gray-900">
        <tr className="border-b border-gray-600">
          <th className="px-6 py-3 text-left">Full Name</th>
          <th className="px-6 py-3 text-left">Student ID</th>
          <th className="px-6 py-3 text-left">Classes</th>
          <th className="px-6 py-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody className="overflow-y-auto">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => (
            <tr key={index} className="border-b border-gray-600">
              <td className="px-6 py-4">{student.fullName}</td>
              <td className="px-6 py-4">{student.studentId}</td>
              <td className="px-6 py-4">{student.classes.join(" , ")}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleEditClick(student)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
              No students found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Modal for editing student */}
  {isDialogOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          Update Classes for {editStudent.fullName}
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1">Time</th>
              <th className="border border-gray-300 px-2 py-1">Monday</th>
              <th className="border border-gray-300 px-2 py-1">Tuesday</th>
              <th className="border border-gray-300 px-2 py-1">Wednesday</th>
              <th className="border border-gray-300 px-2 py-1">Thursday</th>
              <th className="border border-gray-300 px-2 py-1">Friday</th>
              <th className="border border-gray-300 px-2 py-1">Saturday</th>
              <th className="border border-gray-300 px-2 py-1">Sunday</th>
            </tr>
          </thead>
          <tbody>
            {[
              "6.30 am - 8.30 am",
              "8.30 am - 10.30 am",
              "10.30 am - 12.30 pm",
              "12.30 pm - 2.30 pm",
              "2.30 pm - 4.30 pm",
              "4.30 pm - 6.30 pm",
              "6.30 pm - 8.30 pm",
              "8.30 pm - 10.30 pm",
            ].map((time, index) => (
              <tr key={index}>
                <th className="border border-gray-300 px-2 py-1">{time}</th>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day, dayIndex) => (
                  <td
                    key={dayIndex}
                    className="border border-gray-300 px-2 py-1"
                  >
                    <input
                      type="checkbox"
                      value={`${day} ${time}`}
                      name="class[]"
                      onChange={handleCheckboxChange}
                      checked={formData.classes.includes(`${day} ${time}`)}
                      className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleSubmitClasses}
            className="py-1 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
          <button
            onClick={handleCloseDialog}
            className="py-1 px-4 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};
