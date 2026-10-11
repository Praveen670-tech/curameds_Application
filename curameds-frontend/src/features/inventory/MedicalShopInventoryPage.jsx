import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { inventoryService } from '../../services/inventoryService';
import { useAuth } from '../../context/AuthContext';
import { Store, Plus, AlertTriangle, Trash2, Edit2, PackageCheck } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Notification from '../../components/common/Notification';

export default function MedicalShopInventoryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    medicineName: '',
    batchNumber: '',
    category: 'Analgesic',
    quantity: 100,
    minThreshold: 20,
    unitPrice: 25.0,
    expiryDate: '',
    supplier: ''
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getAll();
      setItems(data);
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to load inventory records.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await inventoryService.create({
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        minThreshold: parseInt(formData.minThreshold, 10),
        unitPrice: parseFloat(formData.unitPrice)
      });
      setNotification({ type: 'success', message: `Added "${formData.medicineName}" to pharmacy inventory.` });
      setShowAddModal(false);
      setFormData({
        medicineName: '',
        batchNumber: '',
        category: 'Analgesic',
        quantity: 100,
        minThreshold: 20,
        unitPrice: 25.0,
        expiryDate: '',
        supplier: ''
      });
      loadInventory();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to add inventory record.' });
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from inventory?`)) return;
    try {
      await inventoryService.delete(id);
      setNotification({ type: 'success', message: `Removed "${name}" from stock.` });
      loadInventory();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to delete item.' });
    }
  };

  return (
    <DashboardLayout
      title="Medical Shop Pharmacy Inventory"
      subtitle="Track pharmaceutical stock levels, batch expiries, unit pricing, and minimum buffer thresholds"
      actions={
        <button 
          id="open-inventory-modal-btn"
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          <span>Add Stock Item</span>
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
          Retrieving pharmacy stock records...
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Store size={48} color="#00A884" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No inventory logged</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Initialize your pharmacy dispensary stock to monitor supplies and alert patients.
          </p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add Stock Item
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Medicine & Batch</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Category</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>In Stock</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Unit Price</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Expiry</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Supplier</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isLowStock = item.quantity <= (item.minThreshold || 20);
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{item.medicineName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Batch: {item.batchNumber || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                        {item.category || 'Pharmaceutical'}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem' }}>{item.quantity}</span>
                          {isLowStock ? (
                            <span className="badge badge-danger" title="Below minimum threshold">
                              <AlertTriangle size={12} /> Low
                            </span>
                          ) : (
                            <span className="badge badge-success">Sufficient</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Min: {item.minThreshold || 10}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                        ₹{item.unitPrice || 0.0}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                        {item.expiryDate || 'Long-dated'}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                        {item.supplier || 'Direct Distributor'}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteItem(item.id, item.medicineName)}
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Stock Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Restock / Add Pharmacy Medicine"
      >
        <form onSubmit={handleAddItem}>
          <div className="form-group">
            <label className="form-label" htmlFor="inv-name">Medicine Name *</label>
            <input
              id="inv-name"
              type="text"
              className="form-input"
              placeholder="e.g. Atorvastatin 10mg, Pantoprazole 40mg"
              value={formData.medicineName}
              onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="inv-batch">Batch Number</label>
              <input
                id="inv-batch"
                type="text"
                className="form-input"
                placeholder="e.g. BCH-882"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="inv-category">Category</label>
              <input
                id="inv-category"
                type="text"
                className="form-input"
                placeholder="e.g. Cardiovascular, Antibiotic"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="inv-qty">Stock Units *</label>
              <input
                id="inv-qty"
                type="number"
                min="1"
                className="form-input"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="inv-threshold">Min Buffer *</label>
              <input
                id="inv-threshold"
                type="number"
                min="1"
                className="form-input"
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="inv-price">Unit Price (₹) *</label>
              <input
                id="inv-price"
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="inv-exp">Expiry Date</label>
              <input
                id="inv-exp"
                type="date"
                className="form-input"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="inv-supplier">Supplier / Distributor</label>
              <input
                id="inv-supplier"
                type="text"
                className="form-input"
                placeholder="e.g. Sun Pharma Direct"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button type="submit" id="submit-inventory-btn" className="btn btn-primary" style={{ flex: 1 }}>
              Save Stock Record
            </button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
