import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Heart, 
  Pill, 
  ShieldCheck, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Sparkles, 
  PhoneCall, 
  ShoppingBag,
  Repeat
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--header-height)'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #00A884 0%, #0D9488 100%)',
            color: '#ffffff',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0, 168, 132, 0.3)'
          }}>
            <Pill size={22} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              lineHeight: 1.1
            }}>
              Cura<span style={{ color: 'var(--color-primary)' }}>Meds</span>
            </div>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Health & Medicine Hub
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/" style={{
            padding: '0.5rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: isActive('/') ? 'var(--color-primary)' : 'var(--text-secondary)',
            backgroundColor: isActive('/') ? 'var(--color-primary-light)' : 'transparent',
            textDecoration: 'none'
          }}>
            Home
          </Link>

          <Link to="/medicines" style={{
            padding: '0.5rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: isActive('/medicines') ? 'var(--color-primary)' : 'var(--text-secondary)',
            backgroundColor: isActive('/medicines') ? 'var(--color-primary-light)' : 'transparent',
            textDecoration: 'none'
          }}>
            Explore Medicines
          </Link>

          <Link to="/discounts" style={{
            padding: '0.5rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: isActive('/discounts') ? 'var(--color-primary)' : 'var(--text-secondary)',
            backgroundColor: isActive('/discounts') ? 'var(--color-primary-light)' : 'transparent',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Sparkles size={15} color="#00A884" />
            Subsidies & Deals
          </Link>

          {isAuthenticated && (
            <Link to="/dashboard" style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: location.pathname.startsWith('/dashboard') ? 'var(--color-primary)' : 'var(--text-secondary)',
              backgroundColor: location.pathname.startsWith('/dashboard') ? 'var(--color-primary-light)' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <LayoutDashboard size={15} />
              Portal
            </Link>
          )}
        </nav>

        {/* Right CTA / Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--bg-body)',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem'
                }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {user?.username}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                    {user?.role}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Sign Out"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
