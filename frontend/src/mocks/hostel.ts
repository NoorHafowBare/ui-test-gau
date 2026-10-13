export interface Hostel {
  id: string
  name: string
  code: string
  gender: "Male" | "Female" | "Mixed"
  capacity: string
  location: string
  amenities: string[]
}

export interface HostelRoom {
  id: string
  hostelId: string
  roomNumber: string
  floor: string
  capacity: number
  occupied: number
  feePerSemester: number
  status: "Available" | "Full" | "Reserved"
  amenities: string[]
}

export interface ExistingHostelBooking {
  id: string
  bookingReference: string
  hostelName: string
  hostelCode: string
  roomNumber: string
  floor: string
  semester: string
  academicYear: string
  feePerSemester: number
  allocatedDate: string
  status: "cleared" | "pending"
  bedNumber: string
}

export const MOCK_HOSTELS: Hostel[] = [
  {
    id: "h-hall1",
    name: "Hall of Residence 1 (Yussuf Hall)",
    code: "HALL-01",
    gender: "Male",
    capacity: "420 Students",
    location: "Eastern Campus Zone, Near Sports Complex",
    amenities: ["Solar Hot Water", "Common Study Lounge", "High-Speed WiFi", "Laundry Sinks"],
  },
  {
    id: "h-hall2",
    name: "Hall of Residence 2 (Amina Hall)",
    code: "HALL-02",
    gender: "Female",
    capacity: "380 Students",
    location: "Central Campus Zone, Near Student Center",
    amenities: ["Self-Contained Rooms", "24/7 Security Desk", "WiFi", "Kitchenette Area"],
  },
  {
    id: "h-hall3",
    name: "Hall of Residence 3 (Senior Men)",
    code: "HALL-03",
    gender: "Male",
    capacity: "260 Students",
    location: "Western Campus Zone",
    amenities: ["Study Desks", "Solar Lighting", "Quiet Zone", "DSTV Common Room"],
  },
]

export const MOCK_HOSTEL_ROOMS: Record<string, HostelRoom[]> = {
  "h-hall1": [
    {
      id: "rm-101",
      hostelId: "h-hall1",
      roomNumber: "Room 101",
      floor: "Ground Floor",
      capacity: 4,
      occupied: 2,
      feePerSemester: 6500,
      status: "Available",
      amenities: ["Balcony View", "Close to Washrooms", "Study Shelves"],
    },
    {
      id: "rm-104",
      hostelId: "h-hall1",
      roomNumber: "Room 104",
      floor: "Ground Floor",
      capacity: 4,
      occupied: 4,
      feePerSemester: 6500,
      status: "Full",
      amenities: ["Study Shelves", "Wardrobes"],
    },
    {
      id: "rm-205",
      hostelId: "h-hall1",
      roomNumber: "Room 205",
      floor: "1st Floor",
      capacity: 2,
      occupied: 1,
      feePerSemester: 8500,
      status: "Available",
      amenities: ["Double Cubicle", "Quiet Corner", "Window Facing Garden"],
    },
    {
      id: "rm-212",
      hostelId: "h-hall1",
      roomNumber: "Room 212",
      floor: "1st Floor",
      capacity: 4,
      occupied: 3,
      feePerSemester: 6500,
      status: "Available",
      amenities: ["Bunk Beds", "Study Desks", "Spacious Lockers"],
    },
    {
      id: "rm-301",
      hostelId: "h-hall1",
      roomNumber: "Room 301",
      floor: "2nd Floor",
      capacity: 2,
      occupied: 0,
      feePerSemester: 8500,
      status: "Available",
      amenities: ["Dual Study Unit", "High Natural Light", "Ceiling Fan"],
    },
  ],
  "h-hall2": [
    {
      id: "rm-h2-101",
      hostelId: "h-hall2",
      roomNumber: "Room 101-B",
      floor: "Ground Floor",
      capacity: 4,
      occupied: 2,
      feePerSemester: 7000,
      status: "Available",
      amenities: ["En-Suite Bathroom", "Closet Mirrors", "Reading Desks"],
    },
    {
      id: "rm-h2-204",
      hostelId: "h-hall2",
      roomNumber: "Room 204-B",
      floor: "1st Floor",
      capacity: 2,
      occupied: 2,
      feePerSemester: 9000,
      status: "Full",
      amenities: ["Double Studio", "Self-Contained", "Garden Facing"],
    },
  ],
  "h-hall3": [
    {
      id: "rm-h3-102",
      hostelId: "h-hall3",
      roomNumber: "Room 102-C",
      floor: "Ground Floor",
      capacity: 2,
      occupied: 1,
      feePerSemester: 8000,
      status: "Available",
      amenities: ["Senior Quiet Wing", "Ethernet Port", "Wardrobe Units"],
    },
  ],
}

export const INITIAL_EXISTING_BOOKING: ExistingHostelBooking = {
  id: "hb-2027",
  bookingReference: "HB-2027-4491",
  hostelName: "Hall of Residence 1 (Yussuf Hall)",
  hostelCode: "HALL-01",
  roomNumber: "Room 205",
  floor: "1st Floor • East Wing",
  bedNumber: "Bed 02 (Lower Bunk)",
  semester: "Semester 2 (Regular)",
  academicYear: "2026/2027",
  feePerSemester: 8500,
  allocatedDate: "2027-01-12",
  status: "cleared",
}
