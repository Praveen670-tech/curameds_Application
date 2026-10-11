import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { medicineService } from '../../services/medicineService';
import { discountService } from '../../services/discountService';
import { 
  Search, 
  Pill, 
  Heart, 
  ShieldCheck, 
  Video, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  PhoneCall, 
  CheckCircle2, 
  Calendar, 
  Smartphone, 
  Users, 
  Clock, 
  RefreshCw,
  Building2,
  Trash2,
  TrendingDown
} from 'lucide-react';

export default function CuramedsLandingPage() {
  const [medicines, setMedicines] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedData();
  }, []);

  const loadFeaturedData = async () => {
    try {
      const meds = await medicineService.getAll();
      setMedicines(meds.slice(0, 6));
      const deals = await discountService.getAll();
      setDiscounts(deals.slice(0, 3));
    } catch (err) {
      console.warn('Could not fetch public medicines list', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/medicines');
    }
  };

  const specialists = [
    { name: 'Dr. Ananya Roy', field: 'Cardiologist & Hypertension', exp: '14 Yrs Exp', rating: '4.9/5', available: 'Available Today' },
    { name: 'Dr. Rajesh Mehta', field: 'Diabetologist & Endocrinology', exp: '18 Yrs Exp', rating: '5.0/5', available: 'Video Call in 10m' },
    { name: 'Dr. Sarah Thomas', field: 'Senior Pediatrician', exp: '11 Yrs Exp', rating: '4.8/5', available: 'Tomorrow 10 AM' },
    { name: 'Dr. Vikram Sen', field: 'General Physician & Geriatrics', exp: '20 Yrs Exp', rating: '4.9/5', available: 'Available Today' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-body)', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION WITH 3D MEDICINE BOX & TELEMEDICINE PREVIEW */}
      <section style={{
        background: 'linear-gradient(180deg, #E6F7F3 0%, #F8FAFC 100%)',
        padding: '4rem 0 3.5rem',
        borderBottom: '1px solid var(--border-light)',
        position: 'relative'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Left Column: Mission & Live Search */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FFFFFF',
              padding: '0.4rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-primary)',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--color-primary-dark)'
            }}>
              <span className="animate-pulse-glow" style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                display: 'inline-block'
              }}></span>
              Next-Gen Medicine Monitoring & Healthcare Platform
            </div>

            <h1 style={{
              fontSize: 'clamp(2.3rem, 4vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em'
            }}>
              Compassionate Medicine Care, <br />
              <span style={{
                background: 'linear-gradient(135deg, #00A884 0%, #0F766E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Zero Wastage.
              </span>
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '540px'
            }}>
              Discover verified essential medicines, connect with donors and accredited NGOs, 
              participate in patient-to-patient exchanges, and consult specialists with ease.
            </p>

            {/* Quick Medicine Search Bar */}
            <form onSubmit={handleSearchSubmit} style={{
              display: 'flex',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '0.45rem',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-medium)',
              marginBottom: '1.75rem',
              maxWidth: '520px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1rem', color: 'var(--text-muted)' }}>
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search Paracetamol, Insulin, Metformin, Inhaler..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  padding: '0.75rem 1rem',
                  fontSize: '0.98rem',
                  fontFamily: 'var(--font-family-base)'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-lg)' }}>
                Find Medicine
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <ShieldCheck size={18} color="#00A884" />
                <span>100% Verified Batches</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="#00A884" />
                <span>Free NGO Redistribution</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Medicine Box & Floating Teleconsult Card */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            
            {/* Main Interactive Telehealth Card */}
            <div className="card glass-card card-3d animate-medicine-3d" style={{
              width: '100%',
              maxWidth: '440px',
              padding: '2rem',
              position: 'relative',
              zIndex: 2,
              background: 'rgba(255, 255, 255, 0.94)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)'
                  }}>
                    <Video size={19} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Tele-Consult Preview</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Encrypted HD Video Session</div>
                  </div>
                </div>
                <span className="badge badge-success">Live Now</span>
              </div>

              {/* Video consultation mockup */}
              <div style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                color: '#FFFFFF',
                marginBottom: '1.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem'
                  }}>
                    DR
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>Dr. Rajesh Mehta</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Chronic Medicine Review</div>
                  </div>
                </div>
                <div style={{
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: '#CBD5E1'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Activity size={14} color="#10B981" /> Vitals Synced: HR 72 bpm
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#F87171',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}>
                    REC 12:44
                  </div>
                </div>
              </div>

              {/* Active Medicine Batch Verification Pill */}
              <div style={{
                backgroundColor: 'var(--color-primary-subtle)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Pill size={18} color="#00A884" />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Metformin 500mg Batch</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expiry: Nov 2026 (Safe)</div>
                  </div>
                </div>
                <span className="badge badge-success">VERIFIED</span>
              </div>
            </div>

            {/* Floating 3D Badge: Medicine Redistribution */}
            <div className="animate-float" style={{
              position: 'absolute',
              bottom: '-25px',
              left: '-20px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem 1.25rem',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              zIndex: 3
            }}>
              <div style={{
                backgroundColor: 'var(--color-success-light)',
                color: '#065F46',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  1,480+ Medicines Donated
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Saved for underserved patients
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIALIST DIRECTORY SECTION */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Expert Network</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Consult Licensed Healthcare Specialists
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Get professional guidance on chronic medication schedules, drug interactions, 
              and dosage adjustments before requesting exchanges.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {specialists.map((doc, idx) => (
              <div key={idx} className="card card-3d" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00A884 0%, #14B8A6 100%)',
                  color: '#ffffff',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  {doc.name.split(' ')[1]?.charAt(0) || 'D'}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                  {doc.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-dark)', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {doc.field}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border-light)',
                  borderBottom: '1px solid var(--border-light)',
                  padding: '0.6rem 0',
                  marginBottom: '1rem'
                }}>
                  <span>{doc.exp}</span>
                  <span>⭐ {doc.rating}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700, marginBottom: '1rem' }}>
                  ● {doc.available}
                </div>
                <Link to="/register" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                  Request Consultation
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HEALTH TRACKING & SMART EXPIRY PREVIEW */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-body)' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>Intelligent Safety</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Smart Medicine Tracking & Expiry Reminders
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              CuraMeds monitors medicine shelf life so patients and caregivers never take degraded or 
              expired pharmaceuticals. Automatically trigger safe disposal or exchange before expiration.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  backgroundColor: 'var(--color-primary-light)',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  color: 'var(--color-primary)'
                }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>60-Day Advance Alerts</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Get automatic notifications when home or shop stock is nearing expiration.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  backgroundColor: '#FEF3C7',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  color: '#D97706'
                }}>
                  <RefreshCw size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>One-Click Exchange or NGO Donation</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Easily transition usable unneeded medicine to families or verified NGO trusts.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  backgroundColor: '#FEE2E2',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  color: '#DC2626'
                }}>
                  <Trash2 size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Safe Biohazard Disposal Hubs</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Schedule zero-landfill, certified pharmaceutical disposal pickups.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vitals & Expiry Visual Card */}
          <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Family Medication Schedule</h3>
              <span className="badge badge-success">3 Active Scheds</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-body)',
                borderLeft: '4px solid #10B981',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Metformin 500mg (Morning)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Patient: Radha (Mother) • 8:00 AM</div>
                </div>
                <span className="badge badge-success">Taken</span>
              </div>

              <div style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-body)',
                borderLeft: '4px solid #F59E0B',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Amlodipine 5mg (Evening)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Patient: Radha (Mother) • 8:00 PM</div>
                </div>
                <span className="badge badge-warning">Due at 8 PM</span>
              </div>

              <div style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-body)',
                borderLeft: '4px solid #3B82F6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Vitamin D3 Weekly Capsule</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sunday Post-Lunch</div>
                </div>
                <span className="badge badge-info">Next Sunday</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Set Up Free Family Medication Tracking
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED MEDICINE DISCOVERY */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Live Catalog</span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Explore Available Medicines
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Verified batches ready for exchange, donation, or direct subsidized dispensary.
              </p>
            </div>
            <Link to="/medicines" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>View Full Catalog</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {medicines.map((med) => (
              <div key={med.id} className="card card-3d" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-info">{med.dosageForm || 'Tablet'}</span>
                  <span className="badge badge-success">{med.verificationStatus}</span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {med.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Mfg: {med.manufacturer || 'Certified Pharma'} • Batch: {med.batchNumber || 'BCH-2024'}
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-body)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  fontSize: '0.82rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem'
                }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Expiry Date</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{med.expiryDate}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>In Stock</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{med.quantity} Units</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Price</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      {med.price ? `₹${med.price}` : 'Free / Exchange'}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <Link to="/login" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    Request Medicine
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. APP DOWNLOAD CTA */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, #0F766E 0%, #00A884 100%)',
        color: '#FFFFFF'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-block',
              marginBottom: '1rem'
            }}>
              Download CuraMeds Mobile
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', lineHeight: 1.2 }}>
              Your Pocket Medicine Assistant & Caregiver Vault
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#E6F7F3', lineHeight: 1.6, marginBottom: '2rem' }}>
              Scan medicine barcodes directly, get instantaneous shelf-life analyses, 
              order emergency donations, and sync consultation reminders anywhere.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '0.75rem 1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)'
              }}>
                <Smartphone size={28} color="#00A884" />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Download on the</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>App Store</div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '0.75rem 1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)'
              }}>
                <Smartphone size={28} color="#10B981" />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Get it on</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>Google Play</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              maxWidth: '380px',
              width: '100%',
              boxShadow: 'var(--shadow-3d)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}>
                  <PhoneCall size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Join CuraMeds Today</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Start monitoring your prescriptions and supporting community health.
                </p>
              </div>

              <Link to="/register" className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
                Create Free Account
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ width: '100%' }}>
                Log In to Existing Account
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
