import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createRoom, updateRoom, getRoomById } from '../../api/roomApi'

function RoomconfigurationForm({ eventId, roomId, onDone, onCancel }) {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    number: '',
    capacity: '',
    type: '',
    notes: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})
  const [isEditing, setIsEditing] = useState(false)

  // Load room data if editing
  useEffect(() => {
    if (roomId) {
      loadRoomData()
    }
  }, [roomId])

  const loadRoomData = async () => {
    try {
      const res = await getRoomById(roomId)
      if (res.success) {
        setFormData({
          number: res.room.number,
          capacity: res.room.capacity,
          type: res.room.type,
          notes: res.room.notes || ''
        })
        setIsEditing(true)
      }
    } catch (err) {
      console.error('Error loading room:', err)
      setError('Failed to load room data')
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.number || formData.number.trim() === '') {
      newErrors.number = 'Room number is required'
    }
    
    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1'
    }
    
    if (!formData.type) {
      newErrors.type = 'Room type is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const roomData = {
        number: formData.number,
        capacity: parseInt(formData.capacity),
        type: formData.type,
        notes: formData.notes,
        event: eventId
      }

      let res
      if (isEditing) {
        res = await updateRoom(roomId, roomData)
      } else {
        res = await createRoom(roomData)
      }

      if (res.success) {
        onDone && onDone()
      } else {
        setError(res.message || 'Failed to save room')
      }
    } catch (err) {
      console.error('Error saving room:', err)
      setError(err.message || 'Failed to save room')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel && onCancel()
  }

  return (
    <>
     {/* <!-- Top Navigation Bar --> */}
  
  <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
    {/* <!-- Breadcrumbs --> */}
    <nav className="flex items-center gap-2 mb-6 text-sm font-medium">
      <a className="text-[#616e89] hover:text-primary" href="#">Events</a>
      <span className="material-symbols-outlined text-[#616e89] text-sm">chevron_right</span>
      <a className="text-[#616e89] hover:text-primary" href="#">Event</a>
      <span className="material-symbols-outlined text-[#616e89] text-sm">chevron_right</span>
      <span className="text-[#111318]">{isEditing ? 'Edit Room' : 'Add Room'}</span>
    </nav>
    {/* <!-- Header --> */}
    <div className="mb-10">
      <h1 className="text-3xl font-black text-[#111318] tracking-tight mb-2">
        {isEditing ? 'Edit Room' : 'Add New Room'}
      </h1>
      <p className="text-[#616e89] text-lg max-w-2xl">
        Configure room details for hospitality allocation. This information
        will be used for automated capacity planning and guest check-ins.
      </p>
    </div>

    {/* Error Alert */}
    {error && (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <span className="material-symbols-outlined text-red-500 text-2xl">error</span>
        <div>
          <p className="font-semibold text-red-900">{error}</p>
        </div>
      </div>
    )}

    {/* <!-- Form Card --> */}
    <div className="bg-white rounded-xl shadow-sm border border-[#dbdee6] overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        {/* <!-- Section 1: Basic Info --> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#111318]">Room Number / Name <span
                className="text-red-500">*</span></label>
            <div className="relative">
              <input
                className={`w-full h-12 rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary text-base px-4 transition-all ${errors.number ? 'border-red-500 bg-red-50' : 'border-[#dbdee6]'}`}
                placeholder="e.g. 101 or Executive Suite A" 
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
              />
            </div>
            {errors.number && <p className="text-xs text-red-500">{errors.number}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#111318]">Capacity (Occupants) <span
                className="text-red-500">*</span></label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#616e89] text-[20px]">groups</span>
              <input
                className={`w-full h-12 rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary text-base pl-10 pr-4 transition-all ${errors.capacity ? 'border-red-500 bg-red-50' : 'border-[#dbdee6]'}`}
                min="1" 
                placeholder="0" 
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>
            {errors.capacity && <p className="text-xs text-red-500">{errors.capacity}</p>}
          </div>
        </div>
        {/* <!-- Section 2: Details --> */}
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#111318]">Room Category <span
                className="text-red-500">*</span></label>
            <select
              className={`w-full h-12 rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary text-base px-4 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23616e89%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat transition-all ${errors.type ? 'border-red-500 bg-red-50' : 'border-[#dbdee6]'}`}
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">
                Select room type
              </option>
              <option value="standard">Standard Single</option>
              <option value="double">Double Occupancy</option>
              <option value="suite">Executive Suite</option>
              <option value="meeting">Meeting Room / Breakout</option>
              <option value="accessible">ADA Accessible</option>
            </select>
            {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#111318]">Internal Operations Notes</label>
              <span className="text-[12px] text-[#616e89] font-normal">Optional</span>
            </div>
            <textarea
              className="w-full rounded-lg border-[#dbdee6] border focus:border-primary focus:ring-1 focus:ring-primary text-base p-4 transition-all resize-none"
              placeholder="Mention special amenities, maintenance requirements, or restricted access details..."
              rows="4"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        {/* <!-- Action Footer --> */}
        <div className="pt-6 border-t border-[#dbdee6] flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            className="w-full sm:w-auto px-6 h-12 rounded-lg border border-[#dbdee6] text-[#111318] font-semibold hover:bg-[#f0f1f4] transition-colors disabled:opacity-50"
            type="button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="w-full sm:w-auto px-8 h-12 rounded-lg bg-primary text-white font-semibold hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">hourglass_top</span>
                {isEditing ? 'Saving...' : 'Adding...'}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">{isEditing ? 'edit' : 'add_circle'}</span>
                {isEditing ? 'Update Room' : 'Add Room'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
    {/* <!-- Helper Suggestion --> */}
    <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-4">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">
        <span className="material-symbols-outlined text-[24px]">edit</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#111318]">
          Need to add multiple rooms?
        </p>
        <p className="text-sm text-[#616e89] mt-1">
          You can save time by uploading a CSV file with your entire room inventory at once.
        </p>
      </div>
    </div>
  </main>
  {/* <!-- Success Toast Mockup --> */}
  </>
  )
}

export default RoomconfigurationForm