import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function TaskForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    assignee_email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    if (id) fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const { data } = await api.get(`/tasks/${id}`);
      setForm({
        title: data.data.title,
        description: data.data.description || '',
        due_date: data.data.due_date,
        priority: data.data.priority || 'medium',
        assignee_email: data.data.assignee?.email || '',
      });
    } catch (err) {
      setError('Failed to load task.');
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (id) {
        await api.put(`/tasks/${id}`, form);
      } else {
        await api.post('/tasks', form);
      }
      navigate('/');
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors
          ? Object.values(err.response.data.data.errors)[0][0]
          : err.response?.data?.message || 'Something went wrong.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div
        className="card shadow-sm p-4"
        style={{ width: '700px', borderRadius: '12px' }}
      >
        <h4 className="text-center mb-4 text-success fw-semibold">
          {id ? 'Edit Task 📝' : 'Create New Task 🧾'}
        </h4>

        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Task title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Task description"
              rows="3"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3 text-start">
              <label className="form-label fw-semibold">Due Date</label>
              <input
                type="date"
                name="due_date"
                className="form-control"
                value={form.due_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3 text-start">
              <label className="form-label fw-semibold">Priority</label>
              <select
                name="priority"
                className="form-select"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Assignee Email</label>
            <input
              type="email"
              name="assignee_email"
              className="form-control"
              placeholder="Enter assignee email"
              value={form.assignee_email}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 mt-2"
            disabled={loading}
          >
            {loading
              ? id
                ? 'Updating Task...'
                : 'Creating Task...'
              : id
              ? 'Update Task'
              : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}
