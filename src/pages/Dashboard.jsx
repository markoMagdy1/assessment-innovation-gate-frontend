import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [reassigningId, setReassigningId] = useState(null);
  const [reassignEmail, setReassignEmail] = useState('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const userId = user?.id ?? 0;

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/tasks?${params}`);
      setTasks(data.data);
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(filters);
  }, [fetchTasks, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => setFilters({ status: '', priority: '' });

  const toggleComplete = async (id) => {
    setActionLoading(true);
    setError('');
    try {
      await api.post(`/tasks/${id}/toggle`);
      await fetchTasks(filters);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setActionLoading(true);
    setError('');
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks(filters);
    } finally {
      setActionLoading(false);
    }
  };

  const startReassign = (taskId, currentEmail) => {
    setReassigningId(taskId);
    setReassignEmail(currentEmail || '');
  };

  const cancelReassign = () => {
    setReassigningId(null);
    setReassignEmail('');
  };

  const handleReassign = async (taskId) => {
    if (!reassignEmail) {
      setError('Please enter an email for reassignment.');
      return;
    }
    setActionLoading(true);
    setError('');
    try {
      await api.post(`/tasks/${taskId}/reassign`, { email: reassignEmail });
      await fetchTasks(filters);
      cancelReassign();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reassign task.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatus = (task) => {
    const today = new Date();
    const due = new Date(task.due_date);
    if (task.is_completed) return 'Done';
    if (due.toDateString() === today.toDateString()) return 'Due Today';
    if (due < today) return 'Missed/Late';
    return 'Pending';
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Done':
        return 'bg-success';
      case 'Due Today':
        return 'bg-warning text-dark';
      case 'Missed/Late':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  if (!user) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5 w-100">
      <div className="d-flex justify-content-between align-items-center mb-3 w-100">
        <h3 className="text-success fw-semibold">My Tasks</h3>
        <div className="d-flex align-items-center">
          <select
            name="status"
            className="form-select me-2"
            style={{ width: '180px' }}
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="Done">Done</option>
            <option value="Due Today">Due Today</option>
            <option value="Missed/Late">Missed/Late</option>
            <option value="Pending">Pending</option>
          </select>

          <select
            name="priority"
            className="form-select me-2"
            style={{ width: '160px' }}
            value={filters.priority}
            onChange={handleFilterChange}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button onClick={clearFilters} className="btn btn-outline-secondary me-2">
            Reset
          </button>

          <Link to="/task/new" className="btn btn-success">
            + New Task
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p className="text-center fs-5">Loading tasks...</p>
      ) : (
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assignee</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const status = getStatus(task);
                const isCreator = task.creator_id === userId;
                const isAssignee = task.assignee_id === userId;

                return (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{new Date(task.due_date).toLocaleDateString()}</td>
                    <td className="text-capitalize">{task.priority || 'Medium'}</td>
                    <td>
                      <span className={`badge ${getBadgeClass(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      {reassigningId === task.id && isCreator ? (
                        <div className="d-flex">
                          <input
                            type="email"
                            className="form-control form-control-sm me-2"
                            placeholder="Enter assignee email"
                            value={reassignEmail}
                            onChange={(e) => setReassignEmail(e.target.value)}
                          />
                          <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => handleReassign(task.id)}
                            disabled={actionLoading}
                          >
                            {actionLoading ? 'Reassigning...' : 'Save'}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={cancelReassign}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        task.assignee.email || 'Unassigned'
                      )}
                    </td>
                    <td className="text-end">
                      {/* Creator can delete/reassign */}
                      {isCreator && (
                        <>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => startReassign(task.id, task.assignee_email)}
                          >
                            Reassign
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="btn btn-sm btn-outline-danger me-2"
                            disabled={actionLoading}
                          >
                            {actionLoading ? 'Deleting...' : 'Delete'}
                          </button>
                        </>
                      )}
                      {/* Assignee can edit/delete/toggle */}
                      {isAssignee && (
                        <>
                          <Link
                            to={`/task/${task.id}`}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => toggleComplete(task.id)}
                            className={`btn btn-sm ${
                              task.is_completed ? 'btn-outline-secondary' : 'btn-outline-success'
                            } me-2`}
                            disabled={actionLoading}
                          >
                            {actionLoading
                              ? 'Please wait...'
                              : task.is_completed
                              ? 'Undo'
                              : 'Complete'}
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="btn btn-sm btn-outline-danger"
                            disabled={actionLoading}
                          >
                            {actionLoading ? 'Deleting...' : 'Delete'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
