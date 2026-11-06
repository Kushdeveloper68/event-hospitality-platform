import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../api/roomApi', () => ({
  getRooms: vi.fn(),
  exportAllRooms: vi.fn(),
  createRoom: vi.fn(),
  updateRoom: vi.fn(),
  deleteRoom: vi.fn(),
  assignGuestToRoom: vi.fn(),
  getRoomGuests: vi.fn(),
  unassignGuestFromRoom: vi.fn(),
  bulkImportRooms: vi.fn(),
}))
vi.mock('../api/guestApi', () => ({ getGuests: vi.fn().mockResolvedValue({ success: true, guests: [] }) }))

import * as roomApi from '../api/roomApi'
import RoomInventoryManagement from '../pages/inventory/RoomInventoryManagement'

const rooms = [
  { _id: 'r1', number: '101', capacity: 2, occupancy: 2, type: 'double' }, // full
  { _id: 'r2', number: '102', capacity: 2, occupancy: 0, type: 'standard' },
]
const stats = { total: 2, available: 1, occupied: 1, totalCapacity: 4, totalOccupancy: 2 }
const rahul = { _id: 'g1', fullName: 'Rahul Mehta', groupName: 'Mehta Family', checkedIn: true }
const priya = { _id: 'g2', fullName: 'Priya Shah' }

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/events/e1/rooms']}>
      <Routes><Route path="/events/:eventId/rooms" element={<RoomInventoryManagement />} /></Routes>
    </MemoryRouter>
  )

async function openManageModal() {
  renderPage()
  await userEvent.click(await screen.findByRole('button', { name: /manage guests/i }))
  await screen.findByText(/guests in room 101/i)
}

beforeEach(() => {
  vi.clearAllMocks()
  roomApi.getRooms.mockResolvedValue({ success: true, rooms, total: 2, totalPages: 1, stats })
  roomApi.getRoomGuests.mockResolvedValue({ success: true, guests: [rahul, priya] })
  roomApi.unassignGuestFromRoom.mockResolvedValue({ success: true, message: 'Rahul Mehta removed from room 101' })
  roomApi.assignGuestToRoom.mockResolvedValue({ success: true })
})

describe('Manage guests (room)', () => {
  it('only occupied rooms get a manage button — the empty room has none', async () => {
    renderPage()
    await screen.findByText('101')
    expect(screen.getAllByRole('button', { name: /manage guests/i })).toHaveLength(1)
  })

  it('lists the room\'s guests', async () => {
    await openManageModal()
    expect(roomApi.getRoomGuests).toHaveBeenCalledWith('r1')
    expect(await screen.findByText('Rahul Mehta')).toBeInTheDocument()
    expect(screen.getByText('Priya Shah')).toBeInTheDocument()
    expect(screen.getByText('Checked in')).toBeInTheDocument()
  })

  it('Remove calls the API for that guest and refreshes the list', async () => {
    await openManageModal()
    roomApi.getRoomGuests.mockResolvedValue({ success: true, guests: [priya] })

    await userEvent.click(await screen.findByRole('button', { name: /remove rahul mehta from this room/i }))

    await waitFor(() => expect(roomApi.unassignGuestFromRoom).toHaveBeenCalledWith('r1', 'g1'))
    await waitFor(() => expect(screen.queryByText('Rahul Mehta')).not.toBeInTheDocument())
    expect(screen.getByText('Priya Shah')).toBeInTheDocument()
  })

  it('Move offers only OTHER rooms with space, and assigns to the chosen one', async () => {
    await openManageModal()
    const row = (await screen.findByText('Priya Shah')).closest('li')
    await userEvent.click(within(row).getByRole('button', { name: /^move$/i }))

    const select = within(row).getByLabelText(/move to room/i)
    const options = within(select).getAllByRole('option').map((o) => o.textContent)
    expect(options.some((t) => /room 102/i.test(t))).toBe(true)
    expect(options.some((t) => /room 101/i.test(t))).toBe(false) // not the room they're already in

    const moveBtn = within(row).getByRole('button', { name: /move here/i })
    expect(moveBtn).toBeDisabled() // nothing chosen yet
    await userEvent.selectOptions(select, 'r2')
    await userEvent.click(moveBtn)

    await waitFor(() => expect(roomApi.assignGuestToRoom).toHaveBeenCalledWith('r2', 'g2'))
  })

  it('shows the server\'s message when removing fails (e.g. guest was moved by someone else)', async () => {
    await openManageModal()
    roomApi.unassignGuestFromRoom.mockRejectedValue({ success: false, message: 'Rahul Mehta is no longer in room 101' })

    await userEvent.click(await screen.findByRole('button', { name: /remove rahul mehta from this room/i }))

    expect(await screen.findByText(/no longer in room 101/i)).toBeInTheDocument()
  })

  it('shows a clear message when the target room filled up while moving', async () => {
    await openManageModal()
    roomApi.assignGuestToRoom.mockRejectedValue({ success: false, message: 'Room 102 is full (2/2 guests)' })
    const row = (await screen.findByText('Priya Shah')).closest('li')
    await userEvent.click(within(row).getByRole('button', { name: /^move$/i }))
    await userEvent.selectOptions(within(row).getByLabelText(/move to room/i), 'r2')
    await userEvent.click(within(row).getByRole('button', { name: /move here/i }))

    expect(await screen.findByText(/room 102 is full/i)).toBeInTheDocument()
  })
})
