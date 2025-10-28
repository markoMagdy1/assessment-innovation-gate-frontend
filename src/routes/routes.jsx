import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import TaskForm from '../pages/TaskForm';
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/task/new" element={<TaskForm />} />
      <Route path="/task/:id" element={<TaskForm />} />

    </Routes>
  );
}

export default AppRoutes;
