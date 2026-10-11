import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { historyService } from '../../services/historyService';
import { History, Activity, Calendar, User, ShieldCheck } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function TransactionHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await historyService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filterType === 'ALL' 
    ? history 
    : history.filter(h => h.type?.toUpperCase() === filterType.toUpperCase());

  const eventTypes = ['ALL', 'DONATION', 'EXCHANGE', 'LISTING', 'RESTOCK', 'DISPOSAL', 'VERIFICATION'];

  return (
    <DashboardLayout
      title="Platform Activity & Audit Trail"
      subtitle="Complete chronological audit record of medicine listings, peer swaps, NGO donations, and safety compliance"
    >
      {/* Filter Tabs */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Filter Log By Event:
          </span>
          {eventTypes.map(t => (
            <button
              key={t}
              type="button"
              className="btn btn-sm"
              onClick={() => setFilterType(t)}
              style={{
                backgroundColor: filterType === t ? 'var(--color-primary)' : 'var(--bg-body)',
                color: filterType === t ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-light)'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Reading immutable ledger logs...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <History size={48} color="#00A884" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No activity records found</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Transactions and verification events will be logged here in real-time.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Event Type</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Action Details</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Actor</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Entity</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <Badge variant={log.status || 'info'}>
                        {log.type}
                      </Badge>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{log.title}</div>
                      {log.description && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.description}</div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                        @{log.performedBy || 'System'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                      {log.relatedEntity || 'N/A'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
