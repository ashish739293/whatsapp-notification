import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  toast } from 'react-toastify';

const Modal = ({ isOpen, onClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    id: '',
    rollNo: '',
    name: '',
    mobile: '',
    email: '',
    year: '',
    branch: '',
    status: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false); // Track whether the form has been submitted

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        id: '',
        rollNo: '',
        name: '',
        mobile: '',
        email: '',
        year: '',
        branch: '',
        status: ''
      });
    }
    setErrors({}); // Reset errors when modal opens
    setSubmitted(false); // Reset submission status when modal opens
  }, [editData, isOpen]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      // Clear error for the specific field if the user starts typing
      if (errors[name]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: ''
        }));
      }
      return updatedData;
    });
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.rollNo || isNaN(formData.rollNo)) newErrors.rollNo = 'Roll No is required and must be a number.';
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.mobile || isNaN(formData.mobile) || formData.mobile.length !== 10) newErrors.mobile = 'Mobile must be a 10-digit number.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is required and must be valid.';
    if (!formData.year) newErrors.year = 'Year selection is required.';
    if (!formData.branch) newErrors.branch = 'Branch selection is required.';
    if (!formData.status) newErrors.status = 'Status selection is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Mark the form as submitted

    if (!validateForm()) return;

    try {
      if (editData) {

        try {
          const response = await fetch(`http://localhost:5000/api/students/${editData._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            toast.success("Student Updated Successfully", {
              position: "top-right",
              autoClose: 2000,         // Closes after 3 seconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            
            console.log('Student Updated:', data);
          } else {

            toast.error(data.error, {
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
          console.error('Error updating student:', error);
        }

      } else {


        try {
          const response = await fetch('http://localhost:5000/api/students', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          const data = await response.json();
          if (response.ok) {
            toast.success("Student Created Successfully", {
              position: "top-right",
              autoClose: 2000,         // Closes after 3 seconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            console.log('Student Created:', data);
          } else {

            toast.error(data.error, {
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
          console.error('Error creating student:', error);
        }

      }
      onSave(); // Notify parent component
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h5 className="modal-title">{editData ? 'Edit Student' : 'Add Student'}</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">X</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="rollNo">Roll No</label>
                  <input
                    type="number"
                    className={`form-control ${submitted && errors.rollNo ? 'is-invalid' : ''}`}
                    id="rollNo"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">{submitted && errors.rollNo}</div>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className={`form-control ${submitted && errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">{submitted && errors.name}</div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="mobile">Mobile</label>
                  <input
                    type="number"
                    className={`form-control ${submitted && errors.mobile ? 'is-invalid' : ''}`}
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">{submitted && errors.mobile}</div>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className={`form-control ${submitted && errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">{submitted && errors.email}</div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="year">Year</label>
                  <select
                    className={`form-control ${submitted && errors.year ? 'is-invalid' : ''}`}
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                  </select>
                  <div className="invalid-feedback">{submitted && errors.year}</div>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="branch">Branch</label>
                  <select
                    className={`form-control ${submitted && errors.branch ? 'is-invalid' : ''}`}
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="EE">EE</option>
                  </select>
                  <div className="invalid-feedback">{submitted && errors.branch}</div>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="status">Status</label>
                  <select
                    className={`form-control ${submitted && errors.status ? 'is-invalid' : ''}`}
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                  <div className="invalid-feedback">{submitted && errors.status}</div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
