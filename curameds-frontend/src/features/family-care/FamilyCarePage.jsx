import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { familyService } from '../../services/familyService';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, Heart, Phone, Activity, Pill, Trash2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Notification from '../../components/common/Notification';

export default function FamilyCarePage() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    relativeName: '',
    relationship: 'Mother',
    age: 60,
    contactPhone: '',
    medicalConditions: '',
    currentMedications: ''
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await familyService.getAll();
      setMembers(data);
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to load family members.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await familyService.create({
        ...formData,
        age: parseInt(formData.age, 10)
      });
      setNotification({ type: 'success', message: `Added ${formData.relativeName} to Family Care!` });
      setShowAddModal(false);
      setFormData({
        relativeName: '',
        relationship: 'Mother',
        age: 60,
        contactPhone: '',
        medicalConditions: '',
        currentMedications: ''
      });
      loadMembers();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to add family member.' });
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Remove ${name} from your family monitor?`)) return;
    try {
      await familyService.delete(id);
      setNotification({ type: 'success', message: `Removed ${name} from profile.` });
      loadMembers();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to delete member.' });
    }
  };

  return (
    <DashboardLayout
      title="Family Care & Dependent Vault"
      subtitle="Caregiver monitoring for elderly parents, children, and chronic medication schedules"
      actions={
        <button 
          id="open-family-modal-btn"
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          <span>Add Family Member</span>
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
          Loading family profiles...
        </div>
      ) : members.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Users size={48} color="#00A884" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No family dependents registered</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Add parents, children, or elderly dependents to monitor dosages and prevent missed medications.
          </p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add First Dependent
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}>
          {members.map((m) => (
            <div key={m.id} className="card card-3d" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem'
                  }}>
                    {m.relativeName?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{m.relativeName}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {m.relationship} • {m.age} Yrs
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteMember(m.id, m.relativeName)}
                  title="Remove dependent"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {m.contactPhone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  <Phone size={15} color="#00A884" />
                  <span>{m.contactPhone}</span>
                </div>
              )}

              {/* Conditions */}
              <div style={{
                backgroundColor: 'var(--bg-body)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                marginBottom: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                  <Activity size={14} />
                  <span>Medical Conditions:</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {m.medicalConditions || 'No chronic conditions recorded'}
                </div>
              </div>

              {/* Current Prescriptions */}
              <div style={{
                backgroundColor: 'var(--color-primary-subtle)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                marginTop: 'auto'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  <Pill size={14} />
                  <span>Daily Medication Regimen:</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {m.currentMedications || 'No active prescriptions'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Dependent Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Family Dependent"
      >
        <form onSubmit={handleAddMember}>
          <div className="form-group">
            <label className="form-label" htmlFor="fam-name">Full Name *</label>
            <input
              id="fam-name"
              type="text"
              className="form-input"
              placeholder="e.g. Radha Narayanan"
              value={formData.relativeName}
              onChange={(e) => setFormData({ ...formData, relativeName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="fam-rel">Relationship *</label>
              <select
                id="fam-rel"
                className="form-select"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              >
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Other">Other Dependent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fam-age">Age *</label>
              <input
                id="fam-age"
                type="number"
                min="1"
                max="120"
                className="form-input"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fam-phone">Emergency Contact Phone</label>
            <input
              id="fam-phone"
              type="tel"
              className="form-input"
              placeholder="+91 9845012349"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fam-cond">Known Medical Conditions</label>
            <textarea
              id="fam-cond"
              className="form-textarea"
              rows={2}
              placeholder="e.g. Type-2 Diabetes, Hypertension, Asthma"
              value={formData.medicalConditions}
              onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fam-meds">Current Daily Medications & Times</label>
            <textarea
              id="fam-meds"
              className="form-textarea"
              rows={2}
              placeholder="e.g. Metformin 500mg (8:00 AM), Amlodipine 5mg (8:00 PM)"
              value={formData.currentMedications}
              onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button type="submit" id="submit-family-btn" className="btn btn-primary" style={{ flex: 1 }}>
              Save Dependent
            </button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
