import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {  toast } from 'react-toastify';

const StudentTable = () => {
  const [data, setData] = useState([
    { id: 1, rollNo: 101, name: 'John Doe', mobile: '9876543210', email: 'john@example.com', year: '1st', branch: 'CSE', status: 'Active' },
    { id: 2, rollNo: 102, name: 'Jane Smith', mobile: '8765432109', email: 'jane@example.com', year: '2nd', branch: 'ECE', status: 'Completed' },
    // Add more initial data here as needed
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const openModal = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const saveData = (newData) => {
    if (editData) {
      setData(data.map((item) => (item.id === editData.id ? newData : item)));
    } else {
      setData([...data, { ...newData, id: data.length + 1 }]);
    }
    closeModal();
  };

  const editRow = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  const fetchStudents = async () => {
    const response = await fetch('http://localhost:5000/api/students');
    const result = await response.json();
    setData(result.students);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteRow = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Student Deleted Successfully", {
          position: "top-right",
          autoClose: 2000,         // Closes after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchStudents();
      } else {

        toast.success(data.error, {
          position: "top-right",
          autoClose: 2000,         // Closes after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const sortTable = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Students</h1>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary btn-sm d-inline-flex align-items-center" onClick={openModal} style={{ width: 'auto' }}>
          <i className="fas fa-plus me-2"></i>Add Student
        </button>
      </div>
        
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th onClick={() => sortTable('id')}>Sr. No</th>
              <th onClick={() => sortTable('rollNo')}>Roll No</th>
              <th onClick={() => sortTable('name')}>Name</th>
              <th onClick={() => sortTable('mobile')}>Mobile</th>
              <th onClick={() => sortTable('email')}>Email</th>
              <th onClick={() => sortTable('year')}>Year</th>
              <th onClick={() => sortTable('branch')}>Branch</th>
              <th onClick={() => sortTable('status')}>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row,index) => (
              <tr key={row._id}>
                <td>{index +1}</td>
                <td>{row.rollNo}</td>
                <td>{row.name}</td>
                <td>{row.mobile}</td>
                <td>{row.email}</td>
                <td>{row.year}</td>
                <td>{row.branch}</td>
                <td>{row.status}</td>
                <td>
                  <div className='d-flex'>
                  <button className="text-warning" style={{background:"none"}} onClick={() => editRow(row)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-danger ms-2" style={{background:"none"}} onClick={() => deleteRow(row._id)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                  </div>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > itemsPerPage && (
        <div className="d-flex justify-content-end">
          <nav>
            <ul className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} onSave={fetchStudents} editData={editData} />
    </div>
  );
};

export default StudentTable;
