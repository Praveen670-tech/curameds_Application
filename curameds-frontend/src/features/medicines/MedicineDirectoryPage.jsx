import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { medicineService } from '../../services/medicineService';
import { Search, Pill, ShieldCheck, Filter, ArrowRight } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function MedicineDirectoryPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    fetchMedicines();
  }, [selectedCategory]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (searchTerm.trim()) params.search = searchTerm.trim();
      const data = await medicineService.getAll(params);
      setMedicines(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMedicines();
  };

  const categories = ['ALL', 'Analgesic & Antipyretic', 'Antibiotic', 'Antidiabetic', 'Antihistamine', 'Cardiovascular', 'General'];

  return (
    <div style={{ padding: '3rem 0', minHeight: 'calc(100vh - 150px)', backgroundColor: 'var(--bg-body)' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
          <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>
            Central Pharmaceutical Registry
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Verified Medicine Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Browse accredited surplus medicines listed by licensed donors, verified medical shops, 
            and individuals across our healthcare community.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by generic formulation, brand name, or manufacturer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Search size={18} /> Search Medicines
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Filter By Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="btn btn-sm"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--bg-body)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-light)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Medicine Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Retrieving medicine records from registry...
          </div>
        ) : medicines.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <Pill size={48} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No medicines match your query</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Try searching with a broader keyword or switch categories.
            </p>
            <Link to="/register" className="btn btn-primary">
              List Surplus Medicine
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}>
            {medicines.map((med) => (
              <div key={med.id} className="card card-3d" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <Badge variant={med.verificationStatus}>
                    {med.verificationStatus}
                  </Badge>
                  <span className="badge badge-info">{med.dosageForm || 'Tablet'}</span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  {med.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Manufacturer: <strong>{med.manufacturer || 'Certified Pharma'}</strong> <br />
                  Batch Number: {med.batchNumber || 'BCH-VALID'}
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-body)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  fontSize: '0.85rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Expiry Date</div>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{med.expiryDate}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Available Quantity</div>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{med.quantity} Units</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Classification</div>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{med.category || 'General'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Price / Terms</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      {med.price ? `₹${med.price}` : 'Free / Exchange'}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.65rem' }}>
                  <Link to="/login" className="btn btn-primary" style={{ flex: 1 }}>
                    <span>Request / Exchange</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
