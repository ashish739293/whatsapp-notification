import React, { useState, useEffect } from 'react';
import './TimeTableModalStyles.css'; // Modal-specific styles

const Modal = ({ isOpen, onClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    id: '',
    year: '',
    branch: '',
    status: '',
    startDate: '',
    endDate: '',
    day: ''
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        id: '',
        year: '',
        branch: '',
        status: '',
        startDate: '',
        endDate: '',
        day: ''
      });
    }
  }, [editData]);

  const [data, setData] = useState({
    branches: [],
    years: [],
    subjects: [],
    teachers: [],
    classrooms: [],
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/getAllData')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleOutsideClick}>
      <div className="modal-content">
        <h2>{editData ? 'Edit Student' : 'Add Student'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <select id="year" name="year" value={formData.year} onChange={handleChange}>
                <option value="">Select Year</option>
                {data.years.map((year) => (
                  <option key={year._id} value={year._id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="branch">Branch</label>
              <select id="branch" name="branch" value={formData.branch} onChange={handleChange}>
                <option value="">Select Branch</option>
                {data.branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" value={formData.subject} onChange={handleChange}>
                <option value="">Select Subject</option>
                {data.subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="teacher">Teacher</label>
              <select id="teacher" name="teacher" value={formData.teacher} onChange={handleChange}>
                <option value="">Select Teacher</option>
                {data.teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="classroom">Classroom</label>
              <select id="classroom" name="classroom" value={formData.classroom} onChange={handleChange}>
                <option value="">Select Classroom</option>
                {data.classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {classroom.roomNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="day">Day</label>
              <select name="day" value={formData.day} onChange={handleChange}>
                <option value="">Select Day</option>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((dayOption) => (
                  <option key={dayOption} value={dayOption}>
                    {dayOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date & Time</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                placeholder="Select start date & time"
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date & Time</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                placeholder="Select end date & time"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
