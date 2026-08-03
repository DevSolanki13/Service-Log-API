import React, { useState, useEffect } from 'react';
import { LogOut, Search, Plus, Calendar, Car, Edit2, Trash2, ShieldAlert, FolderHeart, X } from 'lucide-react';
import { apiRequest } from '../utils/api';
import ServiceModal from './ServiceModal';

const MOCK_VEHICLES = [
  { _id: 'v1', name: 'Tesla Model 3', type: '4 Wheeler' },
  { _id: 'v2', name: 'Yamaha R1', type: '2 Wheeler' },
  { _id: 'v3', name: 'Jeep Wrangler', type: '4 Wheeler' }
];

const MOCK_SERVICES = [
  {
    _id: 's1',
    vehicleName: 'Tesla Model 3',
    serviceName: 'Tire Rotation & Alignment',
    status: 'Completed',
    totalPrice: 4500,
    createdAt: '2026-06-15T10:00:00.000Z',
    items: [
      { description: 'Tire rotation & balance', price: 2500 },
      { description: 'Wheel alignment', price: 2000 }
    ]
  },
  {
    _id: 's2',
    vehicleName: 'Tesla Model 3',
    serviceName: 'Software Upgrade & Diagnostic',
    status: 'Completed',
    totalPrice: 1200,
    createdAt: '2026-07-20T14:30:00.000Z',
    items: [
      { description: 'Diagnostic fee', price: 1200 }
    ]
  },
  {
    _id: 's3',
    vehicleName: 'Tesla Model 3',
    serviceName: 'Cabin Air Filter Replacement',
    status: 'Scheduled',
    nextServiceDate: '2026-08-15',
    totalPrice: 1500,
    createdAt: '2026-08-01T09:00:00.000Z',
    items: [
      { description: 'HEPA Cabin filter', price: 1500 }
    ]
  },
  {
    _id: 's4',
    vehicleName: 'Yamaha R1',
    serviceName: 'Chain Maintenance & Lube',
    status: 'Completed',
    totalPrice: 800,
    createdAt: '2026-05-10T12:00:00.000Z',
    items: [
      { description: 'Chain cleaner & brush', price: 350 },
      { description: 'Synthetic chain lube', price: 450 }
    ]
  },
  {
    _id: 's5',
    vehicleName: 'Yamaha R1',
    serviceName: 'Periodic Oil Change',
    status: 'Completed',
    totalPrice: 3200,
    createdAt: '2026-07-02T16:00:00.000Z',
    items: [
      { description: 'Motul 300V Engine Oil', price: 2400 },
      { description: 'OEM Oil Filter', price: 800 }
    ]
  },
  {
    _id: 's6',
    vehicleName: 'Yamaha R1',
    serviceName: 'Brake Pad Replacement',
    status: 'In Progress',
    nextServiceDate: '2026-08-10',
    totalPrice: 5500,
    createdAt: '2026-08-02T11:00:00.000Z',
    items: [
      { description: 'Brembo Front Brake Pads', price: 5500 }
    ]
  },
  {
    _id: 's7',
    vehicleName: 'Jeep Wrangler',
    serviceName: 'Annual Suspension Tuning',
    status: 'Completed',
    totalPrice: 12500,
    createdAt: '2026-04-20T08:30:00.000Z',
    items: [
      { description: 'Shock absorber calibration', price: 7500 },
      { description: 'Bushings replacement', price: 5000 }
    ]
  },
  {
    _id: 's8',
    vehicleName: 'Jeep Wrangler',
    serviceName: 'Engine Tuning',
    status: 'Completed',
    totalPrice: 8500,
    createdAt: '2026-06-05T13:15:00.000Z',
    items: [
      { description: 'Spark plugs replacement', price: 3500 },
      { description: 'Throttle body clean', price: 5000 }
    ]
  }
];

