export interface ClearanceDepartment {
  id: string
  name: string
  code: string
  officer: string
  officeLocation: string
  dateCleared: string | null
  status: "cleared" | "pending"
  notes: string
  iconName: "Library" | "Finance" | "Hostel" | "Department" | "Sports" | "ICT" | "Dean"
}

export const MOCK_CLEARANCE_DEPARTMENTS_INCOMPLETE: ClearanceDepartment[] = [
  {
    id: "clr-lib",
    name: "University Central Library",
    code: "LIB",
    officer: "Mr. Peter Kipchoge",
    officeLocation: "Ground Floor, Library Building",
    dateCleared: "2027-04-02",
    status: "cleared",
    notes: "All 3 borrowed physical textbooks returned. Zero overdue fine balance.",
    iconName: "Library",
  },
  {
    id: "clr-fin",
    name: "Student Finance Office",
    code: "FIN",
    officer: "Mrs. Fatuma Abdi",
    officeLocation: "Finance Complex, Room 102",
    dateCleared: "2027-04-03",
    status: "cleared",
    notes: "Tuition and statutory fees fully paid. Account balance KES 0.00.",
    iconName: "Finance",
  },
  {
    id: "clr-hos",
    name: "Halls of Residence (Hostel)",
    code: "HOS",
    officer: "Mr. Bernard Otieno",
    officeLocation: "Hostels Directorate, Block B",
    dateCleared: "2027-04-04",
    status: "cleared",
    notes: "Room B-14 keys surrendered. Room fixture inspection verified.",
    iconName: "Hostel",
  },
  {
    id: "clr-dep",
    name: "Department of Mathematics & Computing",
    code: "DPT",
    officer: "Prof. Kenneth Ochieng",
    officeLocation: "Science Complex, 2nd Floor",
    dateCleared: "2027-04-05",
    status: "cleared",
    notes: "Undergraduate project thesis and repository code submitted and accepted.",
    iconName: "Department",
  },
  {
    id: "clr-spt",
    name: "Sports & Games Directorate",
    code: "SPT",
    officer: "Coach Jackson Mutua",
    officeLocation: "Sports Pavilion Office",
    dateCleared: null,
    status: "pending",
    notes: "Pending return of university badminton racquet and tournament jersey.",
    iconName: "Sports",
  },
  {
    id: "clr-ict",
    name: "ICT Directorate & Systems Labs",
    code: "ICT",
    officer: "Eng. Dennis Kimani",
    officeLocation: "ICT Complex, Server Wing",
    dateCleared: null,
    status: "pending",
    notes: "Smart lab RFID access badge return pending verification.",
    iconName: "ICT",
  },
  {
    id: "clr-dos",
    name: "Dean of Students Affairs",
    code: "DOS",
    officer: "Dr. Halima Noor",
    officeLocation: "Administration Block, 1st Floor",
    dateCleared: null,
    status: "pending",
    notes: "Graduation clearance exit survey pending completion.",
    iconName: "Dean",
  },
]

export const MOCK_CLEARANCE_DEPARTMENTS_COMPLETE: ClearanceDepartment[] =
  MOCK_CLEARANCE_DEPARTMENTS_INCOMPLETE.map((dept) => ({
    ...dept,
    dateCleared: dept.dateCleared || "2027-04-08",
    status: "cleared",
    notes: dept.notes.replace("Pending", "Cleared -").replace("pending", "cleared"),
  }))
