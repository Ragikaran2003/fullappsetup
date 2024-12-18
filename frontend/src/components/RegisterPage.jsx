import { useEffect, useRef, useState } from "react";
import MdaLogo from "../assets/mda.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const RegisterPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const ShowSchedule = () => {
    setIsDialogOpen(true);
  };
  const [Idmodel, setIdmodel] = useState(null);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    grade: "",
    gn: "",
    dob: "",
    gender: "",
    phoneNumber: "",
    parentNumber: "",
    address: "",
    center: "",
  });
  const [errors, setErrors] = useState({});
  const [centers, setCenters] = useState([]);
  const validate = () => {
    const newErrors = {};

    // Validate firstName and lastName
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";

    // Validate studentId format: stu*******@dpf.edu.lk
    const studentIdRegex = /^stu\d{6,8}@dpf\.edu\.lk$/;
    if (!formData.studentId) {
      newErrors.studentId = "Student ID is required.";
    } else if (!studentIdRegex.test(formData.studentId)) {
      newErrors.studentId =
        "Student ID must be in the format stu*******@dpf.edu.lk.";
    }

    // Validate password and confirmPassword
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    // Validate grade and gn division: J/***
    const gnRegex = /^J\/\d{3}$/;
    if (!formData.grade) newErrors.grade = "Please select a grade.";
    if (!formData.gn) {
      newErrors.gn = "Grade is required.";
    } else if (!gnRegex.test(formData.gn)) {
      newErrors.gn = "GN Division must be in the format J/***.";
    }

    // Validate Date of Birth and gender
    if (!formData.dob) newErrors.dob = "Date of Birth is required.";
    if (!formData.gender) newErrors.gender = "Please select your gender.";

    // Validate phoneNumber and parent's phone number: 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required.";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be exactly 10 digits.";
    }
    if (!formData.parentNumber) {
      newErrors.parentNumber = "Parent's Phone Number is required.";
    } else if (!phoneRegex.test(formData.parentNumber)) {
      newErrors.parentNumber =
        "Parent's Phone Number must be exactly 10 digits.";
    }
    if (classes.length === 0) {
      toast.error("Please select at least one class before submitting.");
      return;
    }

    // Validate address and center
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.center) newErrors.center = "Please select a center.";

    // Set errors and return validation result
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form data
    if (!validate()) {
      return; // Stop if validation fails
    }

    // Find index of the selected center
    const index = centers.indexOf(formData.center);

    // Ensure index is valid and check the logic with Idmodel
    if (index !== -1) {
      const firstThreeLetters = formData.studentId.substring(3, 6); // Extracts the first 3 characters

      if (firstThreeLetters !== Idmodel[index]) {
        toast.error("You Center Name and ID do not match.");
        return; // Exit the function on validation error
      }
    } else {
      toast.error("Selected center is invalid.");
      return; // Exit the function if center index is invalid
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/students/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, classes }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Reset form only after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          studentId: "",
          password: "",
          confirmPassword: "",
          grade: "",
          gn: "",
          dob: "",
          gender: "",
          phoneNumber: "",
          parentNumber: "",
          address: "",
          center: "",
        });

        // Only navigate if registration was successful and not already navigating
        if (!isRegistrationSuccessful) {
          setIsRegistrationSuccessful(true); // Prevents multiple submissions
          setTimeout(() => {
            navigate("/", { state: { successMessage: data.message } });
          }, 1000);
        }
      } else {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to connect to the server");
    }
  };

  // Reset registration success flag on page load
  useEffect(() => {
    setIsRegistrationSuccessful(false);
  }, []); // Empty dependency array ensures it runs only once on mount

  const [classes, setClasses] = useState([]);
  const storedValues = useRef([]);

  // Handle checkbox changes
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setClasses((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((item) => item !== value);
      }
    });
  };

  // Handle form submission
  const handleSubmitclasses = () => {
    // Store selected classes in the variable
    storedValues.current = classes;
    // console.log("Stored Classes:", storedValues.current);
    handleCloseDialog();
  };
  const grades = ["5", "6", "7", "8", "9", "10", "O/L", "A/L", "S/L"];

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/centers/register`
        );
        setCenters(response.data.centers);
        setIdmodel(response.data.Idmodel);
      } catch (error) {
        console.error("Failed to fetch centers", error);
      }
    };

    fetchCenters();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen ">
      {/* Image Section */}

      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${MdaLogo})` }}
        aria-label="Background Image"
      >
        {/* Placeholder for Image */}
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-800 p-6">
        <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-md text-white">
          <h2 className="text-2xl font-bold mb-2 text-center">Register</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-1 border bg-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-1 border bg-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="studentId" className="block text-sm font-medium">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-1 border bg-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your student ID"
              />
              {errors.studentId && (
                <p className="text-red-500 text-xs">{errors.studentId}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-500 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-1 bg-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="grade" className="block text-sm font-medium">
                  Grade
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="mt-1 block bg-gray-500 w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option>-- Select --</option>
                  {grades.map((grade1, index) => (
                    <option key={index} value={grade1}>
                      {grade1}
                    </option>
                  ))}
                </select>
                {errors.grade && (
                  <p className="text-red-500 text-xs">{errors.grade}</p>
                )}
              </div>

              <div>
                <label htmlFor="gn" className="block text-sm font-medium">
                  Gn Division
                </label>
                <input
                  type="text"
                  id="gn"
                  name="gn"
                  value={formData.gn}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-1 bg-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Gn Division"
                />
                {errors.gn && (
                  <p className="text-red-500 text-xs">{errors.gn}</p>
                )}
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-1 bg-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs">{errors.dob}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Gender</label>
                <div className="flex items-center space-x-4 mt-1">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                      className="mr-2 bg-gray-500"
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      className="mr-2"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                    />
                    Female
                  </label>
                  {errors.gender && (
                    <p className="text-red-500 text-xs">{errors.gender}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="classes" className="block text-sm font-medium">
                  Classes
                </label>
                <button
                  onClick={ShowSchedule}
                  type="button"
                  className="text-white bg-purple-500 hover:bg-purple-600 focus:outline-none font-medium rounded-lg text-sm px-5 py-2"
                >
                  Show Schedule
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-1 border bg-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="parentNumber"
                  className="block text-sm font-medium"
                >
                  Parents Number
                </label>
                <input
                  type="tel"
                  id="parentNumber"
                  name="parentNumber"
                  value={formData.parentNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-1 bg-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your parent number"
                />
                {errors.parentNumber && (
                  <p className="text-red-500 text-xs">{errors.parentNumber}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-1 border bg-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your Address"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs">{errors.address}</p>
                )}
              </div>
              <div>
                <label htmlFor="center" className="block text-sm font-medium">
                  Center
                </label>
                <select
                  id="center"
                  name="center"
                  value={formData.center}
                  onChange={handleChange}
                  className="mt-1 bg-gray-500 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option>-- Select --</option>
                  {centers.map((center, index) => (
                    <option key={index} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
                {errors.center && (
                  <p className="text-red-500 text-xs">{errors.center}</p>
                )}
              </div>
            </div>

            {/* Dailog box */}
            {isDialogOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto">
                  <h2 className="text-2xl font-bold mb-4">Schedule</h2>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 px-2 py-1">
                          Time
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Monday
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Tuesday
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Wednesday
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Thursday
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Friday
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Saturday
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Sunday
                        </th>
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
                          <th className="border border-gray-300 px-2 py-1">
                            {time}
                          </th>
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
                                checked={classes.includes(`${day} ${time}`)}
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
                      onClick={handleSubmitclasses}
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

            <a href="/register">
              <button
                type="submit"
                className="mt-2 w-full py-1 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </a>
          </form>
        </div>
      </div>
      {/* <ScheduleDialog isOpen={isDialogOpen} onClose={handleCloseDialog} /> */}
    </div>
  );
};

export default RegisterPage;
