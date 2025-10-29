import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const userId = user?.id ?? 0;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data);
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleComplete = async (id) => {
    setActionLoading(true);
    try {
      await api.post(`/tasks/${id}/toggle`);
      await fetchTasks();
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
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
        <Link to="/task/new" className="btn btn-success">
          + New Task
        </Link>
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
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const status = getStatus(task);
                const canEdit = task.assignee_id === userId;
                const canDelete = task.assignee_id === userId || task.creator_id === userId;
                const canToggle = task.assignee_id === userId;

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
                    <td className="text-end">
                      {canToggle && (
                        <button
                          onClick={() => toggleComplete(task.id)}
                          className={`btn btn-sm ${
                            task.is_completed
                              ? 'btn-outline-secondary'
                              : 'btn-outline-success'
                          } me-2`}
                          disabled={actionLoading}
                        >
                          {actionLoading
                            ? 'Please wait...'
                            : task.is_completed
                            ? 'Undo'
                            : 'Complete'}
                        </button>
                      )}
                      {canEdit && (
                        <Link
                          to={`/task/${task.id}`}
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          Edit
                        </Link>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="btn btn-sm btn-outline-danger"
                          disabled={actionLoading}
                        >
                          {actionLoading ? 'Deleting...' : 'Delete'}
                        </button>
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