const Dashboard = ({ token, userName, onLogout }) => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Vehicles states
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('All Vehicles');

  // Register Vehicle Modal states
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [newVehicleName, setNewVehicleName] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('4 Wheeler');
  const [vehicleError, setVehicleError] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    if (token === 'demo-token') {
      let saved = localStorage.getItem('demo_services');
      if (!saved) {
        saved = JSON.stringify(MOCK_SERVICES);
        localStorage.setItem('demo_services', saved);
      }
      setServices(JSON.parse(saved));
      setLoading(false);
      return;
    }
    const { success, data, error: apiError } = await apiRequest('/services', 'GET', null, token);

    setLoading(false);
    if (success) {
      setServices(data.services || []);
    } else {
      setError(apiError);
    }
  };

  const fetchVehicles = async () => {
    if (token === 'demo-token') {
      let saved = localStorage.getItem('demo_vehicles');
      if (!saved) {
        saved = JSON.stringify(MOCK_VEHICLES);
        localStorage.setItem('demo_vehicles', saved);
      }
      setVehicles(JSON.parse(saved));
      return;
    }
    const { success, data } = await apiRequest('/vehicles', 'GET', null, token);
    if (success) {
      setVehicles(data.vehicles || []);
    }
  };

  const handleAddVehicle = async (vehicleData) => {
    if (token === 'demo-token') {
      const demoVehs = JSON.parse(localStorage.getItem('demo_vehicles') || '[]');
      if (demoVehs.some(v => v.name.toLowerCase() === vehicleData.name.toLowerCase())) {
        return { success: false, error: 'Vehicle name must be unique' };
      }
      const newVeh = { _id: 'v_' + Math.random().toString(36).substr(2, 9), ...vehicleData };
      const updated = [...demoVehs, newVeh];
      localStorage.setItem('demo_vehicles', JSON.stringify(updated));
      setVehicles(updated);
      return { success: true, vehicle: newVeh };
    }
    const { success, data, error: apiError } = await apiRequest('/vehicles', 'POST', vehicleData, token);
    if (success) {
      await fetchVehicles();
      return { success: true, vehicle: data };
    }
    return { success: false, error: apiError };
  };

  const handleDeleteVehicle = async (vehicleId, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will remove the vehicle but keep its existing service logs.`)) {
      if (token === 'demo-token') {
        const demoVehs = JSON.parse(localStorage.getItem('demo_vehicles') || '[]');
        const updated = demoVehs.filter(v => v._id !== vehicleId);
        localStorage.setItem('demo_vehicles', JSON.stringify(updated));
        setVehicles(updated);
        return { success: true };
      } else {
        const { success, error: apiError } = await apiRequest(`/vehicles/${vehicleId}`, 'DELETE', null, token);
        if (success) {
          fetchVehicles();
          return { success: true };
        } else {
          setError(apiError);
          return { success: false };
        }
      }
    }
    return { success: false };
  };

  useEffect(() => {
    fetchServices();
    fetchVehicles();
  }, [token]);

  const handleCreateOrUpdate = async (formData) => {
    setIsModalOpen(false);
    setError('');

    if (token === 'demo-token') {
      const demoServices = JSON.parse(localStorage.getItem('demo_services') || '[]');
      const totalPrice = formData.items ? formData.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) : 0;
      
      let updated;
      if (editingService) {
        // Edit
        updated = demoServices.map(s => s._id === editingService._id ? {
          ...s,
          ...formData,
          totalPrice
        } : s);
      } else {
        // Create
        const newLog = {
          _id: 's_' + Math.random().toString(36).substr(2, 9),
          ...formData,
          totalPrice,
          createdAt: new Date().toISOString()
        };
        updated = [newLog, ...demoServices];
      }
      localStorage.setItem('demo_services', JSON.stringify(updated));
      setServices(updated);
      setEditingService(null);
      return;
    }

    let result;
    if (editingService) {
      // Update
      result = await apiRequest(`/services/${editingService._id}`, 'PATCH', formData, token);
    } else {
      // Create
      result = await apiRequest('/services', 'POST', formData, token);
    }

    if (result.success) {
      fetchServices();
    } else {
      setError(result.error);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setEditingService(null);
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    if (token === 'demo-token') {
      const demoServices = JSON.parse(localStorage.getItem('demo_services') || '[]');
      const updated = demoServices.filter(s => s._id !== serviceToDelete._id);
      localStorage.setItem('demo_services', JSON.stringify(updated));
      setServices(updated);
      setServiceToDelete(null);
      return;
    }
    const { success, error: apiError } = await apiRequest(`/services/${serviceToDelete._id}`, 'DELETE', null, token);
    if (success) {
      fetchServices();
    } else {
      setError(apiError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setServiceToDelete(null);
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    // Normalize date to ignore time part
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return services
      .filter(s => s.nextServiceDate && s.status !== 'Completed')
      .filter(s => selectedVehicle === 'All Vehicles' || s.vehicleName === selectedVehicle)
      .map(s => {
        const targetDate = new Date(s.nextServiceDate);
        const targetStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

        // Calculate difference in days
        const diffTime = targetStart - todayStart;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        let statusClass = 'future';
        let statusLabel = '';

        if (diffDays < 0) {
          statusClass = 'overdue';
          statusLabel = `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
        } else if (diffDays === 0) {
          statusClass = 'soon';
          statusLabel = 'Today';
        } else if (diffDays === 1) {
          statusClass = 'soon';
          statusLabel = 'Tomorrow';
        } else if (diffDays <= 7) {
          statusClass = 'soon';
          statusLabel = `In ${diffDays} days`;
        } else {
          statusClass = 'future';
          statusLabel = `In ${diffDays} days`;
        }

        return {
          ...s,
          diffDays,
          statusClass,
          statusLabel,
          formattedDate: targetDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        };
      })
      .sort((a, b) => a.diffDays - b.diffDays);
  };

  const upcomingList = getUpcomingReminders();

  // Search filter matching name, vehicle, description of items
  const filteredServices = services.filter(service => {
    // 1. Vehicle filter
    if (selectedVehicle !== 'All Vehicles' && service.vehicleName !== selectedVehicle) {
      return false;
    }

    // 2. Search filter
    const query = search.toLowerCase();
    const matchesName = service.serviceName?.toLowerCase().includes(query);
    const matchesVehicle = service.vehicleName?.toLowerCase().includes(query);
    const matchesItems = service.items?.some(item => item.description?.toLowerCase().includes(query));
    return matchesName || matchesVehicle || matchesItems;
  });

  // Dynamic stats calculation for displaying on stats cards
  const displayServices = services.filter(s => selectedVehicle === 'All Vehicles' || s.vehicleName === selectedVehicle);

  // Expenditure breakdown by vehicle
  const getVehicleBreakdown = () => {
    const breakdown = {};

    // Initialize with registered vehicles
    vehicles.forEach(v => {
      breakdown[v.name] = {
        name: v.name,
        type: v.type,
        totalSpent: 0,
        serviceCount: 0,
        registered: true
      };
    });

    // Aggregate from services
    services.forEach(s => {
      if (!breakdown[s.vehicleName]) {
        breakdown[s.vehicleName] = {
          name: s.vehicleName,
          type: 'Uncategorized',
          totalSpent: 0,
          serviceCount: 0,
          registered: false
        };
      }
      breakdown[s.vehicleName].totalSpent += (s.totalPrice || 0);
      breakdown[s.vehicleName].serviceCount += 1;
    });

    return Object.values(breakdown).sort((a, b) => b.totalSpent - a.totalSpent);
  };

  const vehicleBreakdown = getVehicleBreakdown();

  if (vehicles.length === 0 && !loading) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-card">
          <div className="onboarding-icon">
            <Car size={32} />
          </div>
          <h2 className="onboarding-title">Welcome to TrackMyServices</h2>
          <p className="onboarding-desc">
            To start logging vehicle maintenance and tracking service costs, please register your first vehicle.
          </p>

          <form className="onboarding-form" onSubmit={async (e) => {
            e.preventDefault();
            setVehicleError('');
            if (!newVehicleName.trim()) {
              setVehicleError('Vehicle name is required.');
              return;
            }
            const res = await handleAddVehicle({ name: newVehicleName.trim(), type: newVehicleType });
            if (res.success) {
              setNewVehicleName('');
              setNewVehicleType('4 Wheeler');
            } else {
              setVehicleError(res.error || 'Failed to register vehicle.');
            }
          }}>
            {vehicleError && (
              <div className="alert-error" style={{ marginBottom: '12px', width: '100%' }}>
                <span>{vehicleError}</span>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Vehicle Name *</label>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '14px' }}
                placeholder="e.g. Toyota Corolla, Pulsar 150"
                value={newVehicleName}
                onChange={(e) => setNewVehicleName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Vehicle Type *</label>
              <select
                className="form-input"
                style={{ paddingLeft: '14px', background: 'var(--bg-input)' }}
                value={newVehicleType}
                onChange={(e) => setNewVehicleType(e.target.value)}
              >
                <option value="4 Wheeler">🚗 4 Wheeler (Car/SUV)</option>
                <option value="2 Wheeler">🏍️ 2 Wheeler (Bike/Scooter)</option>
              </select>
            </div>

            <button type="submit" className="btn-add" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              Register First Vehicle
            </button>
          </form>

          <button
            className="btn-secondary"
            style={{ marginTop: '24px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={onLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="brand" style={{ marginBottom: '4px' }}>
            <img src="/favicon.svg" alt="TrackMyServices Logo" className="brand-logo" />
            <span className="brand-name">TrackMyServices</span>
          </div>
          <div className="user-info" style={{ gap: '8px', padding: '4px 0' }}>
            <span className="user-avatar">{userName.charAt(0).toUpperCase()}</span>
            <span style={{ fontSize: '0.9rem' }}>Hello, <strong>{userName}</strong></span>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-section">
            <span className="menu-section-title">Overview</span>
            <button
              className={`menu-item ${selectedVehicle === 'All Vehicles' ? 'active' : ''}`}
              onClick={() => setSelectedVehicle('All Vehicles')}
            >
              <div className="menu-item-left">
                <span>📊</span>
                <span>All Vehicles</span>
              </div>
              <span className="menu-item-badge">{services.length}</span>
            </button>
          </div>

          <div className="menu-section">
            <span className="menu-section-title">My Vehicles</span>
            {vehicles.map((v) => {
              const vehicleServices = services.filter(s => s.vehicleName === v.name);
              return (
                <button
                  key={v._id}
                  className={`menu-item ${selectedVehicle === v.name ? 'active' : ''}`}
                  onClick={() => setSelectedVehicle(v.name)}
                >
                  <div className="menu-item-left">
                    <span>{v.type === '2 Wheeler' ? '🏍️' : '🚗'}</span>
                    <span style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '120px'
                    }} title={v.name}>
                      {v.name}
                    </span>
                  </div>
                  <span className="menu-item-badge">{vehicleServices.length}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sidebar-footer">
          <button
            className="btn-add"
            style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
            onClick={() => {
              setVehicleError('');
              setNewVehicleName('');
              setNewVehicleType('4 Wheeler');
              setIsVehicleModalOpen(true);
            }}
          >
            <Plus size={16} />
            Add Vehicle
          </button>
          <button
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={onLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="dashboard-content-pane">
        {error && (
          <div className="alert-error" style={{ marginBottom: '24px' }}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {selectedVehicle === 'All Vehicles' ? (
          /* Case A: Combined Overview Tab */
          <div className="overview-pane">
            <div className="pane-header" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>All Vehicle Dashboard</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Aggregated statistics and expense breakdown across all your registered vehicles.</p>
              
              <div style={{ 
                marginTop: '16px', 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                padding: '16px 24px', 
                display: 'inline-flex', 
                flexDirection: 'column',
                boxShadow: 'var(--shadow)',
                minWidth: '220px'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Total Cost</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '4px' }}>
                  ₹{services.reduce((sum, s) => sum + (s.totalPrice || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Upcoming Services Widget */}
            {!loading && upcomingList.length > 0 && (
              <section className="upcoming-services-section" style={{ marginTop: '32px' }}>
                <div className="upcoming-header">
                  <Calendar className="upcoming-icon" size={20} />
                  <h3>Upcoming Maintenance Reminders</h3>
                </div>
                <div className="upcoming-grid">
                  {upcomingList.map(item => (
                    <div key={item._id} className={`upcoming-item-card ${item.statusClass}`}>
                      <div className="upcoming-item-header">
                        <span className="upcoming-vehicle">{item.vehicleName}</span>
                        <span className={`upcoming-countdown ${item.statusClass}`}>{item.statusLabel}</span>
                      </div>
                      <h4 className="upcoming-service-name">{item.serviceName}</h4>
                      <div className="upcoming-date-label">
                        <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>Target Date: {item.formattedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Vehicles Comparison Breakdown Table */}
            <section className="vehicles-table-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Your Registered Vehicles</h3>
                <span className="menu-item-badge" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>{vehicles.length} Active</span>
              </div>

              <table className="vehicles-table">
                <thead>
                  <tr>
                    <th>Vehicle Name</th>
                    <th>Type</th>
                    <th>Services Logged</th>
                    <th>Total Expenses</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleBreakdown.map((vb) => {
                    const regVehicle = vehicles.find(v => v.name === vb.name);
                    return (
                      <tr key={vb.name}>
                        <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {vb.type === '2 Wheeler' ? '🏍️' : vb.type === '4 Wheeler' ? '🚗' : '❔'} {vb.name}
                        </td>
                        <td>
                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: vb.type === '2 Wheeler' ? 'var(--warning)' : vb.type === '4 Wheeler' ? 'var(--accent-primary)' : 'var(--text-muted)'
                          }}>
                            {vb.type}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{vb.serviceCount} service(s)</td>
                        <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>₹{vb.totalSpent.toFixed(2)}</td>
                        <td style={{ textAlign: 'right' }}>
                          {regVehicle ? (
                            <button
                              className="btn-delete-link"
                              onClick={async () => {
                                await handleDeleteVehicle(regVehicle._id, vb.name);
                              }}
                            >
                              Delete Vehicle
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Imported Log</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </div>
        ) : (
          /* Case B: Specific Vehicle Tab */
          <div className="vehicle-pane">
            <div className="pane-header" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{selectedVehicle}</h1>
                    <span style={{
                      fontSize: '0.8rem',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      background: 'rgba(79, 70, 229, 0.1)',
                      color: 'var(--accent-primary)'
                    }}>
                      {vehicles.find(v => v.name === selectedVehicle)?.type || 'Vehicle'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '0.9rem', margin: '4px 0 0' }}>Detailed service history and reminders for this vehicle.</p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="btn-secondary"
                    style={{ color: 'var(--danger)', borderColor: 'rgba(225, 29, 72, 0.3)', minHeight: 'auto', padding: '8px 16px' }}
                    onClick={async () => {
                      const activeVehicleObj = vehicles.find(v => v.name === selectedVehicle);
                      if (activeVehicleObj) {
                        const { success } = await handleDeleteVehicle(activeVehicleObj._id, selectedVehicle);
                        if (success) {
                          setSelectedVehicle('All Vehicles');
                        }
                      }
                    }}
                  >
                    Delete Vehicle
                  </button>
                </div>
              </div>

              <div style={{ 
                marginTop: '16px', 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                padding: '16px 24px', 
                display: 'inline-flex', 
                flexDirection: 'column',
                boxShadow: 'var(--shadow)',
                minWidth: '220px'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Total Money Spent</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '4px' }}>
                  ₹{displayServices.reduce((sum, s) => sum + (s.totalPrice || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Upcoming Services Widget */}
            {!loading && upcomingList.length > 0 && (
              <section className="upcoming-services-section" style={{ marginTop: '32px' }}>
                <div className="upcoming-header">
                  <Calendar className="upcoming-icon" size={20} />
                  <h3>Upcoming Maintenance Reminders</h3>
                </div>
                <div className="upcoming-grid">
                  {upcomingList.map(item => (
                    <div key={item._id} className={`upcoming-item-card ${item.statusClass}`}>
                      <div className="upcoming-item-header">
                        <span className="upcoming-vehicle">{item.vehicleName}</span>
                        <span className={`upcoming-countdown ${item.statusClass}`}>{item.statusLabel}</span>
                      </div>
                      <h4 className="upcoming-service-name">{item.serviceName}</h4>
                      <div className="upcoming-date-label">
                        <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>Target Date: {item.formattedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Controls Panel */}
            <section className="controls-bar" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
              <div className="search-box" style={{ flexGrow: 1 }}>
                <div className="search-input-wrapper" style={{ width: '100%' }}>
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder={`Search services or tasks for ${selectedVehicle}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <button className="btn-add" style={{ minHeight: '44px', padding: '8px 16px' }} onClick={handleAddClick}>
                <Plus size={18} />
                Log New Service
              </button>
            </section>

            {/* Loading Indicator / Services list */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                <p>Loading service history...</p>
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="logs-list">
                {filteredServices.map((service) => (
                  <article key={service._id} className="log-card horizontal-list-card">
                    <div className="log-info-section">
                      <div className="log-title-area">
                        <h3>{service.serviceName}</h3>
                        <div className="log-vehicle">
                          <Car size={14} style={{ marginRight: '6px' }} />
                          <span>{service.vehicleName}</span>
                        </div>
                      </div>
                      <div className="log-meta-row">
                        <div className="log-date">
                          <Calendar size={14} style={{ marginRight: '6px' }} />
                          <span>{formatDate(service.createdAt)}</span>
                        </div>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          background: service.status === 'Completed' ? 'rgba(16, 185, 129, 0.12)' : service.status === 'In Progress' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                          color: service.status === 'Completed' ? 'var(--success)' : service.status === 'In Progress' ? 'var(--warning)' : 'var(--accent-primary)',
                          display: 'inline-block'
                        }}>
                          {service.status}
                        </span>
                      </div>
                    </div>

                    <div className="log-tasks-section">
                      {service.items && service.items.length > 0 ? (
                        <div className="log-tasks-list">
                          {service.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="log-task-item">
                              <span className="log-task-desc">{item.description}</span>
                              <span className="log-task-price">₹{item.price.toFixed(2)}</span>
                            </div>
                          ))}
                          {service.items.length > 3 && (
                            <div className="log-task-item" style={{ border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', paddingBottom: 0 }}>
                              <span>+ {service.items.length - 3} more tasks</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No task items recorded</span>
                      )}
                    </div>

                    <div className="log-pricing-section">
                      <div className="log-total">
                        <span className="log-total-label">Total Spent</span>
                        <span className="log-total-val">₹{(service.totalPrice || 0).toFixed(2)}</span>
                      </div>

                      <div className="log-actions">
                        <button
                          className="btn-icon edit"
                          title="Edit Service Log"
                          onClick={() => handleEditClick(service)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon delete"
                          title="Delete Service Log"
                          onClick={() => handleDeleteClick(service)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FolderHeart size={48} className="empty-icon" />
                <h3>No Service Logs Found</h3>
                <p>
                  {search
                    ? "We couldn't find any service logs matching your search. Try adjusting your query."
                    : `You haven't logged any services for ${selectedVehicle} yet. Start tracking maintenance expenses today!`}
                </p>
                {!search && (
                  <button className="btn-add" onClick={handleAddClick}>
                    <Plus size={18} />
                    Log Your First Service
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Dialog */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleCreateOrUpdate}
        service={editingService}
        vehicles={vehicles}
        onAddVehicle={handleAddVehicle}
        defaultVehicleName={selectedVehicle === 'All Vehicles' ? '' : selectedVehicle}
      />

      {/* Register Vehicle Modal */}
      {isVehicleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsVehicleModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Register New Vehicle</h2>
              <button className="btn-close" onClick={() => setIsVehicleModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setVehicleError('');
              if (!newVehicleName.trim()) {
                setVehicleError('Please provide a vehicle name.');
                return;
              }
              const res = await handleAddVehicle({ name: newVehicleName.trim(), type: newVehicleType });
              if (res.success) {
                setIsVehicleModalOpen(false);
                setNewVehicleName('');
                setNewVehicleType('4 Wheeler');
              } else {
                setVehicleError(res.error || 'Failed to register vehicle.');
              }
            }}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 24px' }}>
                {vehicleError && (
                  <div className="alert-error">
                    <span>{vehicleError}</span>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Vehicle Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '14px' }}
                    placeholder="e.g. Honda Civic, Activa 6G"
                    value={newVehicleName}
                    onChange={(e) => setNewVehicleName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Vehicle Type *</label>
                  <select
                    className="form-input"
                    style={{ paddingLeft: '14px', background: 'var(--bg-input)' }}
                    value={newVehicleType}
                    onChange={(e) => setNewVehicleType(e.target.value)}
                  >
                    <option value="4 Wheeler">4 Wheeler (Car/SUV)</option>
                    <option value="2 Wheeler">2 Wheeler (Bike/Scooter)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer" style={{ background: 'var(--bg-secondary)', padding: '16px 24px 24px', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn-cancel" onClick={() => setIsVehicleModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-add">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <div className="modal-overlay" onClick={() => setServiceToDelete(null)}>
          <div className="modal-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '12px' }}>
              <h2 style={{ color: 'var(--danger)', background: 'none', WebkitTextFillColor: 'initial' }}>Delete Service Log</h2>
              <button className="btn-close" onClick={() => setServiceToDelete(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ paddingTop: 0, paddingBottom: '16px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Are you sure you want to delete the service log for <strong>{serviceToDelete.serviceName}</strong> ({serviceToDelete.vehicleName})? This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer" style={{ background: 'var(--bg-secondary)', borderTop: 'none', padding: '16px 24px 24px 24px', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn-cancel" onClick={() => setServiceToDelete(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-add"
                style={{ background: 'linear-gradient(135deg, var(--danger) 0%, #be123c 100%)', boxShadow: '0 4px 12px rgba(244, 63, 94, 0.2)' }}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
