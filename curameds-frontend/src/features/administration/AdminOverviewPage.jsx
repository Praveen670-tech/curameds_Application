import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminService } from '../../services/adminService';
import { medicineService } from '../../services/medicineService';
import { 
  ShieldAlert, 
  Users, 
  Pill, 
  HeartHandshake, 
  Repeat, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock 
} from 'lucide-react';
import Notification from '../../components/common/Notification';
import Badge from '../../components/common/Badge';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [pendingMeds, setPendingMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, medsData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        medicineService.getAll()
      ]);
      setStats(statsData);
      setUsersList(usersData);
      setPendingMeds(medsData.filter(m => m.verificationStatus === 'PENDING'));
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to load administrator console data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await adminService.verifyListing(id, status);
      setNotification({ type: 'success', message: `Medicine listing marked as ${status}.` });
      loadAdminData();
    } catch (err) {
      setNotification({ type: 'error', message: `Failed to update verification status.` });
    }
  };

  return (
    <DashboardLayout
      title="Administrator Command Console"
      subtitle="High-level platform oversight, pharmacist batch verifications, and user credentials management"
    >
      {notification && (
        <Notification 
          type={notification.type} 
          message={notification.message} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* KPI Counters */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #2563EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563EB', marginBottom: '0.4rem' }}>
              <Users size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Registered Users</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalUsers}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #00A884' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00A884', marginBottom: '0.4rem' }}>
              <Pill size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Medicines</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalMedicines}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #F59E0B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D97706', marginBottom: '0.4rem' }}>
              <Clock size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Pending Batch Review</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706' }}>
              {stats.pendingVerifications}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10B981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', marginBottom: '0.4rem' }}>
              <HeartHandshake size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>NGO Donations</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalDonations}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #6366F1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366F1', marginBottom: '0.4rem' }}>
              <Repeat size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Swaps & Exchanges</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalExchanges}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #EF4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', marginBottom: '0.4rem' }}>
              <Trash2 size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Eco Disposals</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalDisposals}</div>
          </div>
        </div>
      )}

      {/* Pending Verifications Queue */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Batch Verification Queue</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Confirm medicine seals, batch validity, and expiry dates before publishing to community
            </p>
          </div>
          <span className="badge badge-warning">
            {pendingMeds.length} Batches Pending
          </span>
        </div>

        {pendingMeds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <CheckCircle size={36} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
            <div>All submitted medicine batches are currently verified!</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Medicine Name</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Manufacturer & Batch</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Expiry Date</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Quantity</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Donor/Lister</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingMeds.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{m.name}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      {m.manufacturer} • {m.batchNumber || 'N/A'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{m.expiryDate}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{m.quantity}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>@{m.owner?.username || 'user'}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleVerify(m.id, 'VERIFIED')}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleVerify(m.id, 'REJECTED')}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Platform User Directory */}
      <div className="card">
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Platform User Accounts Directory
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Review registered patients, medical store owners, accredited NGOs, and administrators
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Legal Name</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Username</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Role</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Email Address</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Contact Phone</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Registered</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{u.name}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-dark)' }}>@{u.username}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-info">{u.role}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{u.email || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
