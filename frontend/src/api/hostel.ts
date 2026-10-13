import {
  MOCK_HOSTELS,
  MOCK_HOSTEL_ROOMS,
  INITIAL_EXISTING_BOOKING,
  type Hostel,
  type HostelRoom,
  type ExistingHostelBooking,
} from "@/mocks/hostel"

const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms))

let currentBooking: ExistingHostelBooking | null = INITIAL_EXISTING_BOOKING

export async function getHostels(): Promise<Hostel[]> {
  await simulateDelay(250)
  return [...MOCK_HOSTELS]
}

export async function getRoomsForHostel(hostelId: string): Promise<HostelRoom[]> {
  await simulateDelay(300)
  return MOCK_HOSTEL_ROOMS[hostelId] || []
}

export async function getCurrentHostelBooking(): Promise<ExistingHostelBooking | null> {
  await simulateDelay(250)
  return currentBooking
}

export async function bookHostelRoom(
  hostelId: string,
  roomId: string
): Promise<ExistingHostelBooking> {
  await simulateDelay(600)
  const hostel = MOCK_HOSTELS.find((h) => h.id === hostelId)
  const rooms = MOCK_HOSTEL_ROOMS[hostelId] || []
  const room = rooms.find((r) => r.id === roomId)

  if (!hostel || !room) {
    throw new Error("Invalid room selected")
  }

  const newBooking: ExistingHostelBooking = {
    id: `hb-${Date.now().toString(36)}`,
    bookingReference: `HB-2027-${Math.floor(1000 + Math.random() * 9000)}`,
    hostelName: hostel.name,
    hostelCode: hostel.code,
    roomNumber: room.roomNumber,
    floor: room.floor,
    bedNumber: `Bed 0${room.occupied + 1}`,
    semester: "Semester 2 (Regular)",
    academicYear: "2026/2027",
    feePerSemester: room.feePerSemester,
    allocatedDate: new Date().toISOString().split("T")[0],
    status: "cleared",
  }

  currentBooking = newBooking
  return newBooking
}

export async function cancelHostelBooking(): Promise<boolean> {
  await simulateDelay(500)
  currentBooking = null
  return true
}

export function resetDemoBooking(): void {
  currentBooking = INITIAL_EXISTING_BOOKING
}
