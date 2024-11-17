import React, { useState, useEffect } from 'react';
import Modal from './TimeTableModal';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TimeTable = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: '_id', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);



 const fetchTabledata = async()=>{

  fetch('http://localhost:5000/api/getSaveTimeTables')
  .then((response) => response.json())
  .then((data) => setData(data))
  .catch((error) => console.error('Error fetching data:', error));

  }
  useEffect(() => {
    fetchTabledata();
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
    console.log("<><><><row>><>>",row);
    setEditData(row);
    setModalOpen(true);
  };

  const deleteRow = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/deleteTimeTable/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData(data.filter((item) => item._id !== id));
      } else {
        console.error('Failed to delete the row.');
      }
    } catch (error) {
      console.error('Error deleting row:', error);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="container my-4">
      <h1 className="text-center text-success mb-4">Time Table</h1>

      {/* <div className="justify-content-end mb-3">
        <button className="btn btn-sm btn-primary" onClick={openModal}>
          <i className="fas fa-plus"></i> Add Schedule
        </button>
      </div> */}

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success btn-sm d-inline-flex align-items-center " onClick={openModal} style={{ width: 'auto' }}>
          <i className="fas fa-plus me-2"></i>Add TimeTable
        </button>
      </div>

      <table class="table table-striped table-hover table-bordered table-responsive-md">
      <thead className="table-success p-4">
          <tr>
            <th onClick={() => sortTable('branch')} style={{ cursor: 'pointer' }}>Branch</th>
            <th onClick={() => sortTable('year')} style={{ cursor: 'pointer' }}>Year</th>
            <th onClick={() => sortTable('day')} style={{ cursor: 'pointer' }}>Day</th>
            <th onClick={() => sortTable('startTime')} style={{ cursor: 'pointer' }}>Start Time</th>
            <th onClick={() => sortTable('endTime')} style={{ cursor: 'pointer' }}>End Time</th>
            <th onClick={() => sortTable('subject')} style={{ cursor: 'pointer' }}>Subject</th>
            <th onClick={() => sortTable('teacher')} style={{ cursor: 'pointer' }}>Teacher</th>
            <th onClick={() => sortTable('classroom')} style={{ cursor: 'pointer' }}>Classroom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row) => (
            <tr key={row._id}>
              <td>{row.branch?.name || 'N/A'}</td>
              <td>{row.year?.name || 'N/A'}</td>
              <td>{row.day}</td>
              <td>{row.startTime}</td>
              <td>{row.endTime}</td>
              <td>{row.subject?.name || 'N/A'}</td>
              <td>{row.teacher?.name || 'N/A'}</td>
              <td>{row.classroom?.roomNumber || 'N/A'}</td>
              <td>
                <button className="text-warning me-2" onClick={() => editRow(row)}>
                  <i className="fas fa-edit "></i>
                </button>
                <button className="text-danger" onClick={() => deleteRow(row._id)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &lt; Previous
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {currentPage} of {totalPages}
            </span>
          </li>
          <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next &gt;
            </button>
          </li>
        </ul>
      </nav>

      <Modal isOpen={isModalOpen} onClose={closeModal} onSave={saveData} editData={editData} fetchTabledata={fetchTabledata}/>
    </div>
  );
};

export default TimeTable;
