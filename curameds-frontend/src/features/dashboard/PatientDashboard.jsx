import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { medicineService } from '../../services/medicineService';
import { exchangeService } from '../../services/exchangeService';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Plus, 
  Pill, 
  Repeat, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  Tag, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import Notification from '../../components/common/Notification';
import Badge from '../../components/common/Badge';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [notification, setNotification] = useState(null);

  // Listing Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    manufacturer: '',
    batchNumber: '',
    category: 'General',
    dosageForm: 'Tablet',
    price: 0,
    expiryDate: '',
    quantity: 1
  });

  // Exchange Modal State
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedMedForExchange, setSelectedMedForExchange] = useState(null);
  const [exchangeForm, setExchangeForm] = useState({
    offeredMedicine: '',
    quantity: 1,
    notes: ''
  });

  useEffect(() => {
    loadMedicines();
  }, [category]);

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'ALL') params.category = category;
      if (search.trim()) params.search = search.trim();
      const data = await medicineService.getAll(params);
      setMedicines(data);
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to load medicines from backend.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadMedicines();
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await medicineService.create(newMed);
      setNotification({ type: 'success', message: `Medicine "${newMed.name}" listed successfully! Awaiting verification.` });
      setShowAddModal(false);
      setNewMed({
        name: '',
        manufacturer: '',
        batchNumber: '',
        category: 'General',
        dosageForm: 'Tablet',
        price: 0,
        expiryDate: '',
        quantity: 1
      });
      loadMedicines();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to list medicine. Please check inputs.' });
    }
  };

  const handleOpenExchange = (med) => {
    setSelectedMedForExchange(med);
    setShowExchangeModal(true);
  };

  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
    try {
      await exchangeService.create({
        listingId: selectedMedForExchange.id,
        medicineName: selectedMedForExchange.name,
        offeredMedicine: exchangeForm.offeredMedicine,
        quantity: parseInt(exchangeForm.quantity, 10),
        notes: exchangeForm.notes
      });
      setNotification({
        type: 'success',
        message: `Exchange proposal for "${selectedMedForExchange.name}" submitted successfully!`
      });
      setShowExchangeModal(false);
      setExchangeForm({ offeredMedicine: '', quantity: 1, notes: '' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to submit exchange proposal.' });
    }
  };

  const categories = ['ALL', 'Analgesic & Antipyretic', 'Antibiotic', 'Antidiabetic', 'Antihistamine', 'Cardiovascular', 'General'];

  return (
    <DashboardLayout
      title="Medicine Discovery & Exchanges"
      subtitle="Browse verified surplus medicines, request swaps, or list your unexpired medicines"
      actions={
        <button 
          id="open-add-listing-btn"
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          <span>List Medicine</span>
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

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: 1, minWidth: '260px', gap: '0.5rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                id="search-medicine-input"
                type="text"
                className="form-input"
                placeholder="Search medicine by name, generic formulation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              <Search size={16} />
              <span>Search</span>
            </button>
          </form>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="btn btn-sm"
                onClick={() => setCategory(cat)}
                style={{
                  backgroundColor: category === cat ? 'var(--color-primary)' : 'var(--bg-body)',
                  color: category === cat ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-light)',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Medicines Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading active medicine listings...
        </div>
      ) : medicines.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Pill size={40} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No medicines found in this category</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Be the first to list surplus verified medicines for other patients in need.
          </p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> List First Medicine
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {medicines.map((med) => (
            <div key={med.id} className="card card-3d" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <Badge variant={med.verificationStatus}>
                  {med.verificationStatus}
                </Badge>
                <span className="badge badge-info">{med.dosageForm || 'Tablet'}</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {med.name}
              </h3>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Mfg: <strong>{med.manufacturer || 'Approved Lab'}</strong> • Batch: {med.batchNumber || 'BCH-AUTO'}
              </div>

              <div style={{
                backgroundColor: 'var(--bg-body)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                fontSize: '0.85rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Expiry Date</div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{med.expiryDate}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Quantity Available</div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{med.quantity} Units</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Listing Type</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {med.price ? `₹${med.price}` : 'Free / Swap'}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Listed By</div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>
                    {med.owner?.name || med.owner?.username || 'Verified Donor'}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.6rem' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => handleOpenExchange(med)}
                >
                  <Repeat size={15} />
                  <span>Request Exchange</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Add Medicine Listing */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="List Surplus Medicine"
      >
        <form onSubmit={handleAddMedicine}>
          <div className="form-group">
            <label className="form-label" htmlFor="med-name">Medicine Name & Strength *</label>
            <input
              id="med-name"
              type="text"
              className="form-input"
              placeholder="e.g. Paracetamol 500mg, Metformin 500mg"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="med-mfg">Manufacturer</label>
              <input
                id="med-mfg"
                type="text"
                className="form-input"
                placeholder="e.g. Cipla, Sun Pharma"
                value={newMed.manufacturer}
                onChange={(e) => setNewMed({ ...newMed, manufacturer: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="med-batch">Batch Number</label>
              <input
                id="med-batch"
                type="text"
                className="form-input"
                placeholder="e.g. BCH-2024-99"
                value={newMed.batchNumber}
                onChange={(e) => setNewMed({ ...newMed, batchNumber: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="med-category">Category</label>
              <select
                id="med-category"
                className="form-select"
                value={newMed.category}
                onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
              >
                <option value="Analgesic & Antipyretic">Analgesic & Antipyretic</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Antidiabetic">Antidiabetic</option>
                <option value="Antihistamine">Antihistamine</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Gastrointestinal">Gastrointestinal</option>
                <option value="General">General Care</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="med-form">Dosage Form</label>
              <select
                id="med-form"
                className="form-select"
                value={newMed.dosageForm}
                onChange={(e) => setNewMed({ ...newMed, dosageForm: e.target.value })}
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Inhaler">Inhaler</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="med-exp">Expiry Date *</label>
              <input
                id="med-exp"
                type="date"
                className="form-input"
                value={newMed.expiryDate}
                onChange={(e) => setNewMed({ ...newMed, expiryDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="med-qty">Quantity Units *</label>
              <input
                id="med-qty"
                type="number"
                min="1"
                className="form-input"
                value={newMed.quantity}
                onChange={(e) => setNewMed({ ...newMed, quantity: parseInt(e.target.value, 10) || 1 })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="med-price">Price (₹, 0 if free)</label>
              <input
                id="med-price"
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                value={newMed.price}
                onChange={(e) => setNewMed({ ...newMed, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button type="submit" id="save-med-btn" className="btn btn-primary" style={{ flex: 1 }}>
              Submit for Verification
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Propose Medicine Exchange */}
      <Modal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        title={`Request Exchange for ${selectedMedForExchange?.name}`}
      >
        <form onSubmit={handleExchangeSubmit}>
          <div style={{
            backgroundColor: 'var(--color-primary-light)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.88rem'
          }}>
            <div><strong>Requested Item:</strong> {selectedMedForExchange?.name}</div>
            <div><strong>Manufacturer:</strong> {selectedMedForExchange?.manufacturer}</div>
            <div><strong>Expiry:</strong> {selectedMedForExchange?.expiryDate}</div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="offered-med">Medicine You Offer in Swap *</label>
            <input
              id="offered-med"
              type="text"
              className="form-input"
              placeholder="e.g. Paracetamol 500mg (1 strip unexpired)"
              value={exchangeForm.offeredMedicine}
              onChange={(e) => setExchangeForm({ ...exchangeForm, offeredMedicine: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exchange-qty">Quantity Needed</label>
            <input
              id="exchange-qty"
              type="number"
              min="1"
              max={selectedMedForExchange?.quantity || 100}
              className="form-input"
              value={exchangeForm.quantity}
              onChange={(e) => setExchangeForm({ ...exchangeForm, quantity: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exchange-notes">Notes / Meeting Location Preference</label>
            <textarea
              id="exchange-notes"
              className="form-textarea"
              rows={3}
              placeholder="Share convenient drop-off spot or medical shop partner hub..."
              value={exchangeForm.notes}
              onChange={(e) => setExchangeForm({ ...exchangeForm, notes: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowExchangeModal(false)}>
              Cancel
            </button>
            <button type="submit" id="submit-exchange-btn" className="btn btn-primary" style={{ flex: 1 }}>
              Send Proposal
            </button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
