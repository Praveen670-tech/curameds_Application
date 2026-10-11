import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { disposalService } from '../../services/disposalService';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Plus, AlertOctagon, CheckCircle2, ShieldAlert, Building2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Notification from '../../components/common/Notification';
import Badge from '../../components/common/Badge';

export default function SafeDisposalPage() {
  const { user, hasRole } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    medicineName: '',
    batchNumber: '',
    quantity: 10,
    reason: 'Expired beyond shelf life',
    hazardLevel: 'STANDARD',
    facilityName: 'CleanMed Bio-Incineration Hub #4'
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await disposalService.getAll();
      setRequests(data);
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to load disposal protocols.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await disposalService.create({
        ...formData,
        quantity: parseInt(formData.quantity, 10)
      });
      setNotification({ type: 'success', message: `Disposal request for "${formData.medicineName}" scheduled with facility!` });
      setShowAddModal(false);
      setFormData({
        medicineName: '',
        batchNumber: '',
        quantity: 10,
        reason: 'Expired beyond shelf life',
        hazardLevel: 'STANDARD',
        facilityName: 'CleanMed Bio-Incineration Hub #4'
      });
      loadRequests();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to schedule disposal.' });
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await disposalService.updateStatus(id, status);
      setNotification({ type: 'success', message: `Disposal protocol marked as ${status}.` });
      loadRequests();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to update disposal status.' });
    }
  };

  return (
    <DashboardLayout
      title="Safe Pharmaceutical Disposal"
      subtitle="Eco-certified pharmaceutical bio-destruction preventing water contamination and dangerous counterfeit resale"
      actions={
        <button 
          id="open-disposal-modal-btn"
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          <span>Schedule Disposal</span>
        </button>
      }
    >
      {notification && (
        <Notification 
          type={notification.type} 
          message={notification.message} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Protocol Banner */}
      <div className="card" style={{
        backgroundColor: '#FFFBEB',
        borderColor: '#FDE68A',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          backgroundColor: '#F59E0B',
          color: '#FFFFFF',
          padding: '0.65rem',
          borderRadius: '12px'
        }}>
          <AlertOctagon size={24} />
        </div>
        <div>
          <h4 style={{ color: '#92400E', fontSize: '1rem', fontWeight: 800 }}>Green Pharma Standard</h4>
          <p style={{ color: '#B45309', fontSize: '0.85rem' }}>
            Never flush expired syrups or antibiotics down drains. Our partnered government-approved high-temp incineration 
            facilities guarantee 100% neutralized hazardous residues.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Retrieving disposal schedules...
        </div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Trash2 size={48} color="#00A884" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No pending disposal batches</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Have expired, degraded, or recalled medicines? Schedule an eco-friendly pickup today.
          </p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Schedule Safe Disposal
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {requests.map((r) => (
            <div key={r.id} className="card card-3d" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <Badge variant={r.status}>{r.status}</Badge>
                <span className="badge badge-warning">{r.hazardLevel}</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {r.medicineName}
              </h3>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Batch: {r.batchNumber || 'BCH-UNSPECIFIED'} • Quantity: <strong>{r.quantity} Units</strong>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-body)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                <div style={{ marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Destruction Reason: </span>
                  <strong>{r.reason}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <Building2 size={15} color="#00A884" />
                  <span>Facility: {r.facilityName || 'Central Incineration Hub'}</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                {r.status === 'SCHEDULED' && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleUpdateStatus(r.id, 'DISPOSED')}
                  >
                    <CheckCircle2 size={15} /> Confirm Incineration
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Disposal Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule Eco Pharmaceutical Disposal"
      >
        <form onSubmit={handleCreateRequest}>
          <div className="form-group">
            <label className="form-label" htmlFor="disp-name">Medicine Name & Formulation *</label>
            <input
              id="disp-name"
              type="text"
              className="form-input"
              placeholder="e.g. Expired Tetracycline 500mg"
              value={formData.medicineName}
              onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="disp-batch">Batch Number</label>
              <input
                id="disp-batch"
                type="text"
                className="form-input"
                placeholder="e.g. BCH-EXP-2022"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="disp-qty">Units / Strips *</label>
              <input
                id="disp-qty"
                type="number"
                min="1"
                className="form-input"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="disp-hazard">Hazard Classification</label>
              <select
                id="disp-hazard"
                className="form-select"
                value={formData.hazardLevel}
                onChange={(e) => setFormData({ ...formData, hazardLevel: e.target.value })}
              >
                <option value="STANDARD">STANDARD (Expired solid tablets/caps)</option>
                <option value="HAZARDOUS">HAZARDOUS (Liquid cytotoxic/chemo)</option>
                <option value="CONTROLLED">CONTROLLED (Regulated psychotropics)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="disp-reason">Reason for Destruction</label>
              <input
                id="disp-reason"
                type="text"
                className="form-input"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="disp-facility">Certified Incineration Facility</label>
            <input
              id="disp-facility"
              type="text"
              className="form-input"
              value={formData.facilityName}
              onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button type="submit" id="submit-disposal-btn" className="btn btn-primary" style={{ flex: 1 }}>
              Schedule Safe Pickup
            </button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
