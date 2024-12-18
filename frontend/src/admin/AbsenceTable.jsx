import { useState, useEffect } from 'react';
import { FaDownload, FaSort } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const AbsenceTable = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(6); // Set the number of students per page
  const [sortConfig, setSortConfig] = useState(null);
  const [visiblePages, setVisiblePages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // Fetch student data from the public folder
  useEffect(() => {
    fetch('/students.json') // Adjust the path as needed
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error('Error loading data:', error));
  }, []);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedStudents = [...students].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setStudents(sortedStudents);
    setSortConfig({ key, direction });
  };

  // Get current students for the page
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const startPage = Math.floor((pageNumber - 1) / 10) * 10 + 1;
    const endPage = startPage + 9;
    const newVisiblePages = [];
    for (let i = startPage; i <= Math.min(endPage, Math.ceil(students.length / studentsPerPage)); i++) {
      newVisiblePages.push(i);
    }
    setVisiblePages(newVisiblePages);
  };

  // Download as Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'students.xlsx');
  };

  // Pagination controls
  const totalPageNumbers = Math.ceil(students.length / studentsPerPage);

  return (
    <div className="p-4 bg-gray-900 shadow-lg text-white">
      <h2 className="text-3xl font-semibold mb-2">Absences for 2 Classes</h2>
      <p className="mb-2">Here you can list all students with their absence details.</p>

      <button
        onClick={downloadExcel}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-2 mb-2 flex items-center hover:bg-blue-700 transition duration-200"
      >
        <FaDownload className="mr-2" /> Download as Excel
      </button>

      <div className="overflow-auto" style={{ maxHeight: '400px' }}>
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort('id')}>
                ID <FaSort className="inline ml-2" />
              </th>
              <th className="p-4 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort('name')}>
                Name <FaSort className="inline ml-2" />
              </th>
              <th className="p-4 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort('phone')}>
                Phone No <FaSort className="inline ml-2" />
              </th>
              <th className="p-4 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort('last_login')}>
                Last Seen <FaSort className="inline ml-2" />
              </th>
              <th className="p-4 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort('class')}>
                Class Time <FaSort className="inline ml-2" />
              </th>
              <th className="p-4 text-left text-sm font-medium">Action</th>
              <th className="p-4 text-left text-sm font-medium">Note</th>
              <th className="p-4 text-left text-sm font-medium">Reason_1</th>
              <th className="p-4 text-left text-sm font-medium">Reason_2</th>
              <th className="p-4 text-left text-sm font-medium">Reason_3</th>
              <th className="p-4 text-left text-sm font-medium">Dropout</th>
            </tr>
          </thead>
          <tbody className="text-white bg-gray-800">
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-700 cursor-pointer">
                  <td className="p-4 text-sm">{student.id}</td>
                  <td className="p-4 text-sm">{student.name}</td>
                  <td className="p-4 text-sm">{student.phone}</td>
                  <td className="p-4 text-sm">{student.last_login}</td>
                  <td className="p-4 text-sm">{student.class}</td>
                  <td className="p-4 text-sm">
                    {student.reason_1 === '' && (
                      <button className="bg-blue-500 text-white px-2 py-1 rounded mb-2">Call_1</button>
                    )}
                    {student.reason_2 === '' && (
                      <button className="bg-yellow-500 text-white px-2 py-1 rounded mb-2">Call_2</button>
                    )}
                    {student.reason_3 === '' && (
                      <button className="bg-red-500 text-white px-2 py-1 rounded mb-2">Call_3</button>
                    )}
                  </td>
                  <td className="p-4 text-sm">{student.note}</td>
                  <td className="p-4 text-sm">{student.reason_1}</td>
                  <td className="p-4 text-sm">{student.reason_2}</td>
                  <td className="p-4 text-sm">{student.reason_3}</td>
                  <td className="p-4 text-sm">
                    <button className="bg-red-500 text-white px-4 py-2 rounded">Dropout</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center p-4 text-gray-500">Loading data...</td>
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
            className={`py-2 px-4 rounded-lg ${currentPage === number ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'}`}
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
    </div>
  );
};

export default AbsenceTable;
