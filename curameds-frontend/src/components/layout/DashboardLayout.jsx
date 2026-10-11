import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Pill, 
  HeartHandshake, 
  Repeat, 
  Store, 
  Users, 
  Trash2, 
  Tag, 
  History, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export default function DashboardLayout({ title, subtitle, children, actions }) {
  const { user, hasRole } = useAuth();

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.65rem 1.1rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
    backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap'
  });

  return (
    <div style={{ padding: '2rem 0', minHeight: 'calc(100vh - 150px)', backgroundColor: 'var(--bg-body)' }}>
      <div className="container">
        {/* Header Banner */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem 2rem',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-info">
                <UserCheck size={13} /> {user?.role || 'User'} Mode
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Active Session: <strong>{user?.username}</strong>
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {title || 'Health & Medicine Hub'}
            </h1>
            {subtitle && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {actions}
            </div>
          )}
        </div>

        {/* Horizontal Navigation Tabs */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '0.5rem',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          gap: '0.35rem',
          overflowX: 'auto',
          marginBottom: '2rem'
        }}>
          <NavLink to="/dashboard" end style={navItemStyle}>
            <Pill size={17} />
            <span>Medicines</span>
          </NavLink>

          <NavLink to="/dashboard/donations" style={navItemStyle}>
            <HeartHandshake size={17} />
            <span>Donations</span>
          </NavLink>

          <NavLink to="/dashboard/exchanges" style={navItemStyle}>
            <Repeat size={17} />
            <span>Peer Exchanges</span>
          </NavLink>

          <NavLink to="/dashboard/inventory" style={navItemStyle}>
            <Store size={17} />
            <span>Shop Inventory</span>
          </NavLink>

          <NavLink to="/dashboard/family" style={navItemStyle}>
            <Users size={17} />
            <span>Family Care</span>
          </NavLink>

          <NavLink to="/dashboard/disposal" style={navItemStyle}>
            <Trash2 size={17} />
            <span>Safe Disposal</span>
          </NavLink>

          <NavLink to="/dashboard/discounts" style={navItemStyle}>
            <Tag size={17} />
            <span>Discount Offers</span>
          </NavLink>

          <NavLink to="/dashboard/history" style={navItemStyle}>
            <History size={17} />
            <span>Activity Trail</span>
          </NavLink>

          {hasRole('ADMIN') && (
            <NavLink to="/dashboard/admin" style={navItemStyle}>
              <ShieldAlert size={17} color="#DC2626" />
              <span style={{ color: '#DC2626' }}>Admin Console</span>
            </NavLink>
          )}
        </div>

        {/* Dashboard Dynamic View */}
        <div className="animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}
