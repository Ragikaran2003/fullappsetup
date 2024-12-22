import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaSignOutAlt } from "react-icons/fa";
// import { MdAlarmAdd, MdAlarmOff } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import * as XLSX from "xlsx";
import { fetchAdminCenterData ,fetchStudentData, fetchUsersByCenter } from "./adminService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  // const [isClassStarted, setIsClassStarted] = useState(false);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [classStartTime, setClassStartTime] = useState(null);
  // const [classEndTime, setClassEndTime] = useState(null);
  // const [workedTime, setWorkedTime] = useState(null);
  // const [studentCount, setStudentCount] = useState(0);
  const [adminCenter, setAdminCenter] = useState("");
  const [studentsData, setStudentsData] = useState([]);
  const [thisMonthStudents, setThisMonthStudents] = useState([]);
  const [dropoutData, setDropoutData] = useState([]);
  const [todayStudents, setTodayStudents] = useState("");
  const [onlineStudents, setOnlineStudents] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    const loadAdminData = async () => {
      try {
        const data = await fetchAdminCenterData();
        setAdminCenter(data.center);
      } catch (error) {
        toast.error("Unable to fetch admin center data",error);
      }
    };

    loadAdminData();

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStudentData(adminCenter);
        setStudentsData(data);
        // setStudentCount(data.length);
      } catch (error) {
        console.error('Error loading data',error);
      }
    };

    if (adminCenter) loadData();
  }, [adminCenter]);

  useEffect(() => {
  const fetchMonthlyData = () => {


    const firstDayOfMonth = new Date(new Date().getFullYear(), selectedMonth, 1);
    const lastDayOfMonth = new Date(new Date().getFullYear(), selectedMonth + 1, 0);

    // Filter the users data for the selected month
    const filteredUsers = users.filter((student) => {
      const loginDate = new Date(student.logintime);
      return loginDate >= firstDayOfMonth && loginDate <= lastDayOfMonth;
    });
    const uniqueUsersByDate = {};

    filteredUsers.forEach((student) => {
      const day = new Date(student.logintime).getDate();
      if (!uniqueUsersByDate[day]) uniqueUsersByDate[day] = new Set();

      // Deduplicate by studentId for each date
      if (!uniqueUsersByDate[day].has(student.studentId)) {
        uniqueUsersByDate[day].add(student.studentId);
      }
    });

    const daysInMonth = new Date(new Date().getFullYear(), selectedMonth + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const data = daysArray.map((day) => uniqueUsersByDate[day] ? uniqueUsersByDate[day].size : 0);

    setTimeout(() => {
      setChartData({
        labels: daysArray,
        datasets: [
          {
            label: "This Month Students",
            data,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      });
      setLoading(false);
    }, 1000);
  };

  fetchMonthlyData();
}, [selectedMonth, users]);


  // const handleClassStart = () => {
  //   if (!isClassStarted) {
  //     setIsClassStarted(true);
  //     setClassStartTime(new Date().toLocaleString());
  //     toast.success("Class Started!");
  //   }
  // };

  // const handleClassStop = () => setIsDialogOpen(true);

  // const confirmStopClass = () => {
  //   setIsClassStarted(false);
  //   setClassEndTime(new Date().toLocaleString());
  //   setWorkedTime(Math.floor(Math.random() * 4) + 1);
  //   setStudentCount(Math.floor(Math.random() * 30) + 10);
  //   toast.success("Class Stopped!");
  //   setIsDialogOpen(false);
  //   downloadExcel();
  // };

  // const cancelStopClass = () => setIsDialogOpen(false);

  // const downloadExcel = () => {
  //   const workedTimeData = [
  //     {
  //       "Center Start Time": classStartTime,
  //       "Center End Time": classEndTime,
  //       "Worked Time (hours)": workedTime,
  //       "Student Count": studentCount,
  //     },
  //   ];

  //   const studentTimesData = Array.from({ length: 5 }, (_, index) => ({
  //     "Student ID": `Student${index + 1}`,
  //     "Start Time": new Date(
  //       new Date().setHours(
  //         Math.floor(Math.random() * 12),
  //         Math.floor(Math.random() * 60),
  //         0
  //       )
  //     ).toLocaleString(),
  //     "Logout Time": new Date(
  //       new Date().setHours(
  //         Math.floor(Math.random() * 12) + 12,
  //         Math.floor(Math.random() * 60),
  //         0
  //       )
  //     ).toLocaleString(),
  //   }));

  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(workedTimeData), "Center Times & Data");
  //   XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(studentTimesData), "Student Times");
  //   XLSX.writeFile(wb, "class_times.xlsx");
  // };

  const handleSignOut = () => {
    localStorage.removeItem("admin_token");
    setTimeout(() => window.location.href = "/", 1000);
  };
// This month data
  const filterThisMonthData = () => {
    const now = new Date();
    return studentsData.filter(({ createdAt ,studentStatus }) => {
      const date = new Date(createdAt);
      return studentStatus === "come" && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
  };
  useEffect(() => setThisMonthStudents(filterThisMonthData()), [studentsData]);
  
// Dropout Data
  const filterDropoutData = () => {
    return studentsData.filter(({ studentStatus }) => {
      return studentStatus === "dropout";
    });
  };
  useEffect(() => setDropoutData(filterDropoutData()), [studentsData]);

//Todat Students
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
          await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate a small delay
          const data = await fetchUsersByCenter(adminCenter);
          // Filter users whose logintime is today
          const filteredData = data.filter((student) =>
            isSameDay(student.logintime)
          );
          const uniqueFilteredData = filteredData.reduce((acc, student) => {
            if (!acc.some((s) => s.studentId === student.studentId)) {
              acc.push(student);
            }
            return acc;
          }, []);
          const online = data.reduce((acc, student) => {
            if (student.status === "active") {
              acc.push(student);
            }
            return acc;
          }, []);
          setOnlineStudents(online);
          
        setTodayStudents(uniqueFilteredData);
          setUsers(data);
        } catch (error) {
          toast.error("Error loading data", error);
        }
      };
  
      delayFetch();
    }, [adminCenter]);
  // Log the users array whenever it changes
  useEffect(() => {
    console.log("Filtered :", users);
  }, [users]);

  return (
    <div className="p-4 bg-gray-900 text-white relative">
      <h2 className="text-3xl font-semibold mb-2">Dashboard</h2>

      <div className="mb-2">
        <label htmlFor="month" className="text-xl font-semibold">Select Month</label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="ml-4 p-2 border rounded bg-gray-800 text-white"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-800 p-6 rounded-lg text-white">
          <h3 className="text-xl">Total Students</h3>
          <p className="text-3xl font-semibold">{studentsData.length - dropoutData.length}</p>
        </div>
        <div className="bg-green-800 p-6 rounded-lg text-white">
          <h3 className="text-xl">Online Students</h3>
          <p className="text-3xl font-semibold">{onlineStudents.length}/{todayStudents.length}</p>
        </div>
        <div className="bg-yellow-800 p-6 rounded-lg text-white">
          <h3 className="text-xl">This Month New Students</h3>
          <p className="text-3xl font-semibold">{thisMonthStudents.length}</p>
        </div>
        <div className="bg-red-800 p-6 rounded-lg text-white">
          <h3 className="text-xl">Drpout Students</h3>
          <p className="text-3xl font-semibold">{dropoutData.length}</p>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-2xl font-semibold mb-3">Daily Student Growth</h3>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-center" style={{ maxHeight: "50vh", height: "400px" }}>
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
              <p className="mt-3 text-lg text-blue-400">Loading data...</p>
            </div>
          ) : (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: { display: true, text: "Day of the Month" },
                    ticks: { color: "#ffffff" },
                  },
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: "Students Count" },
                    ticks: { color: "#ffffff" },
                  },
                },
                plugins: {
                  legend: { labels: { color: "#ffffff" } },
                  tooltip: {
                    callbacks: {
                      label: ({ label, raw }) => `Day ${label}: ${raw} new students`,
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 p-4 text-xl font-semibold text-center">
  {currentTime}
  <br />
  {adminCenter}
</div>


      <div className="absolute top-0 right-4 p-4 flex space-x-4">
        {/* <div onClick={handleClassStart}>
          {isClassStarted ? (
            <MdAlarmOff
              className="text-white text-3xl cursor-pointer"
              onClick={handleClassStop}
            />
          ) : (
            <MdAlarmAdd className="text-white text-3xl cursor-pointer" />
          )}
        </div> */}
        <FaSignOutAlt
          className="text-white text-3xl cursor-pointer"
          onClick={handleSignOut}
        />
      </div>

      {/* {isDialogOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">Are you Close the Center?</h3>
            <div className="flex gap-32 justify-center items-center mt-5">
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={confirmStopClass}>Yes</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={cancelStopClass}>No</button>
            </div>
          </div>
        </div>
      )} */}

      <ToastContainer />
    </div>
  );
}

export default Dashboard;
