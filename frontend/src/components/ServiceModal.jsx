import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const ServiceModal = ({ isOpen, onClose, onSubmit, service = null, vehicles = [], onAddVehicle, defaultVehicleName = '' }) => {
  const [serviceName, setServiceName] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [status, setStatus] = useState('Completed');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([{ description: '', price: 0 }]);
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [error, setError] = useState('');

  // Inline Vehicle Add states
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [newVehicleName, setNewVehicleName] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('4 Wheeler');
  const [inlineError, setInlineError] = useState('');

  useEffect(() => {
    if (service) {
      setServiceName(service.serviceName || '');
      setVehicleName(service.vehicleName || '');
      setStatus(service.status || 'Completed');
      setDescription(service.description || '');
      setItems(service.items && service.items.length > 0 ? service.items : [{ description: '', price: 0 }]);
      setNextServiceDate(service.nextServiceDate ? new Date(service.nextServiceDate).toISOString().substring(0, 10) : '');
    } else {
      setServiceName('');
      setVehicleName(defaultVehicleName || '');
      setStatus('Completed');
      setDescription('');
      setItems([{ description: '', price: 0 }]);
      setNextServiceDate('');
    }
    setIsAddingVehicle(false);
    setNewVehicleName('');
    setNewVehicleType('4 Wheeler');
    setInlineError('');
    setError('');
  }, [service, isOpen, defaultVehicleName]);

  if (!isOpen) return null;

  const handleQuickAddVehicle = async () => {
    setInlineError('');
    if (!newVehicleName.trim()) {
      setInlineError('Vehicle name is required.');
      return;
    }
    const res = await onAddVehicle({ name: newVehicleName.trim(), type: newVehicleType });
    if (res.success) {
      setVehicleName(res.vehicle.name);
      setIsAddingVehicle(false);
      setNewVehicleName('');
      setNewVehicleType('4 Wheeler');
    } else {
      setInlineError(res.error || 'Failed to register vehicle.');
    }
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{ description: '', price: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === 'price') {
      // Allow only numbers and decimals
      const val = value === '' ? '' : Number(value);
      newItems[index][field] = val;
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!serviceName.trim()) {
      setError('Please provide a service name.');
      return;
    }
    if (!vehicleName.trim()) {
      setError('Please select or register a vehicle.');
      return;
    }

    // Filter out completely empty items, but validate partial items
    const filteredItems = items.filter(item => item.description.trim() !== '' || item.price > 0);
    
    for (const item of filteredItems) {
      if (!item.description.trim()) {
        setError('All added items must have a description.');
        return;
      }
      if (item.price < 0) {
        setError('Item price cannot be negative.');
        return;
      }
    }

    onSubmit({
      serviceName,
      vehicleName,
      status,
      description,
      items: filteredItems,
      nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : null
    });
  };

  const liveTotal = items.reduce((total, item) => total + (Number(item.price) || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{service ? 'Edit Service Log' : 'Add New Service Log'}</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            {error && (
              <div className="alert-error" style={{ marginBottom: '16px' }}>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Service Name *</label>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '14px' }}
                placeholder="e.g. Brake Pad Replacement, Regular Tuneup"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle *</label>
              {isAddingVehicle ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px', 
                  border: '1px dashed var(--border-color)', 
                  padding: '16px', 
                  borderRadius: 'var(--radius-sm)', 
                  background: 'var(--bg-primary)' 
                }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Register New Vehicle</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '12px', flex: 2 }}
                      placeholder="e.g. Toyota Corolla"
                      value={newVehicleName}
                      onChange={(e) => setNewVehicleName(e.target.value)}
                      required
                    />
                    <select
                      className="form-input"
                      style={{ paddingLeft: '12px', flex: 1, background: 'var(--bg-input)' }}
                      value={newVehicleType}
                      onChange={(e) => setNewVehicleType(e.target.value)}
                    >
                      <option value="4 Wheeler">4 Wheeler</option>
                      <option value="2 Wheeler">2 Wheeler</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 'auto' }}
                      onClick={() => {
                        setIsAddingVehicle(false);
                        setVehicleName('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-add"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 'auto' }}
                      onClick={handleQuickAddVehicle}
                    >
                      Register & Select
                    </button>
                  </div>
                  {inlineError && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{inlineError}</span>}
                </div>
              ) : (
                <select
                  className="form-input"
                  style={{ paddingLeft: '14px', background: 'var(--bg-input)' }}
                  value={vehicleName}
                  onChange={(e) => {
                    if (e.target.value === 'ADD_NEW') {
                      setIsAddingVehicle(true);
                      setNewVehicleName('');
                      setNewVehicleType('4 Wheeler');
                      setInlineError('');
                    } else {
                      setVehicleName(e.target.value);
                    }
                  }}
                  disabled={!!defaultVehicleName}
                  required
                >
                  <option value="">-- Select Registered Vehicle --</option>
                  {vehicles && vehicles.map(v => (
                    <option key={v._id} value={v.name}>{v.name} ({v.type})</option>
                  ))}
                  <option value="ADD_NEW">+ Register New Vehicle...</option>
                </select>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                style={{ paddingLeft: '14px', background: 'var(--bg-input)' }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Next Service Date (Optional)</label>
              <input
                type="date"
                className="form-input"
                style={{ paddingLeft: '14px' }}
                value={nextServiceDate}
                onChange={(e) => setNextServiceDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-input"
                style={{ padding: '10px 14px', resize: 'vertical', minHeight: '80px' }}
                placeholder="e.g. Regular 10k mile maintenance checkup and brake replacements."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="modal-section-title">
              <span>Task Breakdown & Parts</span>
              <button type="button" className="btn-add-item" onClick={handleAddItem}>
                <Plus size={14} />
                Add Item
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="modal-task-row">
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '12px' }}
                  placeholder="e.g. Front brake pads, labor cost"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                />
                
                <div className="price-input-wrapper">
                  <span className="price-symbol">₹</span>
                  <input
                    type="number"
                    className="form-input price-input"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={item.price === 0 && item.description === '' ? '' : item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  />
                </div>

                <button 
                  type="button" 
                  className="btn-remove-item" 
                  onClick={() => handleRemoveItem(index)}
                  disabled={items.length === 1 && item.description === '' && item.price === 0}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <div className="modal-footer-total">
              <span className="log-total-label">Total Price (Live)</span>
              <span className="log-total-val">₹{liveTotal.toFixed(2)}</span>
            </div>

            <div className="modal-footer-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-add">
                {service ? 'Save Changes' : 'Create Log'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
