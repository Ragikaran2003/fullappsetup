import { useEffect, useState } from "react";
import { fetchAdminCenterData, fetchStudentData } from "./adminService";
import { toast } from "react-toastify";

export const ClassSummary = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classSummary, setClassSummary] = useState({});
  const [adminCenter, setAdminCenter] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null); 

  const timeSlots = [
    "6.30 am - 8.30 am",
    "8.30 am - 10.30 am",
    "10.30 am - 12.30 pm",
    "12.30 pm - 2.30 pm",
    "2.30 pm - 4.30 pm",
    "4.30 pm - 6.30 pm",
    "6.30 pm - 8.30 pm",
    "8.30 pm - 10.30 pm",
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const loadAdminCenterData = async () => {
      try {
        const adminData = await fetchAdminCenterData();
        setAdminCenter(adminData.center);
      } catch (error) {
        console.error("Failed to load admin center data:", error);
        toast.error("Failed to load admin center data.");
      }
    };

    loadAdminCenterData();
  }, []);

  useEffect(() => {
    const loadStudentData = async () => {
      if (!adminCenter) return;

      try {
        setLoading(true);
        const data = await fetchStudentData(adminCenter);
        setStudentsData(data);
        processClassSummary(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load students data:", error);
        toast.error("Failed to load students data.");
        setLoading(false);
      }
    };

    loadStudentData();
  }, [adminCenter]);

  const processClassSummary = (data) => {
    const summary = {};

    // Initialize summary structure
    timeSlots.forEach((time) => {
      summary[time] = {};
      daysOfWeek.forEach((day) => {
        summary[time][day] = 0;
      });
    });

    // Count the number of students in each slot (only if it matches)
    data.forEach((student) => {
      student.classes.forEach((classSlot) => {
        // Example of classSlot format: "Monday 6.30 am - 8.30 am"
        const [day, ...timeParts] = classSlot.split(" ");
        const time = timeParts.join(" "); // Join back the time part (e.g., "6.30 am - 8.30 am")

        // Only count if the time and day match
        if (timeSlots.includes(time) && daysOfWeek.includes(day)) {
          summary[time][day] += 1; // Increment count for the matching time and day
        }
      });
    });

    setClassSummary(summary); // Set the class summary state with the counts
  };

  const handleButtonClick = (time, day) => {
    setSelectedSlot({ time, day });
  };

  const closeModal = () => {
    setSelectedSlot(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Class Summary</h2>

      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-white bg-gray-900 rounded-lg">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 px-4 py-2">Time</th>
                {daysOfWeek.map((day) => (
                  <th key={day} className="border border-gray-700 px-4 py-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, index) => (
                <tr key={index}>
                  <td className="border border-gray-700 px-5">{time}</td>
                  {daysOfWeek.map((day) => (
                    <td
                      key={day}
                      className="border-2 border-gray-700 text-center text-2xl"
                    >
                      {/* Button with count */}
                      <button
                        onClick={() => handleButtonClick(time, day)}
                        className={`${
                          classSummary[time] && classSummary[time][day] > 21
                            ? "bg-red-600 hover:bg-red-700" // Red button if the count exceeds 21
                            : "bg-gray-900 hover:bg-gray-800" // Blue button if the count is less than or equal to 21
                        } text-white px-4 py-2 w-full h-16`}
                      >
                        {classSummary[time] && classSummary[time][day] > 0
                          ? classSummary[time][day]
                          : 0}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for detailed info */}
      {selectedSlot && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-white">
              Students for {selectedSlot.day} at {selectedSlot.time}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-gray-700">
                <thead>
                  <tr className=" text-white">
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Phone Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* List students in the selected time-slot and day */}
                  {studentsData
                    .filter((student) =>
                      student.classes.some(
                        (classSlot) =>
                          classSlot.startsWith(selectedSlot.day) &&
                          classSlot.includes(selectedSlot.time)
                      )
                    )
                    .map((student) => (
                      <tr className=" text-white" key={student.studentId}>
                        <td className="border border-gray-300 px-4 py-2">
                          {student.fullName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {student.phoneNumber}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
