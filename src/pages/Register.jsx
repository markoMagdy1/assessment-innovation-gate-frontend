import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.password_confirmation
      );
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.errors) {
          const firstError = Object.values(err.response.data.errors)[0][0];
          setError(firstError);
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Registration failed due to a network or server issue.');
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-sm p-4"
        style={{ width: '400px', borderRadius: '12px' }}
      >
        <h4 className="text-center mb-4 text-success fw-semibold">
          Create Account ✨
        </h4>

        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              className="form-control"
              placeholder="Re-enter password"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 mt-2"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-decoration-none text-success fw-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
