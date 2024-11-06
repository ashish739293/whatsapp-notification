import React, { useState } from 'react';
import Modal from './ScheduleModal';
import './TableStyles.css'; // Styling for the table
import './ModalStyles.css'; // Styling for the modal
import '@fortawesome/fontawesome-free/css/all.min.css';

const Schedule = () => {
  const [data, setData] = useState([
    { id: 1, rollNo: 101, name: 'John Doe', mobile: '9876543210', email: 'john@example.com', year: '1st', branch: 'CSE', status: 'Active' },
    { id: 2, rollNo: 102, name: 'Jane Smith', mobile: '8765432109', email: 'jane@example.com', year: '2nd', branch: 'ECE', status: 'Completed' },
    // Add more initial data here as needed
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Items per page

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
    closeModal(); // Close modal after saving
  };

  const editRow = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  const deleteRow = (id) => {
    setData(data.filter((item) => item.id !== id));
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
    <div className="page-container">
      <h1 className="page-title">Schedule</h1>

      <div className="toolbar">
        <button className="save-btn" onClick={openModal}>
          <i className="fas fa-plus"></i>Add Students
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th onClick={() => sortTable('id')}>ID</th>
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
          {currentItems.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.rollNo}</td>
              <td>{row.name}</td>
              <td>{row.mobile}</td>
              <td>{row.email}</td>
              <td>{row.year}</td>
              <td>{row.branch}</td>
              <td>{row.status}</td>
              <td>
                <button className="edit-btn" onClick={() => editRow(row)}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="delete-btn" onClick={() => deleteRow(row.id)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          &lt; Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next &gt;
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveData}
        editData={editData}
      />
    </div>
  );
};

export default Schedule;
