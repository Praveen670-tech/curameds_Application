import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { exchangeService } from '../../services/exchangeService';
import { useAuth } from '../../context/AuthContext';
import { Repeat, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import Notification from '../../components/common/Notification';
import Badge from '../../components/common/Badge';

export default function ExchangeManagementPage() {
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadExchanges();
  }, []);

  const loadExchanges = async () => {
    setLoading(true);
    try {
      const data = await exchangeService.getAll();
      setExchanges(data);
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to load exchange requests.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await exchangeService.updateStatus(id, status);
      setNotification({ type: 'success', message: `Exchange request marked as ${status}.` });
      loadExchanges();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to update exchange status.' });
    }
  };

  return (
    <DashboardLayout
      title="Peer Medicine Exchanges"
      subtitle="Direct peer swaps between patients for equivalent therapeutic medicines"
    >
      {notification && (
        <Notification 
          type={notification.type} 
          message={notification.message} 
          onClose={() => setNotification(null)} 
        />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading active exchange proposals...
        </div>
      ) : exchanges.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Repeat size={48} color="#00A884" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No open exchange proposals</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Visit the Medicines tab to discover surplus medicines and propose a swap.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}>
          {exchanges.map((ex) => (
            <div key={ex.id} className="card card-3d" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Badge variant={ex.status}>{ex.status}</Badge>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ticket #{ex.id}
                </span>
              </div>

              {/* Barter Swap Visualization */}
              <div style={{
                backgroundColor: 'var(--bg-body)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                border: '1px solid var(--border-light)',
                marginBottom: '1rem'
              }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Target Medicine Needed
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {ex.medicineName} ({ex.quantity} Units)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', margin: '0.5rem 0' }}>
                  <Repeat size={18} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>EXCHANGING FOR</span>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Item Offered In Swap
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {ex.offeredMedicine}
                  </div>
                </div>
              </div>

              {ex.notes && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', fontStyle: 'italic' }}>
                  "{ex.notes}"
                </div>
              )}

              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.6rem' }}>
                {ex.status === 'PENDING' && (
                  <>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleUpdateStatus(ex.id, 'APPROVED')}
                    >
                      <CheckCircle size={15} /> Accept Swap
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleUpdateStatus(ex.id, 'REJECTED')}
                    >
                      <XCircle size={15} /> Decline
                    </button>
                  </>
                )}

                {ex.status === 'APPROVED' && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleUpdateStatus(ex.id, 'COMPLETED')}
                  >
                    Mark Swap Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
