import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const { data } = await api.get('/tasks');
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mt-4">
      <h3>My Tasks</h3>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.due_date}</td>
              <td>{task.priority}</td>
              <td>
                <span
                  className={`badge ${
                    task.status === 'Done'
                      ? 'bg-success'
                      : task.status === 'Due Today'
                      ? 'bg-warning text-dark'
                      : task.status === 'Missed/Late'
                      ? 'bg-danger'
                      : 'bg-secondary'
                  }`}
                >
                  {task.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
