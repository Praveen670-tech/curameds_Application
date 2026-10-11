import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Pill, Eye, EyeOff, ShieldCheck, User, Mail, Lock, Phone, Calendar } from 'lucide-react';
import Notification from '../../components/common/Notification';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'PATIENT',
    phone: '',
    age: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validations
    if (!formData.name.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!formData.username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        phone: formData.phone.trim() || null,
        age: formData.age ? parseInt(formData.age, 10) : null
      };

      await register(payload);
      setSuccess('Account created successfully! Redirecting you to sign in...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error(err);
      let msg = 'Registration failed. Please check your information.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.response?.data?.errors) {
        msg = Object.values(err.response.data.errors).join(', ');
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 150px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      backgroundColor: 'var(--bg-body)',
      background: 'radial-gradient(circle at top, #E6F7F3 0%, #F8FAFC 70%)'
    }}>
      <div className="card glass-card card-3d" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #00A884 0%, #0D9488 100%)',
            color: '#ffffff',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 12px rgba(0, 168, 132, 0.35)'
          }}>
            <Pill size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Create Your Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join the certified healthcare and medicine exchange network
          </p>
        </div>

        {error && <Notification type="error" message={error} onClose={() => setError('')} />}
        {success && <Notification type="success" message={success} />}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              Full Legal Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              className="form-input"
              placeholder="e.g. Praveen Kumar"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Username & Role Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-username">
                Username <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                id="register-username"
                name="username"
                type="text"
                className="form-input"
                placeholder="Choose username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-role">
                Account Type <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                id="register-role"
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="PATIENT">Patient / Individual</option>
                <option value="DONOR">Medicine Donor</option>
                <option value="MEDICAL_SHOP">Medical Shop / Pharmacy</option>
                <option value="NGO">NGO Organization</option>
                <option value="FAMILY_MEMBER">Family Caregiver</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Email Address <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password with Eye Icon Toggle */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              Password <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                id="register-password-eye-btn"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'View password'}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Click the eye icon to verify what you typed.
            </div>
          </div>

          {/* Optional Phone & Age Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-phone">
                Contact Phone
              </label>
              <input
                id="register-phone"
                name="phone"
                type="tel"
                className="form-input"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-age">
                Age
              </label>
              <input
                id="register-age"
                name="age"
                type="number"
                min="1"
                max="120"
                className="form-input"
                placeholder="Years"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            id="register-submit-btn"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem', marginBottom: '1.25rem' }}
            disabled={loading}
          >
            {loading ? 'Registering Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
