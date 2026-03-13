import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTransport, updateTransport, getTransportById } from '../../api/transportCoordiAPi';
import { getGuests } from '../../api/guestApi';

function TransportEntryForm({ eventId, transportId, onDone, onCancel }) {
  const navigate = useNavigate();
  const isEditing = !!transportId;

  const [formData, setFormData] = useState({
    guest: '',
    driverName: '',
    vehicleId: '',
    pickupLocation: '',
    dropoffLocation: '',
    scheduledTime: '',
    notes: '',
  });

  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const initData = async () => {
      try {
        // Fetch guests for dropdown
        const guestRes = await getGuests({ eventId, limit: 1000 });
        if (guestRes.success) setGuests(guestRes.guests);

        // Load transport data if editing
        if (isEditing) {
          const transRes = await getTransportById(transportId);
          if (transRes.success) {
            const t = transRes.transport;
            setFormData({
              guest: t.guest?._id || t.guest || '',
              driverName: t.driverName || '',
              vehicleId: t.vehicleId || '',
              pickupLocation: t.pickupLocation || '',
              dropoffLocation: t.dropoffLocation || '',
              scheduledTime: t.scheduledTime ? new Date(t.scheduledTime).toISOString().slice(0, 16) : '',
              notes: t.notes || '',
            });
          }
        }
      } catch (err) {
        console.error('Initial load error:', err);
        setError('Failed to initialize form data');
      } finally {
        setInitialLoad(false);
      }
    };
    initData();
  }, [eventId, transportId, isEditing]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'Pickup location is required';
    if (!formData.dropoffLocation.trim()) newErrors.dropoffLocation = 'Dropoff location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const payload = { ...formData, event: eventId };
      // if empty select chosen
      if (!payload.guest) delete payload.guest;

      let res;
      if (isEditing) res = await updateTransport(transportId, payload);
      else res = await createTransport(payload);

      if (res.success) {
        onDone && onDone();
      } else {
        setError(res.message || 'Failed to save transport entry');
      }
    } catch (err) {
      console.error('Error saving transport:', err);
      setError(err.message || 'Failed to save transport entry');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-slate-500">Loading form data...</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <nav className="flex items-center gap-2 mb-6 text-sm font-medium">
        <span className="text-slate-500">Transport Logistics</span>
        <span className="material-symbols-outlined text-slate-500 text-sm">chevron_right</span>
        <span className="text-slate-900 dark:text-white">{isEditing ? 'Edit Transport' : 'Add Transport'}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          {isEditing ? 'Edit Transport Details' : 'Schedule New Transport'}
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl">
          Assign vehicles and drivers to coordinate guest arrivals, departures, or specific venue transfers.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-3">
          <span className="material-symbols-outlined text-red-500">error</span>
          <p className="font-semibold text-red-900 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          <div className="grid grid-cols-1 gap-6">
            {/* Guest Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Guest (Optional)</label>
              <select
                name="guest"
                value={formData.guest}
                onChange={handleChange}
                className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white"
              >
                <option value="">-- No specific guest (Group shuttle / General) --</option>
                {guests.map((g) => (
                  <option key={g._id} value={g._id}>{g.fullName} ({g.email})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Driver Name / Chauffeur</label>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white"
              />
            </div>
            {/* Vehicle ID / License */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Vehicle Model & License</label>
              <input
                type="text"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                placeholder="e.g. Mercedes S-Class - XL 2049"
                className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800 pt-6">
            {/* Pickup */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Pickup Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">trip_origin</span>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="e.g. LHR Terminal 5"
                  className={`w-full h-12 rounded-lg border bg-white dark:bg-slate-800 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white ${
                    errors.pickupLocation ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.pickupLocation && <p className="text-xs text-red-500">{errors.pickupLocation}</p>}
            </div>
            
            {/* Dropoff */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Dropoff Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">place</span>
                <input
                  type="text"
                  name="dropoffLocation"
                  value={formData.dropoffLocation}
                  onChange={handleChange}
                  placeholder="e.g. The Ritz-Carlton"
                  className={`w-full h-12 rounded-lg border bg-white dark:bg-slate-800 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white ${
                    errors.dropoffLocation ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.dropoffLocation && <p className="text-xs text-red-500">{errors.dropoffLocation}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scheduled Time */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Scheduled Time</label>
              <input
                type="datetime-local"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Additional Notes</label>
              <span className="text-[12px] text-slate-500 font-normal">Optional</span>
            </div>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Driver instructions, VIP requirements, etc."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white resize-none"
            ></textarea>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="w-full sm:w-auto px-6 h-12 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 h-12 rounded-lg bg-primary text-white font-semibold hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-xl">hourglass_top</span>
                  {isEditing ? 'Saving...' : 'Scheduling...'}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">{isEditing ? 'edit' : 'add_circle'}</span>
                  {isEditing ? 'Update Transport' : 'Schedule Transport'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default TransportEntryForm;
