import { useEffect, useState } from "react";
import MdaLogo from "../assets/mda.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import Dashboard from "./Dashboard";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
const LoginPage = () => {
  // State for form inputs and error messages
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [project, setProject] = useState("");
  const [homework, setHomework] = useState("");
  const [pcId, setPcId] = useState("");
  const [certificates, setCertificates] = useState("");
  const [idmodel, setIdmodel] = useState("");
  // State for error messages for each field
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [projectError, setProjectError] = useState("");
  const [homeworkError, setHomeworkError] = useState("");
  const [pcIdError, setPcIdError] = useState("");
  const [certificatesError, setCertificatesError] = useState("");
  const [token, setToken] = useState(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [loginResponse, setLoginResponse] = useState(null);
  // Validation functions for each field
  const validateUsername = (studentId) => {
    const regex = /^stu\d{6,8}@dpf\.edu\.lk$/;
    return regex.test(studentId);
  };
  const location = useLocation();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;

    // Reset all error states
    setUsernameError("");
    setPasswordError("");
    setProjectError("");
    setHomeworkError("");
    setPcIdError("");
    setCertificatesError("");

    // Check if studentId is valid
    if (!validateUsername(studentId)) {
      isValid = false;
      setUsernameError(
        "studentId must match the pattern: stu*******@dpf.edu.lk (only numbers after 'stu')."
      );
    }

    // Check if password is empty
    if (password.trim() === "") {
      isValid = false;
      setPasswordError("Password is required.");
    }

    // Check if project is selected and valid
    if (
      project.trim() === "" ||
      (project !== "University of Moratuwa" && !data.includes(project))
    ) {
      isValid = false;
      setProjectError("Please select a valid project.");
    }

    // Check if homework is empty
    if (homework.trim() === "") {
      isValid = false;
      setHomeworkError("Homework details are required.");
    } else {
      const homeworkValue = parseInt(homework.trim(), 10);

      // Check if the input is a valid number
      if (isNaN(homeworkValue)) {
        isValid = false;
        setHomeworkError("Please enter a valid number.");
      }
      // Check if the number is between 0 and 252
      else if (homeworkValue < 0 || homeworkValue > 252) {
        isValid = false;
        setHomeworkError("Homework must be between 0 and 252.");
      }
    }

    // Check if PC ID is empty
    const suffixRegex = /(0[1-9]|1[0-9]|2[0-1])$/;

    if (pcId.trim() === "") {
      isValid = false;
      setPcIdError("PC ID is required.");
    } else if (!pcId.startsWith("pc") || !suffixRegex.test(pcId.slice(-2))) {
      isValid = false;
      setPcIdError("Invalid format. Suffix must be between 01-21.");
    } else {
      const pcBaseNumber = pcId.slice(2, -2); // Extract the base number (without 'pc' and suffix)
      if (!idmodel.includes(pcBaseNumber)) {
        isValid = false;
        setPcIdError("Base number is invalid.");
      } else {
        setPcIdError(""); // Clear error
      }
    }

    // Check if certificates field is required (only for "University of Moratuwa")
    if (project === "University of Moratuwa") {
      const certificatesValue = parseInt(certificates.trim(), 10);

      // Check if the certificates input is empty
      if (certificates.trim() === "") {
        isValid = false;
        setCertificatesError(
          "Number of certificates is required for 'University of Moratuwa'."
        );
      }
      // Check if the input is a valid number
      else if (isNaN(certificatesValue)) {
        isValid = false;
        setCertificatesError("Please enter a valid number for certificates.");
      }
      // Check if the number is between 0 and 5
      else if (certificatesValue < 0 || certificatesValue > 5) {
        isValid = false;
        setCertificatesError(
          "The number of certificates must be between 0 and 5."
        );
      }
    }

    return isValid;
  };

  // Real-time validation handlers
  const handleBlur = (field) => {
    switch (field) {
      case "studentId":
        if (!validateUsername(studentId)) {
          setUsernameError(
            "studentId must match the pattern: stu*******@dpf.edu.lk."
          );
        }
        break;
      case "password":
        if (password.trim() === "") {
          setPasswordError("Password is required.");
        }
        break;
      case "project":
        if (
          project.trim() === "" ||
          (project !== "University of Moratuwa" && !data.includes(project))
        ) {
          setProjectError("Please select a valid project.");
        }
        break;
      case "homework":
        if (homework.trim() === "") {
          setHomeworkError("Homework details are required.");
        }
        break;
      case "pcId":
        if (pcId.trim() === "") {
          setPcIdError("PC ID is required.");
        }
        break;
      case "certificates":
        if (
          project === "University of Moratuwa" &&
          certificates.trim() === ""
        ) {
          setCertificatesError("Number of certificates is required.");
        }
        break;
      default:
        break;
    }
  };

  // Handle the change for input fields
  const handleChange = (setter, field) => (e) => {
    const value = e.target.value;
    setter(value);
    switch (field) {
      case "studentId":
        setUsernameError("");
        break;
      case "password":
        setPasswordError("");
        break;
      case "project":
        setProjectError("");
        break;
      case "homework":
        setHomeworkError("");
        break;
      case "pcId":
        setPcIdError("");
        break;
      case "certificates":
        setCertificatesError("");
        break;
      default:
        break;
    }
  };

  // Form submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        // Step 1: Verify login credentials
        const verifyResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/students/verify`, // A verification endpoint
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId,
              password,
            }),
          }
        );

        const verifyResult = await verifyResponse.json();

        if (verifyResponse.ok) {
          setIsConfirmationVisible(true);
          const fetchedLoginResponse = {
            fullname: verifyResult.fullname, // Ensure fullname is extracted from server
            id: verifyResult.id, // Ensure fullname is extracted from server
          };
          setLoginResponse(fetchedLoginResponse);
          localStorage.setItem("id_token", verifyResult.id);
        } else {
          toast.error(verifyResult.error || "Something went wrong!");
        }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
  }, []);
  // Create data with 1 to 324 and include "University of Moratuwa"
  const data = Array.from({ length: 324 }, (_, index) =>
    (index + 1).toString()
  );
  data.push("University of Moratuwa");

  // State for input, filtered results, and selected item
  const [input, setInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Handle input change and filter data
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() !== "") {
      const matches = data.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(matches);
    } else {
      setFilteredData([]);
    }
  };

  // Handle selection of a filtered item
  const handleSelectItem = (item) => {
    setInput(item);
    setFilteredData([]);
    setProject(item);
  };

  // Show the success message from state when the component loads
  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage); // Display toast notification

      // Clear the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  <ToastContainer position="top-right" autoClose={3000} />;

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/centers/register`
        );
        setIdmodel(response.data.Idmodel);
      } catch (error) {
        console.error("Failed to fetch centers", error);
      }
    };

    fetchCenters();
  }, []);
  return (
    <div>
      {!token ? (
        <div className="flex flex-col md:flex-row h-screen bg-gray-900">
          {/* Image Section */}
          <div
            className="hidden md:flex md:w-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${MdaLogo})` }}
          >
            {/* Placeholder for Image */}
          </div>

          {/* Form Section */}
          <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-800 p-6">
            <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-md text-white">
              <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* studentId Field */}
                <div>
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Student ID
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={studentId}
                    onChange={handleChange(setStudentId, "studentId")}
                    onBlur={() => handleBlur("studentId")}
                    className="mt-1 block w-full px-3 bg-gray-500 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your studentId"
                  />
                  {usernameError && (
                    <p className="text-red-400 text-sm mt-2">{usernameError}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange(setPassword, "password")}
                    onBlur={() => handleBlur("password")}
                    className="mt-1 block w-full px-3 py-2 bg-gray-500 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                  />
                  {passwordError && (
                    <p className="text-red-400 text-sm mt-2">{passwordError}</p>
                  )}
                </div>

                {/* Project Field */}
                <div>
                  <label
                    htmlFor="project"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Project
                  </label>
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 bg-gray-500 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter project details"
                  />

                  {/* Scrollable list container */}
                  <div className="mt-2 max-h-32 overflow-y-auto rounded-md">
                    <ul>
                      {filteredData.map((item) => (
                        <li
                          key={item}
                          className="cursor-pointer hover:bg-gray-700 p-1"
                          onClick={() => handleSelectItem(item)}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {projectError && (
                    <p className="text-red-400 text-sm mt-2">{projectError}</p>
                  )}
                </div>

                {/* Homework Field */}

                <div>
                  <label
                    htmlFor="homework"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Homework
                  </label>
                  <input
                    type="text"
                    id="homework"
                    name="homework"
                    value={homework}
                    onChange={handleChange(setHomework, "homework")}
                    onBlur={() => handleBlur("homework")}
                    className="mt-1 block w-full px-3 py-2 bg-gray-500 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter homework details"
                  />
                  {homeworkError && (
                    <p className="text-red-400 text-sm mt-2">{homeworkError}</p>
                  )}
                </div>

                {/* PC ID Field */}
                <div>
                  <label
                    htmlFor="pcId"
                    className="block text-sm font-medium text-gray-300"
                  >
                    PC ID
                  </label>
                  <input
                    type="text"
                    id="pcId"
                    name="pcId"
                    value={pcId}
                    onChange={handleChange(setPcId, "pcId")}
                    onBlur={() => handleBlur("pcId")}
                    className="mt-1 block w-full px-3 py-2 bg-gray-500 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your PC ID"
                  />
                  {pcIdError && (
                    <p className="text-red-400 text-sm mt-2">{pcIdError}</p>
                  )}
                </div>

                {/* Certificates Field */}
                {project === "University of Moratuwa" && (
                  <div>
                    <label
                      htmlFor="certificates"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Number of Certificates
                    </label>
                    <input
                      type="text"
                      id="certificates"
                      name="certificates"
                      value={certificates}
                      onChange={handleChange(setCertificates, "certificates")}
                      onBlur={() => handleBlur("certificates")}
                      className="mt-1 block w-full px-3 py-2 border bg-gray-500 border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter number of certificates"
                    />
                    {certificatesError && (
                      <p className="text-red-400 text-sm mt-2">
                        {certificatesError}
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Login
                  </button>
                </div>
                <p className="text-sm mt-4 text-center">
                  Don`t have an account?{" "}
                  <Link
                    to="/register"
                    className="text-indigo-400 hover:text-indigo-500"
                  >
                    Register
                  </Link>
                </p>
              </form>
            </div>
            <span
              type="button"
              className="absolute top-4 right-4 py-2 px-4  text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 cursor-pointer"
            >
              <Link to="/admin-login">
                <FaSignInAlt size={25} className="mr-2" />
              </Link>
            </span>
          </div>
        </div>
      ) : (
        <Dashboard token={token} />
      )}
      {isConfirmationVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 h-auto text-white">
            <h3 className="text-4xl font-semibold mb-2 text-center">
              Hello... {loginResponse?.fullname}
            </h3>
            <p className="text-xl font-semibold mb-4 text-center">
              Welcome to My Dream Academy
            </p>
            <div className="flex space-x-4 justify-center gap-24">
              <button
                onClick={async () => {
                  try {
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    // Proceed with backend update after confirmation
                    const updateResponse = await fetch(
                      `${import.meta.env.VITE_API_URL}/users/login`, // Actual login endpoint
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          studentId,
                          password,
                          project,
                          homework,
                          pcId,
                          certificates,
                        }),
                      }
                    );

                    const updateResult = await updateResponse.json();

                    if (updateResponse.ok) {
                      toast.success("Login successful!");
                      setToken(updateResult.token);
                      localStorage.setItem("token", updateResult.token);
                      setIsConfirmationVisible(false);
                      setTimeout(() => {
                        navigate("/");
                      }, 2000);
                    } else {
                      toast.error(updateResult.message);
                    }
                  } catch (error) {
                    console.error("Error during backend update:", error);
                    toast.error("An unexpected error occurred.");
                  }
                }}
                className="px-4 py-2 w-auto bg-indigo-600 text-white rounded-md"
              >
                IT`S ME
              </button>

              <button
                onClick={() => setIsConfirmationVisible(false)}
                className="px-4 py-2 w-auto bg-gray-500 text-white rounded-md"
              >
                NOT ME
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
