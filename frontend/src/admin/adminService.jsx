import axios from 'axios';
import { toast } from 'react-toastify';
// Fetch Admin's center data from backend
export const fetchAdminCenterData = async () => {
  const adminToken = localStorage.getItem('admin_token');
  if (!adminToken) {
    throw new Error('Admin token missing!');
  }

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/${adminToken}`);
    return response.data; 
  } catch (error) {
    console.error();
    throw error;
  }
};
export const fetchStudentData = async (adminCenter) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/admin/data/studentsData`,
      { params: { center: adminCenter } }
    );

    return response?.data?.studentsData || [];
  } catch (error) {
    toast.error("Error fetching students data", error);
    throw error;
  }
};

export const fetchUsersByCenter = async (adminCenter) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/data/online`,
      { params: { center: adminCenter } } // Ensure the query string is properly encoded
    );

    return response?.data?.users || []; // Extract the data safely
  } catch (error) {
    toast.error("Error fetching users data", error);
    throw error;
  }
};