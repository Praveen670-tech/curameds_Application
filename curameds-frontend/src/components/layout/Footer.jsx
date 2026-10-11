import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Heart, Shield, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0F172A',
      color: '#94A3B8',
      borderTop: '1px solid #1E293B',
      marginTop: 'auto',
      paddingTop: '3.5rem',
      paddingBottom: '2.5rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #00A884 0%, #0D9488 100%)',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Pill size={20} />
              </div>
              <span style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#FFFFFF'
              }}>
                Cura<span style={{ color: '#00A884' }}>Meds</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94A3B8', marginBottom: '1.25rem' }}>
              Reimagining healthcare access through peer medicine exchanges, certified NGO donations, 
              safe pharmaceutical disposal, and connected telehealth care.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontSize: '0.85rem' }}>
              <CheckCircle size={16} />
              <span>Certified Sustainable Healthcare Network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/medicines" style={{ color: '#94A3B8' }}>Browse Medicine Inventory</Link></li>
              <li><Link to="/discounts" style={{ color: '#94A3B8' }}>Subsidized Health Schemes</Link></li>
              <li><Link to="/login" style={{ color: '#94A3B8' }}>Caregiver & Patient Portal</Link></li>
              <li><Link to="/register" style={{ color: '#94A3B8' }}>Register as Donor or NGO</Link></li>
            </ul>
          </div>

          {/* Platform Protocols */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>
              Safety & Verification
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={15} color="#00A884" /> 100% Pharmacist Batch Check
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={15} color="#00A884" /> Regulated Expiry Monitoring
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Heart size={15} color="#00A884" /> NGO Free Distribution
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={15} color="#00A884" /> Certified Biohazard Disposal
              </li>
            </ul>
          </div>

          {/* 24/7 Helpline */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>
              Emergency Tele-Care
            </h4>
            <div style={{
              background: '#1E293B',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #334155'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38BDF8', marginBottom: '0.5rem' }}>
                <Phone size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Toll-Free Helpline</span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                1800-425-CURA
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Available 24x7 for urgent medicine inquiries & caregiver assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1E293B',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem'
        }}>
          <div>
            &copy; {new Date().getFullYear()} CuraMeds Platform Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Healthcare Service</span>
            <span>HIPAA Compliance Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
