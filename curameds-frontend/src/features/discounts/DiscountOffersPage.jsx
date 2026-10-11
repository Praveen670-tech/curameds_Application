import React, { useState, useEffect } from 'react';
import { discountService } from '../../services/discountService';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Plus, Copy, Check, Tag, Clock, Store, Shield } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Notification from '../../components/common/Notification';

export default function DiscountOffersPage() {
  const { user, hasRole } = useAuth();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');
  const [notification, setNotification] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    medicineName: '',
    discountPercent: 25,
    originalPrice: 100.0,
    discountedPrice: 75.0,
    validUntil: '',
    couponCode: 'SAVE25',
    description: ''
  });

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    setLoading(true);
    try {
      const data = await discountService.getAll();
      setDiscounts(data);
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to load discount schemes.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    try {
      await discountService.create({
        ...formData,
        discountPercent: parseInt(formData.discountPercent, 10),
        originalPrice: parseFloat(formData.originalPrice),
        discountedPrice: parseFloat(formData.discountedPrice)
      });
      setNotification({ type: 'success', message: `Discount coupon "${formData.couponCode}" published successfully!` });
      setShowAddModal(false);
      setFormData({
        title: '',
        medicineName: '',
        discountPercent: 25,
        originalPrice: 100.0,
        discountedPrice: 75.0,
        validUntil: '',
        couponCode: 'SAVE25',
        description: ''
      });
      loadDiscounts();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to create discount voucher.' });
    }
  };

  const canPublish = hasRole('MEDICAL_SHOP', 'ADMIN');

  return (
    <div style={{ padding: '3rem 0', minHeight: 'calc(100vh - 150px)', backgroundColor: 'var(--bg-body)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <div>
            <span className="badge badge-info" style={{ marginBottom: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={13} /> Essential Medicine Subsidies
            </span>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Subsidized Healthcare Schemes
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Exclusive subsidies and pharmacy coupons supporting chronic illness patients and senior citizens.
            </p>
          </div>

          {canPublish && (
            <button 
              id="open-discount-modal-btn"
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} />
              <span>Publish Subsidy Offer</span>
            </button>
          )}
        </div>

        {notification && (
          <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification(null)} 
          />
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Retrieving active subsidy offerings...
          </div>
        ) : discounts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Tag size={48} color="#00A884" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No active discount coupons at this time</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Check back soon for new pharmacy subsidies and seasonal healthcare coupons.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}>
            {discounts.map((d) => (
              <div key={d.id} className="card card-3d" style={{
                display: 'flex',
                flexDirection: 'column',
                borderTop: '4px solid #00A884'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-success">
                    {d.discountPercent}% OFF
                  </span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} /> Valid: {d.validUntil || 'Ongoing'}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {d.title}
                </h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {d.medicineName}
                </div>

                {d.description && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {d.description}
                  </p>
                )}

                <div style={{
                  backgroundColor: 'var(--bg-body)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MRP: </span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{d.originalPrice}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-dark)', fontWeight: 700 }}>Subsidy Price: </span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                      ₹{d.discountedPrice}
                    </span>
                  </div>
                </div>

                {/* Coupon Code Copy Button */}
                <div style={{ marginTop: 'auto' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px dashed var(--color-primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem 0.85rem',
                    backgroundColor: 'var(--color-primary-light)'
                  }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-primary-dark)' }}>
                      {d.couponCode}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleCopyCode(d.couponCode)}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                    >
                      {copiedCode === d.couponCode ? (
                        <>
                          <Check size={13} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Publish Discount */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Publish Pharmacy Subsidy / Discount Offer"
        >
          <form onSubmit={handleCreateDiscount}>
            <div className="form-group">
              <label className="form-label" htmlFor="disc-title">Offer Campaign Title *</label>
              <input
                id="disc-title"
                type="text"
                className="form-input"
                placeholder="e.g. Senior Citizen Diabetes Care Scheme"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="disc-med">Applicable Medicine *</label>
              <input
                id="disc-med"
                type="text"
                className="form-input"
                placeholder="e.g. Metformin 500mg, Atorvastatin 10mg"
                value={formData.medicineName}
                onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="disc-pct">Discount % *</label>
                <input
                  id="disc-pct"
                  type="number"
                  min="5"
                  max="90"
                  className="form-input"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="disc-orig">Original (₹)</label>
                <input
                  id="disc-orig"
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="disc-final">Subsidized (₹)</label>
                <input
                  id="disc-final"
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.discountedPrice}
                  onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="disc-code">Coupon Code *</label>
                <input
                  id="disc-code"
                  type="text"
                  className="form-input"
                  placeholder="e.g. CURA30"
                  value={formData.couponCode}
                  onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="disc-until">Valid Until Date</label>
                <input
                  id="disc-until"
                  type="date"
                  className="form-input"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="disc-desc">Terms / Description</label>
              <textarea
                id="disc-desc"
                className="form-textarea"
                rows={2}
                placeholder="Details on eligibility or prescription presentation..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button type="submit" id="submit-discount-btn" className="btn btn-primary" style={{ flex: 1 }}>
                Publish Offer
              </button>
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
}
