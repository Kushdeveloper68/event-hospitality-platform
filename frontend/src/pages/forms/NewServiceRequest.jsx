import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createServiceRequest, updateServiceRequest, getServiceRequestById } from '../../api/serviceReqApi';
import { getRooms } from '../../api/roomApi';
import { getGuests } from '../../api/guestApi';

function NewServiceRequest({ eventId, memberId, onCancel, onDone }) {
  const [formData, setFormData] = useState({
    room: '',
    guest: '',
    requestType: 'housekeeping',
    urgency: 'medium',
    notes: '',
    permissionToEnter: false
  });

  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(!!memberId);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        // Fetch dropdows for room assignments & guest attachments
        const [roomsRes, guestsRes] = await Promise.all([
          getRooms({ eventId }),
          getGuests({ eventId })
        ]);
        
        if (roomsRes.success) setRooms(roomsRes.rooms || []);
        if (guestsRes.success) setGuests(guestsRes.guests || []);
      } catch (err) {
        console.error("Error loading form dependencies", err);
      }
    };
    
    if (eventId) fetchDependencies();
  }, [eventId]);

  useEffect(() => {
    if (memberId) {
      const fetchRequestData = async () => {
        try {
          const res = await getServiceRequestById(memberId);
          if (res.success && res.serviceRequest) {
            const req = res.serviceRequest;
            setFormData({
              room: req.room?._id || req.room || '',
              guest: req.guest?._id || req.guest || '',
              requestType: req.requestType || 'housekeeping',
              urgency: req.urgency || 'medium',
              notes: req.notes || '',
              permissionToEnter: req.permissionToEnter || false
            });
          } else {
            setError(res.message || 'Failed to load request details');
          }
        } catch (err) {
          setError('Network error fetching request');
        } finally {
          setInitialLoad(false);
        }
      };
      fetchRequestData();
    }
  }, [memberId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.requestType) {
      setError('Please select a request type.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = { ...formData, event: eventId };
      // Clean up empty optional references
      if (!payload.room) delete payload.room;
      if (!payload.guest) delete payload.guest;

      let res;
      if (memberId) {
        res = await updateServiceRequest(memberId, payload);
      } else {
        res = await createServiceRequest(payload);
      }

      if (res.success) {
        if (onDone) onDone(res.serviceRequest);
      } else {
        setError(res.message || 'Operation failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#1a1f2e] rounded-xl border border-[#dbdee6] dark:border-[#2d364a]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="mt-4 text-[#616e89] text-sm">Loading request details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#dbdee6] dark:border-[#2d364a] flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#111318] dark:text-white">
          {memberId ? 'Edit Service Request' : 'New Service Request'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-[#616e89] hover:bg-neutral-soft dark:hover:bg-[#2d364a] rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 text-red-700 dark:text-red-400">
            <span className="material-symbols-outlined shrink-0">error</span>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Request Type */}
            <div>
              <label className="block text-sm font-bold text-[#111318] dark:text-white mb-2">
                Request Type <span className="text-red-500">*</span>
              </label>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#f0f1f4] dark:bg-[#2d364a] border-none rounded-lg focus:ring-2 focus:ring-primary text-sm text-[#111318] dark:text-white"
                required
              >
                <option value="housekeeping">Housekeeping</option>
                <option value="maintenance">Maintenance</option>
                <option value="fb">Food & Beverage</option>
                <option value="valet">Valet</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-bold text-[#111318] dark:text-white mb-2">
                Priority Level
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#f0f1f4] dark:bg-[#2d364a] border-none rounded-lg focus:ring-2 focus:ring-primary text-sm text-[#111318] dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            {/* Linked Room (Optional) */}
            <div>
              <label className="block text-sm font-bold text-[#111318] dark:text-white mb-2">
                Assigned Room (Optional)
              </label>
              <select
                name="room"
                value={formData.room}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#f0f1f4] dark:bg-[#2d364a] border-none rounded-lg focus:ring-2 focus:ring-primary text-sm text-[#111318] dark:text-white"
              >
                <option value="">-- No Room Attached --</option>
                {rooms.map(r => (
                  <option key={r._id} value={r._id}>{r.number} ({r.type})</option>
                ))}
              </select>
            </div>

            {/* Linked Guest (Optional) */}
            <div>
              <label className="block text-sm font-bold text-[#111318] dark:text-white mb-2">
                Assigned Guest (Optional)
              </label>
              <select
                name="guest"
                value={formData.guest}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#f0f1f4] dark:bg-[#2d364a] border-none rounded-lg focus:ring-2 focus:ring-primary text-sm text-[#111318] dark:text-white"
              >
                <option value="">-- No Guest Attached --</option>
                {guests.map(g => (
                  <option key={g._id} value={g._id}>{g.name} ({g.email})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes Workspace */}
          <div>
            <label className="block text-sm font-bold text-[#111318] dark:text-white mb-2">
              Request Details / Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-[#f0f1f4] dark:bg-[#2d364a] border-none rounded-lg focus:ring-2 focus:ring-primary text-sm resize-none text-[#111318] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Provide context on exactly what the guest needs or what the issue is..."
            ></textarea>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="permissionToEnter"
              name="permissionToEnter"
              checked={formData.permissionToEnter}
              onChange={handleChange}
              className="size-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="permissionToEnter" className="text-sm font-medium text-[#111318] dark:text-white cursor-pointer select-none">
              Guest authorized staff entry to room without presence
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#dbdee6] dark:border-[#2d364a]">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-sm font-bold text-[#616e89] hover:bg-neutral-soft dark:hover:bg-[#2d364a] rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                memberId ? 'Update Request' : 'Submit Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewServiceRequest;
