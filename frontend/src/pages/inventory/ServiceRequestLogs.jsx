import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom';
import { getServiceRequests, deleteServiceRequest, updateServiceStatus, getServiceSummary } from '../../api/serviceReqApi';
import NewServiceRequest from '../forms/NewServiceRequest';

function ServiceRequestLogs({ eventId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get('action');
  const requestId = searchParams.get('id');

  const [requests, setRequests] = useState([]);
  const [summary, setSummary] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Row actions
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const menuRef = useRef(null);

  // Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const [listRes, summaryRes] = await Promise.all([
        getServiceRequests(eventId, { search: searchTerm, requestType: typeFilter, status: statusFilter }),
        getServiceSummary(eventId)
      ]);

      if (listRes.success) setRequests(listRes.serviceRequests);
      if (summaryRes.success && summaryRes.summary) {
        const s = summaryRes.summary;
        setSummary({
          total: s.total || 0,
          open: s.pending || 0,
          inProgress: s.inProgress || 0,
          resolved: s.resolved || 0
        });
      }
    } catch (err) {
      console.error("Failed to load requests", err);
      setError("Failed to load service requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData();
    }, 300); // 300ms debounce on search
    return () => clearTimeout(delayDebounceFn);
  }, [eventId, searchTerm, typeFilter, statusFilter]);

  // Click outside menu handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = (id) => {
    setActiveMenuId(null);
    setSearchParams({ action: 'editService', id });
  };

  const handleDeleteClick = (reqItem) => {
    setActiveMenuId(null);
    setRequestToDelete(reqItem);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;
    try {
      const res = await deleteServiceRequest(requestToDelete._id);
      if (res.success) {
        showToast('Service request deleted successfully');
        loadData();
      } else {
        showToast(res.message || 'Failed to delete request', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setShowDeleteModal(false);
      setRequestToDelete(null);
    }
  };

  const handleExportCSV = () => {
    if (requests.length === 0) {
      showToast('No data to export', 'error');
      return;
    }

    const headers = ['ID', 'Guest', 'Room', 'Type', 'Urgency', 'Status', 'Notes', 'Created At'];
    const rows = requests.map(req => [
      req._id,
      req.guest?.name || 'N/A',
      req.room?.number || 'N/A',
      req.requestType,
      req.urgency,
      req.status,
      req.notes?.replace(/,/g, ';') || '',
      new Date(req.createdAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `service_requests_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exporting to CSV...');
  };

  const handleStatusChange = async (id, newStatus) => {
    setActiveMenuId(null);
    try {
      const res = await updateServiceStatus(id, newStatus);
      if (res.success) {
        showToast(`Status updated to ${newStatus}`);
        loadData();
      } else {
        showToast(res.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'emergency': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 uppercase">Emergency</span>;
      case 'high': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase">High</span>;
      case 'low': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200 uppercase">Low</span>;
      default: return null; // medium is default, don't clutter UI
    }
  };

  const getTypeDisplay = (type) => {
    switch(type) {
      case 'housekeeping': return { icon: 'clean_hands', label: 'Housekeeping', color: 'text-blue-500' };
      case 'maintenance': return { icon: 'build', label: 'Maintenance', color: 'text-amber-600' };
      case 'fb': return { icon: 'restaurant', label: 'In-Room Dining', color: 'text-rose-500' };
      case 'valet': return { icon: 'directions_car', label: 'Valet', color: 'text-indigo-500' };
      default: return { icon: 'concierge', label: 'Concierge/Other', color: 'text-emerald-500' };
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'open':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">Open</span>;
      case 'in_progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-primary border border-blue-200">In Progress</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Resolved</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200 line-through">Cancelled</span>;
      default:
        return <span>{status}</span>;
    }
  };


  // If URL action param is active, render the form overlay instead of the list
  if (action === 'addService' || action === 'editService') {
    return (
      <div className="w-full max-w-4xl mx-auto py-6">
        <NewServiceRequest 
          eventId={eventId} 
          memberId={requestId} 
          onCancel={() => setSearchParams({})} 
          onDone={() => {
            setSearchParams({});
            showToast(requestId ? 'Request updated' : 'Request created');
            loadData();
          }} 
        />
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 text-white transition-opacity duration-300 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'}`}>
          <span className="material-symbols-outlined shrink-0">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2">Delete Request?</h3>
            <p className="text-[#616e89] text-sm mb-6">
              Are you sure you want to permanently delete this {requestToDelete?.requestType} request for {requestToDelete?.guest?.name || 'this guest'}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-bold text-[#616e89] hover:bg-neutral-soft dark:hover:bg-[#2d364a] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 flex-col overflow-y-auto w-full">
          
          {/* Header Section */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 lg:px-0">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#111318] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Service Request Logs</h1>
              <p className="text-[#616e89] text-base font-normal leading-normal">Manage and monitor guest hospitality requests in real-time.</p>
            </div>
            <div className="flex gap-3 text-center items-center">
              <div className="px-4 py-2 bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] rounded-lg mr-2">
                <p className="text-[#616e89] text-[10px] font-bold uppercase whitespace-nowrap">Open / Progress</p>
                <p className="text-[#111318] dark:text-white text-lg font-black">{summary.open} <span className="text-[#616e89] font-normal mx-0.5">/</span> <span className="text-primary">{summary.inProgress}</span></p>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] text-[#111318] dark:text-white rounded-lg text-sm font-bold hover:bg-neutral-soft dark:hover:bg-[#2d364a] transition-colors"
                title="Export to CSV"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                Export
              </button>
              <button
                onClick={() => setSearchParams({ action: 'addService' })}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Create Request
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="pb-6">
            <div className="bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-sm">
              <div className="flex-1 min-w-[300px]">
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#616e89] group-focus-within:text-primary transition-colors">search</span>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#f0f1f4] dark:bg-[#2d364a] border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm text-[#111318] dark:text-white placeholder-[#616e89]"
                    placeholder="Search by guest, room, or ID..." 
                    type="text" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-[#f0f1f4] dark:bg-[#2d364a] border-none rounded-lg text-sm font-bold text-[#616e89] dark:text-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary/20 appearance-none pr-8 cursor-pointer"
                >
                  <option value="">All Services</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="fb">Food & Beverage</option>
                  <option value="valet">Valet</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#f0f1f4] dark:bg-[#2d364a] border-none rounded-lg text-sm font-bold text-[#616e89] dark:text-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary/20 appearance-none pr-8 cursor-pointer"
                >
                  <option value="">Any Status</option>
                  <option value="open">Open (Pending)</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Resolved</option>
                </select>
                {/* Clear Filters Button */}
                {(searchTerm || typeFilter || statusFilter) && (
                  <button 
                    onClick={() => { setSearchTerm(''); setTypeFilter(''); setStatusFilter(''); }}
                    className="p-2 text-red-500 hover:bg-neutral-soft dark:hover:bg-[#2d364a] rounded-lg transition-colors flex items-center"
                    title="Clear Filters"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loading / Error States */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Data Table */}
          <div className="pb-10 flex-1 w-full relative">
            {loading && (
              <div className="absolute inset-0 z-10 bg-white/50 dark:bg-[#151a26]/50 backdrop-blur-[1px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
                  <p className="text-[#616e89] font-medium text-sm">Syncing requests...</p>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] rounded-xl overflow-visible shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f0f1f4] dark:bg-[#151a26] text-[11px] font-bold text-[#616e89] uppercase tracking-widest border-b border-[#dbdee6] dark:border-[#2d364a]">
                  <tr>
                    <th className="px-6 py-4">Guest / Room</th>
                    <th className="px-6 py-4">Request Type</th>
                    <th className="px-6 py-4">Status & Urgency</th>
                    <th className="px-6 py-4">Notes</th>
                    <th className="px-6 py-4 text-right">Created Time</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dbdee6] dark:divide-[#2d364a]">
                  {requests.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-[#616e89]">
                        <span className="material-symbols-outlined text-4xl opacity-50 mb-3 block">receipt_long</span>
                        <p className="text-lg font-bold text-[#111318] dark:text-white">No requests found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or create a new ticket.</p>
                      </td>
                    </tr>
                  ) : (
                    requests.map((req) => {
                      const typeConfig = getTypeDisplay(req.requestType);
                      const isRowResolved = req.status === 'completed' || req.status === 'cancelled';
                      
                      return (
                        <tr key={req._id} className={`hover:bg-neutral-soft/30 dark:hover:bg-[#2d364a]/30 transition-colors ${isRowResolved ? 'opacity-60 saturate-50' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#111318] dark:text-white">{req.guest ? req.guest.name : 'No Guest Linked'}</span>
                              <span className="text-xs text-[#616e89]">
                                {req.room ? `Room ${req.room.number}` : 'No Room Info'} • ID #{req._id.slice(-6).toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`material-symbols-outlined text-lg ${typeConfig.color}`}>{typeConfig.icon}</span>
                              <span className="text-sm font-bold text-[#111318] dark:text-gray-200">{typeConfig.label}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-start gap-1.5">
                              {getStatusBadge(req.status)}
                              {getUrgencyBadge(req.urgency)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs text-[#616e89] line-clamp-2 max-w-[200px]" title={req.notes}>
                              {req.notes || "—"}
                            </p>
                            {req.permissionToEnter && (
                              <p className="text-[10px] text-primary flex items-center gap-1 mt-1 font-bold tracking-wider">
                                <span className="material-symbols-outlined text-[10px]">key</span> P.T.E. Granted
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right text-xs font-semibold text-[#616e89]">
                            {new Date(req.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            <span className="block text-[10px] font-normal">{new Date(req.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-4 text-right relative">
                            <button 
                              onClick={() => setActiveMenuId(activeMenuId === req._id ? null : req._id)}
                              className={`p-1.5 rounded-lg transition-colors ${activeMenuId === req._id ? 'bg-neutral-soft dark:bg-[#2d364a] text-[#111318] dark:text-white' : 'text-[#616e89] hover:bg-neutral-soft dark:hover:bg-[#2d364a]'}`}
                            >
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>
                            
                            {/* Actions Dropdown */}
                            {activeMenuId === req._id && (
                              <div ref={menuRef} className="z-40 absolute right-8 top-12 w-48 bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] rounded-lg shadow-xl  py-1 origin-top-right animate-in fade-in zoom-in-95 duration-100">
                                
                                <div className="px-3 py-2 border-b border-[#f0f1f4] dark:border-[#2d364a]">
                                  <p className="text-[10px] font-bold text-[#616e89] uppercase tracking-wider">Update Status</p>
                                </div>
                                <button onClick={() => handleStatusChange(req._id, 'open')} className="w-full px-4 py-2 text-left text-sm text-[#111318] dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/10 hover:text-amber-700 transition-colors flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[18px]">fiber_new</span> Mark Open
                                </button>
                                <button onClick={() => handleStatusChange(req._id, 'in_progress')} className="w-full px-4 py-2 text-left text-sm text-[#111318] dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-primary transition-colors flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[18px]">run_circle</span> In Progress
                                </button>
                                <button onClick={() => handleStatusChange(req._id, 'completed')} className="w-full px-4 py-2 text-left text-sm text-[#111318] dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 transition-colors flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[18px]">check_circle</span> Resolved
                                </button>

                                <div className="h-px bg-[#f0f1f4] dark:bg-[#2d364a] my-1"></div>
                                
                                <button onClick={() => handleEdit(req._id)} className="w-full px-4 py-2 text-left text-sm text-[#111318] dark:text-gray-300 hover:bg-neutral-soft dark:hover:bg-[#2d364a] transition-colors flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[18px]">edit</span> Edit Details
                                </button>
                                <button onClick={() => handleDeleteClick(req)} className="w-full px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Status Footer */}
              {!loading && requests.length > 0 && (
                <div className="px-6 py-4 bg-background-light dark:bg-[#151a26] border-t border-[#dbdee6] dark:border-[#2d364a] flex items-center justify-between">
                  <p className="text-xs font-medium text-[#616e89]">Total active list length: {requests.length}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ServiceRequestLogs