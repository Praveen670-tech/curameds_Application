import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { donationService } from '../../services/donationService';
import { useAuth } from '../../context/AuthContext';
import { HeartHandshake, Plus, MapPin, CheckCircle, Clock, Check } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Notification from '../../components/common/Notification';
import Badge from '../../components/common/Badge';

export default function DonationManagementPage() {
  const { user, hasRole } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateForm, setDonateForm] = useState({
    medicineName: '',
    quantity: 10,
    pickupAddress: '',
    notes: ''
  });

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const data = await donationService.getAll();
      setDonations(data);
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to load donation records.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDonation = async (e) => {
    e.preventDefault();
    try {
      await donationService.create({
        ...donateForm,
        quantity: parseInt(donateForm.quantity, 10)
      });
      setNotification({ type: 'success', message: `Donation request for "${donateForm.medicineName}" created!` });
      setShowDonateModal(false);
      setDonateForm({ medicineName: '', quantity: 10, pickupAddress: '', notes: '' });
      loadDonations();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to submit donation.' });
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await donationService.updateStatus(id, status);
      setNotification({ type: 'success', message: `Donation status updated to ${status}.` });
      loadDonations();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to update donation status.' });
    }
  };

  const isNgoOrAdmin = hasRole('NGO', 'ADMIN');

  return (
    <DashboardLayout
      title="Medicine Donation Hub"
      subtitle="Connect with certified NGOs to channel unneeded medicines to underprivileged patients"
      actions={
        <button 
          id="open-donate-modal-btn"
          className="btn btn-primary"
          onClick={() => setShowDonateModal(true)}
        >
          <Plus size={18} />
          <span>Donate Medicine</span>
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading donation stream...
        </div>
      ) : donations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <HeartHandshake size={48} color="#00A884" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No active donation drives</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Be the pioneer to contribute life-saving medicines to partner NGOs.
          </p>
          <button className="btn btn-primary" onClick={() => setShowDonateModal(true)}>
            <Plus size={18} /> Donate Now
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {donations.map((item) => (
            <div key={item.id} className="card card-3d" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <Badge variant={item.status}>{item.status}</Badge>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Ref #{item.id}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {item.medicineName}
              </h3>
              
              <div style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)', fontWeight: 700, marginBottom: '0.75rem' }}>
                Quantity: {item.quantity} Units
              </div>

              <div style={{
                backgroundColor: 'var(--bg-body)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                fontSize: '0.85rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <MapPin size={16} color="#64748B" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Pickup Hub: </span>
                    <strong>{item.pickupAddress || 'Community Center Drop-off'}</strong>
                  </div>
                </div>

                {item.notes && (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontStyle: 'italic' }}>
                    "{item.notes}"
                  </div>
                )}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                {isNgoOrAdmin && item.status === 'PENDING' && (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleUpdateStatus(item.id, 'APPROVED')}
                  >
                    <CheckCircle size={15} /> Claim / Approve
                  </button>
                )}

                {isNgoOrAdmin && item.status === 'APPROVED' && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleUpdateStatus(item.id, 'COLLECTED')}
                  >
                    Mark Collected
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Donate Medicine Modal */}
      <Modal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        title="Contribute Medicine Donation"
      >
        <form onSubmit={handleCreateDonation}>
          <div className="form-group">
            <label className="form-label" htmlFor="donate-med-name">Medicine Name & Formulation *</label>
            <input
              id="donate-med-name"
              type="text"
              className="form-input"
              placeholder="e.g. Amoxicillin 250mg Capsules"
              value={donateForm.medicineName}
              onChange={(e) => setDonateForm({ ...donateForm, medicineName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="donate-qty">Quantity of Units *</label>
            <input
              id="donate-qty"
              type="number"
              min="1"
              className="form-input"
              value={donateForm.quantity}
              onChange={(e) => setDonateForm({ ...donateForm, quantity: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="donate-pickup">Pickup Address / Drop Location *</label>
            <textarea
              id="donate-pickup"
              className="form-textarea"
              rows={2}
              placeholder="Full address where NGO van or partner courier can collect..."
              value={donateForm.pickupAddress}
              onChange={(e) => setDonateForm({ ...donateForm, pickupAddress: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="donate-notes">Special Storage / Batch Notes</label>
            <input
              id="donate-notes"
              type="text"
              className="form-input"
              placeholder="e.g. Unopened box, stored in dry cool room temperature"
              value={donateForm.notes}
              onChange={(e) => setDonateForm({ ...donateForm, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowDonateModal(false)}>
              Cancel
            </button>
            <button type="submit" id="submit-donation-btn" className="btn btn-primary" style={{ flex: 1 }}>
              Submit Donation
            </button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
