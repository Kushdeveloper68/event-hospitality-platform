import React, { useState, useEffect } from 'react';
import { createTeamMember, updateTeamMember, getTeamMemberById } from '../../api/teamMemberApi';

function TeamMemberEntryForm({ eventId, memberId, onDone, onCancel }) {
  const isEditing = !!memberId;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        if (isEditing) {
          const res = await getTeamMemberById(memberId);
          if (res.success) {
            const m = res.teamMember;
            setFormData({
              name: m.name || '',
              email: m.email || '',
              role: m.role || '',
              status: m.status || 'active',
            });
          } else {
            setError(res.message || 'Failed to load team member');
          }
        }
      } catch (err) {
        console.error('Initial load error:', err);
        setError('Failed to load team member data');
      } finally {
        setInitialLoad(false);
      }
    };
    initData();
  }, [memberId, isEditing]);

  const ROLES = [
    'Event Director',
    'Event Lead',
    'Logistics',
    'Floor Staff',
    'Technical Support',
    'Guest Relations',
    'Admin'
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.role.trim()) newErrors.role = 'Role must be selected';
    
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

      let res;
      if (isEditing) {
        res = await updateTeamMember(memberId, payload);
      } else {
        res = await createTeamMember(payload);
      }

      if (res.success) {
        onDone && onDone();
      } else {
        setError(res.message || 'Failed to save team member');
      }
    } catch (err) {
      console.error('Error saving team member:', err);
      setError(err.message || 'Error communicating with server');
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
    <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <nav className="flex items-center gap-2 mb-6 text-sm font-medium">
        <span className="text-slate-500">Team Management</span>
        <span className="material-symbols-outlined text-slate-500 text-sm">chevron_right</span>
        <span className="text-slate-900 dark:text-white">{isEditing ? 'Edit Team Member' : 'Add Team Member'}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          {isEditing ? 'Edit Team Member' : 'New Team Member'}
        </h1>
        <p className="text-slate-500 text-lg">
          Add a new staff member to this event and assign their operational responsibilities.
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">person</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className={`w-full h-12 rounded-lg border bg-white dark:bg-slate-800 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white ${
                    errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">mail</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@eventops.pro"
                  className={`w-full h-12 rounded-lg border bg-white dark:bg-slate-800 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800 pt-6">
            {/* Role Assignment */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Event Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">badge</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full h-12 rounded-lg border bg-white dark:bg-slate-800 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white appearance-none ${
                    errors.role ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <option value="" disabled>Select primary role...</option>
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none">expand_more</span>
              </div>
              {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Initial Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:text-white"
              >
                <option value="active">Active (On Duty)</option>
                <option value="inactive">Inactive (Off Duty)</option>
              </select>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
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
                  {isEditing ? 'Saving...' : 'Adding...'}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">{isEditing ? 'edit' : 'person_add'}</span>
                  {isEditing ? 'Update Team Member' : 'Add Team Member'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default TeamMemberEntryForm;
