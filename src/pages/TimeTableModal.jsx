import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, onSave, editData ,fetchTabledata}) => {
  const [formData, setFormData] = useState({
    // id: '',
    year: '',
    branch: '',
    subject: '',
    teacher: '',
    classroom: '',
    status: '',
    startTime: '',
    endTime: '',
    day: '',
  });

  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    branches: [],
    years: [],
    subjects: [],
    teachers: [],
    classrooms: [],
  });

  useEffect(() => {
    setFormData(
      editData || {
        id: '',
        year: '',
        branch: '',
        subject: '',
        teacher: '',
        classroom: '',
        endTime: '',
        startTime: '',
        day: '',
      }
    );
  }, [editData]);

  useEffect(() => {
    fetch('http://localhost:5000/api/getAllData')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.teacher) newErrors.teacher = 'Teacher is required';
    if (!formData.classroom) newErrors.classroom = 'Classroom is required';
    if (!formData.day) newErrors.day = 'Day is required';
    if (!formData.startTime) newErrors.startTime = 'Start date is required';
    if (!formData.endTime) newErrors.endTime = 'End date is required';
    if (
      formData.startTime &&
      formData.endTime &&
      new Date(formData.startTime) >= new Date(formData.endTime)
    ) {
      newErrors.dateRange = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const url = editData
      ? 'http://localhost:5000/api/edit_time'
      : 'http://localhost:5000/api/add_time';

    try {
console.log("<><><>formData<><><><>",formData);
console.log("<><><><><url><><>",url);

      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onSave(formData);
        fetchTabledata();
        onClose();
      } else {
        console.error('Failed to process data:', await response.text());
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={handleOutsideClick}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '10px',
          padding: '20px',
          width: '90%',
          maxWidth: '600px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
          {editData ? 'Edit Time Table' : 'Add Time Table'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {/* Year Field */}
            <div style={{ flex: '1 1 45%' }}>
              <label htmlFor="year">Year</label>
              <select
                id="year"
                name="year"
                value={formData.year._id}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: errors.year ? '1px solid red' : '1px solid #ccc',
                }}
              >
                <option value="">Select Year</option>
                {data.years.map((year) => (
                  <option key={year._id} value={year._id}>
                    {year.name}
                  </option>
                ))}
              </select>
              {errors.year && <span style={{ color: 'red', fontSize: '12px' }}>{errors.year}</span>}
            </div>

            {/* Branch Field */}
            <div style={{ flex: '1 1 45%' }}>
              <label htmlFor="branch">Branch</label>
              <select
                id="branch"
                name="branch"
                value={formData.branch._id}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: errors.branch ? '1px solid red' : '1px solid #ccc',
                }}
              >
                <option value="">Select Branch</option>
                {data.branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {errors.branch && <span style={{ color: 'red', fontSize: '12px' }}>{errors.branch}</span>}
            </div>

            {/* Subject Field */}
            <div style={{ flex: '1 1 45%' }}>
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject._id}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: errors.subject ? '1px solid red' : '1px solid #ccc',
                }}
              >
                <option value="">Select Subject</option>
                {data.subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {errors.subject && <span style={{ color: 'red', fontSize: '12px' }}>{errors.subject}</span>}
            </div>

            {/* Teacher Field */}
            <div style={{ flex: '1 1 45%' }}>
              <label htmlFor="teacher">Teacher</label>
              <select
                id="teacher"
                name="teacher"
                value={formData.teacher._id}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: errors.teacher ? '1px solid red' : '1px solid #ccc',
                }}
              >
                <option value="">Select Teacher</option>
                {data.teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              {errors.teacher && <span style={{ color: 'red', fontSize: '12px' }}>{errors.teacher}</span>}
            </div>

            {/* Classroom Field */}
            <div style={{ flex: '1 1 45%' }}>
              <label htmlFor="classroom">Classroom</label>
              <select
                id="classroom"
                name="classroom"
                value={formData.classroom._id}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: errors.classroom ? '1px solid red' : '1px solid #ccc',
                }}
              >
                <option value="">Select Classroom</option>
                {data.classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {classroom.roomNumber}
                  </option>
                ))}
              </select>
              {errors.classroom && (
                <span style={{ color: 'red', fontSize: '12px' }}>{errors.classroom}</span>
              )}
            </div>

            {/* Day Field */}
            <div style={{ flex: '1 1 45%' }}>
              <label htmlFor="day">Day</label>
              <select
                id="day"
                name="day"
                value={formData.day}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: errors.day ? '1px solid red' : '1px solid #ccc',
                }}
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
              {errors.day && <span style={{ color: 'red', fontSize: '12px' }}>{errors.day}</span>}
            </div>

            {/* Start Date Field */}
            <div style={{ flex: '1 1 45%' }}>
              <label htmlFor="startTime">Start Date</label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: errors.startTime ? '1px solid red' : '1px solid #ccc',
                }}
              />
              {errors.startTime && (
                <span style={{ color: 'red', fontSize: '12px' }}>{errors.startTime}</span>
              )}
            </div>

            {/* End Date Field */}
            <div style={{ flex: '1 1 45%' }}>
              <label htmlFor="endTime">End Date</label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: errors.endTime ? '1px solid red' : '1px solid #ccc',
                }}
              />
              {errors.endTime && (
                <span style={{ color: 'red', fontSize: '12px' }}>{errors.endTime}</span>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px',
            }}
          >
            <button
              type="button"
              style={{
                padding: '10px 15px',
                backgroundColor: '#ccc',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Modal;
