import React, { useState, useEffect } from 'react';
import Modal from './TimeTableModal';
import './TableStyles.css';
import './ModalStyles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TimeTable = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: '_id', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetch('http://localhost:5000/api/getSaveTimeTables')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const openModal = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const saveData = (newData) => {
    if (editData) {
      setData(data.map((item) => (item._id === editData._id ? newData : item)));
    } else {
      setData([...data, { ...newData, _id: `${data.length + 1}` }]);
    }
    closeModal();
  };

  const editRow = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  const deleteRow = (id) => {
    setData(data.filter((item) => item._id !== id));
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="page-container">
      <h1 className="page-title">Time Table</h1>

      <div className="toolbar">
        <button className="save-btn" onClick={openModal}>
          <i className="fas fa-plus"></i> Add Schedule
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            {/* <th onClick={() => sortTable('_id')}>ID</th> */}
            <th onClick={() => sortTable('branch')}>Branch</th>
            <th onClick={() => sortTable('year')}>Year</th>
            <th onClick={() => sortTable('day')}>Day</th>
            <th onClick={() => sortTable('startTime')}>Start Time</th>
            <th onClick={() => sortTable('endTime')}>End Time</th>
            <th onClick={() => sortTable('subject')}>Subject</th>
            <th onClick={() => sortTable('teacher')}>Teacher</th>
            <th onClick={() => sortTable('classroom')}>Classroom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row) => (
            <tr key={row._id}>
              {/* <td>{row._id}</td> */}
              <td>{row.branch?.name || 'N/A'}</td>
              <td>{row.year?.name || 'N/A'}</td>
              <td>{row.day}</td>
              <td>{row.startTime}</td>
              <td>{row.endTime}</td>
              <td>{row.subject?.name || 'N/A'}</td>
              <td>{row.teacher?.name || 'N/A'}</td>
              <td>{row.classroom?.roomNumber || 'N/A'}</td>
              <td>
                <button className="edit-btn" onClick={() => editRow(row)}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="delete-btn" onClick={() => deleteRow(row._id)}>
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

export default TimeTable;
