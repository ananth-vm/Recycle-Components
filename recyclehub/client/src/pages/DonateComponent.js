import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const CATEGORIES = [
  'CPU / Processor',
  'RAM / Memory',
  'Motherboard',
  'GPU / Graphics Card',
  'Hard Drive / SSD',
  'Power Supply',
  'Monitor / Display',
  'Battery',
  'Circuit Board',
  'Cable / Connector',
  'Cooling Fan',
  'Keyboard / Input Device',
  'Other',
];

export default function DonateComponent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    category: '',
    description: '',
    condition: 'Unknown',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [photos, setPhotos] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setPhotos(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length === 0) return toast.error('Please add at least one photo');
    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    photos.forEach((p) => data.append('photos', p));

    try {
      await api.post('/components', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Component submitted! Thank you for your donation 🌱');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Donate a Component</h1>
        <p className="page-subtitle">
          Fill in the details below. Our team will review and route your component to the right destination.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="donate-form">
        {/* Contact Details */}
        <div className="form-section">
          <h2 className="form-section-title">📋 Your Contact Details</h2>
          <div className="grid-2">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="donorName" value={form.donorName} onChange={handleChange}
                placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input name="donorPhone" value={form.donorPhone} onChange={handleChange}
                placeholder="+91 XXXXX XXXXX" required />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" name="donorEmail" value={form.donorEmail} onChange={handleChange}
              placeholder="contact@example.com" required />
          </div>
        </div>

        {/* Component Details */}
        <div className="form-section">
          <h2 className="form-section-title">🔧 Component Details</h2>
          <div className="grid-2">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select name="condition" value={form.condition} onChange={handleChange}>
                <option value="Working">Working</option>
                <option value="Partially Working">Partially Working</option>
                <option value="Unknown">Unknown / Not Tested</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the component: brand, model, approximate age, any visible damage..." required />
          </div>
        </div>

        {/* Photos */}
        <div className="form-section">
          <h2 className="form-section-title">📸 Component Photos</h2>
          <div className="form-group">
            <label>Upload Photos (up to 5) *</label>
            <div className="photo-upload-area">
              <input type="file" accept="image/*" multiple onChange={handlePhotos}
                id="photo-input" style={{ display: 'none' }} />
              <label htmlFor="photo-input" className="photo-upload-btn">
                <span className="upload-icon">📁</span>
                <span>Click to select photos</span>
                <small>JPG, PNG or WEBP · Max 10MB each</small>
              </label>
            </div>
            {previews.length > 0 && (
              <div className="photo-grid">
                {previews.map((url, i) => (
                  <img key={i} src={url} alt={`Preview ${i + 1}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pickup Location */}
        <div className="form-section">
          <h2 className="form-section-title">📍 Pickup Location</h2>
          <div className="form-group">
            <label>Street Address *</label>
            <input name="address" value={form.address} onChange={handleChange}
              placeholder="House no, Street name, Area" required />
          </div>
          <div className="grid-3">
            <div className="form-group">
              <label>City *</label>
              <input name="city" value={form.city} onChange={handleChange}
                placeholder="Chennai" required />
            </div>
            <div className="form-group">
              <label>State *</label>
              <input name="state" value={form.state} onChange={handleChange}
                placeholder="Tamil Nadu" required />
            </div>
            <div className="form-group">
              <label>Pincode *</label>
              <input name="pincode" value={form.pincode} onChange={handleChange}
                placeholder="600001" required />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline-dark" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : '✅ Submit Donation'}
          </button>
        </div>
      </form>
    </div>
  );
}
