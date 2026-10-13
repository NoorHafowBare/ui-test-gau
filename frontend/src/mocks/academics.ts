export interface AcademicStudentSummary {
  studentNumber: string
  names: string
  programme: string
  stage: string
  semester: string
  email: string
  academicYear: string
  faculty: string
}

export interface AvailableCourseUnit {
  id: string
  code: string
  title: string
  creditHours: number
  type: "Core" | "Elective"
  lecturer: string
  prerequisites?: string
}

export interface RegisteredCourseUnit {
  id: string
  code: string
  title: string
  creditHours: number
  type: "Core" | "Elective"
  registeredDate: string
  status: "approved" | "pending" | "cleared"
  lecturer: string
}

export interface TimetableClass {
  id: string
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
  time: string
  code: string
  unitName: string
  room: string
  lecturer: string
  type: "Lecture" | "Practical" | "Tutorial"
}

export interface TranscriptUnit {
  code: string
  name: string
  creditHours: number
  grade: "A" | "B" | "C" | "D" | "E"
  points: number
}

export interface SemesterTranscript {
  id: string
  year: number
  semester: number
  title: string
  academicYear: string
  units: TranscriptUnit[]
  gpa: number
  totalCreditHours: number
  status: "Pass" | "Proceed"
}

export interface ExamUnitSchedule {
  code: string
  title: string
  date: string
  time: string
  venue: string
  seatNumber: string
}

export interface ExamCardData {
  id: string
  semesterId: string
  academicYear: string
  semester: string
  studentNumber: string
  studentName: string
  programme: string
  faculty: string
  stage: string
  feeCleared: boolean
  libraryCleared: boolean
  attendancePercentage: number
  examUnits: ExamUnitSchedule[]
  issuedDate: string
}

/**
 * MOCK TOGGLES:
 * - REGISTRATION_OPEN: When true, shows available units table with checkbox selection and registration action.
 *   When false, shows calm warning Alert that registration deadline has passed.
 */
export const REGISTRATION_OPEN = true
export const INITIAL_REGISTERED_EMPTY = true

export const MOCK_ACADEMIC_STUDENT: AcademicStudentSummary = {
  studentNumber: "BSC/G0001/23",
  names: "ESIPILA GABRIEL",
  programme: "BACHELOR OF SCIENCE(APPLIED STATISTIC WITH COMPUTING)",
  stage: "Y4S2",
  semester: "SEM 2 2026/2027",
  email: "collinsmainabosire@gmail.com",
  academicYear: "2026/2027",
  faculty: "School of Pure and Applied Sciences",
}

export const MOCK_AVAILABLE_UNITS: AvailableCourseUnit[] = [
  {
    id: "avail-1",
    code: "STA 421",
    title: "Applied Multivariate Statistical Methods",
    creditHours: 3,
    type: "Core",
    lecturer: "Dr. Abdi Mohamed",
  },
  {
    id: "avail-2",
    code: "STA 422",
    title: "Time Series Analysis & Forecasting",
    creditHours: 3,
    type: "Core",
    lecturer: "Prof. Kenneth Ochieng",
  },
  {
    id: "avail-3",
    code: "STA 423",
    title: "Stochastic Processes & Actuarial Models",
    creditHours: 3,
    type: "Core",
    lecturer: "Dr. Amina Yusuf",
  },
  {
    id: "avail-4",
    code: "COM 424",
    title: "Machine Learning & Statistical Data Mining",
    creditHours: 3,
    type: "Core",
    lecturer: "Dr. Farah Hassan",
  },
  {
    id: "avail-5",
    code: "COM 425",
    title: "Cloud Computing & Distributed Systems",
    creditHours: 3,
    type: "Elective",
    lecturer: "Mr. David Mutua",
  },
  {
    id: "avail-6",
    code: "STA 426",
    title: "Bio-Statistical Modelling & Epidemiological Data",
    creditHours: 3,
    type: "Elective",
    lecturer: "Dr. Grace Nyambura",
  },
]

export const MOCK_REGISTERED_UNITS: RegisteredCourseUnit[] = [
  {
    id: "reg-1",
    code: "STA 421",
    title: "Applied Multivariate Statistical Methods",
    creditHours: 3,
    type: "Core",
    registeredDate: "2027-01-14",
    status: "approved",
    lecturer: "Dr. Abdi Mohamed",
  },
  {
    id: "reg-2",
    code: "STA 422",
    title: "Time Series Analysis & Forecasting",
    creditHours: 3,
    type: "Core",
    registeredDate: "2027-01-14",
    status: "approved",
    lecturer: "Prof. Kenneth Ochieng",
  },
  {
    id: "reg-3",
    code: "STA 423",
    title: "Stochastic Processes & Actuarial Models",
    creditHours: 3,
    type: "Core",
    registeredDate: "2027-01-14",
    status: "approved",
    lecturer: "Dr. Amina Yusuf",
  },
  {
    id: "reg-4",
    code: "COM 424",
    title: "Machine Learning & Statistical Data Mining",
    creditHours: 3,
    type: "Core",
    registeredDate: "2027-01-15",
    status: "pending",
    lecturer: "Dr. Farah Hassan",
  },
]

export const MOCK_TIMETABLE_CLASSES: TimetableClass[] = [
  // Monday
  {
    id: "tt-1",
    day: "Monday",
    time: "08:00 AM - 11:00 AM",
    code: "STA 421",
    unitName: "Applied Multivariate Statistical Methods",
    room: "LT 3 (Lecture Theatre 3)",
    lecturer: "Dr. Abdi Mohamed",
    type: "Lecture",
  },
  {
    id: "tt-2",
    day: "Monday",
    time: "02:00 PM - 05:00 PM",
    code: "COM 424",
    unitName: "Machine Learning & Statistical Data Mining",
    room: "Computer Lab 4 (ICT Complex)",
    lecturer: "Dr. Farah Hassan",
    type: "Practical",
  },

  // Tuesday
  {
    id: "tt-3",
    day: "Tuesday",
    time: "09:00 AM - 12:00 PM",
    code: "STA 422",
    unitName: "Time Series Analysis & Forecasting",
    room: "Science Hall B-12",
    lecturer: "Prof. Kenneth Ochieng",
    type: "Lecture",
  },
  {
    id: "tt-4",
    day: "Tuesday",
    time: "02:00 PM - 04:00 PM",
    code: "STA 421",
    unitName: "Multivariate Methods Lab Tutorial",
    room: "Stat Lab 1",
    lecturer: "Dr. Abdi Mohamed",
    type: "Tutorial",
  },

  // Wednesday
  {
    id: "tt-5",
    day: "Wednesday",
    time: "08:00 AM - 11:00 AM",
    code: "STA 423",
    unitName: "Stochastic Processes & Actuarial Models",
    room: "Lecture Room LR 10",
    lecturer: "Dr. Amina Yusuf",
    type: "Lecture",
  },
  {
    id: "tt-6",
    day: "Wednesday",
    time: "01:00 PM - 04:00 PM",
    code: "COM 425",
    unitName: "Cloud Computing & Distributed Systems",
    room: "ICT Lab 2",
    lecturer: "Mr. David Mutua",
    type: "Lecture",
  },

  // Thursday
  {
    id: "tt-7",
    day: "Thursday",
    time: "10:00 AM - 01:00 PM",
    code: "STA 426",
    unitName: "Bio-Statistical Modelling",
    room: "School of Health Sciences Hall 2",
    lecturer: "Dr. Grace Nyambura",
    type: "Lecture",
  },
  {
    id: "tt-8",
    day: "Thursday",
    time: "02:00 PM - 05:00 PM",
    code: "STA 422",
    unitName: "Time Series Modelling & R Lab",
    room: "Computer Lab 3",
    lecturer: "Prof. Kenneth Ochieng",
    type: "Practical",
  },

  // Friday is intentionally EMPTY to satisfy requirement: "Include one empty day"
]

export const MOCK_TRANSCRIPTS: SemesterTranscript[] = [
  {
    id: "trans-y4s1",
    year: 4,
    semester: 1,
    title: "Year 4 • Semester 1",
    academicYear: "2026/2027",
    units: [
      { code: "STA 411", name: "Design and Analysis of Experiments II", creditHours: 3, grade: "A", points: 12 },
      { code: "STA 412", name: "Non-Parametric Statistical Methods", creditHours: 3, grade: "A", points: 12 },
      { code: "STA 413", name: "Measure Theory & Probability", creditHours: 3, grade: "B", points: 9 },
      { code: "COM 414", name: "Artificial Intelligence & Neural Nets", creditHours: 3, grade: "A", points: 12 },
      { code: "COM 415", name: "Database Engineering & Big Data", creditHours: 3, grade: "B", points: 9 },
    ],
    gpa: 3.60,
    totalCreditHours: 15,
    status: "Pass",
  },
  {
    id: "trans-y3s2",
    year: 3,
    semester: 2,
    title: "Year 3 • Semester 2",
    academicYear: "2025/2026",
    units: [
      { code: "STA 321", name: "Statistical Quality Control & Acceptance", creditHours: 3, grade: "A", points: 12 },
      { code: "STA 322", name: "Demographic & Health Statistics", creditHours: 3, grade: "B", points: 9 },
      { code: "STA 323", name: "Econometric Models & Estimation", creditHours: 3, grade: "A", points: 12 },
      { code: "COM 324", name: "Object Oriented Software Architecture", creditHours: 3, grade: "B", points: 9 },
      { code: "COM 325", name: "Algorithms & Computational Complexity", creditHours: 3, grade: "B", points: 9 },
    ],
    gpa: 3.40,
    totalCreditHours: 15,
    status: "Pass",
  },
  {
    id: "trans-y3s1",
    year: 3,
    semester: 1,
    title: "Year 3 • Semester 1",
    academicYear: "2025/2026",
    units: [
      { code: "STA 311", name: "Testing of Statistical Hypotheses", creditHours: 3, grade: "A", points: 12 },
      { code: "STA 312", name: "Sampling Methodologies & Surveys", creditHours: 3, grade: "A", points: 12 },
      { code: "STA 313", name: "Regression Analysis & Diagnostics", creditHours: 3, grade: "A", points: 12 },
      { code: "COM 314", name: "Data Structures & Systems Programming", creditHours: 3, grade: "B", points: 9 },
      { code: "COM 315", name: "Computer Networks & Security", creditHours: 3, grade: "B", points: 9 },
    ],
    gpa: 3.60,
    totalCreditHours: 15,
    status: "Pass",
  },
  {
    id: "trans-y2s2",
    year: 2,
    semester: 2,
    title: "Year 2 • Semester 2",
    academicYear: "2024/2025",
    units: [
      { code: "STA 221", name: "Probability and Distribution Theory II", creditHours: 3, grade: "B", points: 9 },
      { code: "STA 222", name: "Mathematical Statistics I", creditHours: 3, grade: "A", points: 12 },
      { code: "MAT 223", name: "Linear Algebra II", creditHours: 3, grade: "B", points: 9 },
      { code: "COM 224", name: "Object Oriented Programming in C++", creditHours: 3, grade: "A", points: 12 },
      { code: "COM 225", name: "Operating Systems Principles", creditHours: 3, grade: "B", points: 9 },
    ],
    gpa: 3.40,
    totalCreditHours: 15,
    status: "Pass",
  },
  {
    id: "trans-y1s1",
    year: 1,
    semester: 1,
    title: "Year 1 • Semester 1",
    academicYear: "2023/2024",
    units: [
      { code: "STA 111", name: "Descriptive Statistics & Exploratory Data", creditHours: 3, grade: "A", points: 12 },
      { code: "MAT 112", name: "Calculus I (Single Variable)", creditHours: 3, grade: "A", points: 12 },
      { code: "COM 113", name: "Introduction to Computer Science & Python", creditHours: 3, grade: "A", points: 12 },
      { code: "CCS 001", name: "Communication Skills & Academic Writing", creditHours: 3, grade: "A", points: 12 },
      { code: "CCS 002", name: "Development Studies & Ethics", creditHours: 3, grade: "B", points: 9 },
    ],
    gpa: 3.80,
    totalCreditHours: 15,
    status: "Pass",
  },
]

export const MOCK_EXAM_CARDS: Record<string, ExamCardData> = {
  "2026-sem2": {
    id: "ec-2026-s2",
    semesterId: "2026-sem2",
    academicYear: "2026/2027",
    semester: "Semester 2 (Regular)",
    studentNumber: "BSC/G0001/23",
    studentName: "ESIPILA GABRIEL",
    programme: "BACHELOR OF SCIENCE (APPLIED STATISTIC WITH COMPUTING)",
    faculty: "School of Pure and Applied Sciences",
    stage: "Year 4 • Semester 2",
    feeCleared: true,
    libraryCleared: true,
    attendancePercentage: 94,
    issuedDate: "2027-03-20",
    examUnits: [
      {
        code: "STA 421",
        title: "Applied Multivariate Statistical Methods",
        date: "2027-04-12",
        time: "09:00 AM - 12:00 PM",
        venue: "Multipurpose Hall A (MPH-A)",
        seatNumber: "MPH-A-042",
      },
      {
        code: "STA 422",
        title: "Time Series Analysis & Forecasting",
        date: "2027-04-15",
        time: "02:00 PM - 05:00 PM",
        venue: "Lecture Theatre 3 (LT-3)",
        seatNumber: "LT3-018",
      },
      {
        code: "STA 423",
        title: "Stochastic Processes & Actuarial Models",
        date: "2027-04-19",
        time: "09:00 AM - 12:00 PM",
        venue: "Multipurpose Hall B (MPH-B)",
        seatNumber: "MPH-B-105",
      },
      {
        code: "COM 424",
        title: "Machine Learning & Statistical Data Mining",
        date: "2027-04-23",
        time: "09:00 AM - 12:00 PM",
        venue: "ICT Complex Exam Hall 1",
        seatNumber: "ICT-064",
      },
    ],
  },
  "2026-sem1": {
    id: "ec-2026-s1",
    semesterId: "2026-sem1",
    academicYear: "2026/2027",
    semester: "Semester 1 (Regular)",
    studentNumber: "BSC/G0001/23",
    studentName: "ESIPILA GABRIEL",
    programme: "BACHELOR OF SCIENCE (APPLIED STATISTIC WITH COMPUTING)",
    faculty: "School of Pure and Applied Sciences",
    stage: "Year 4 • Semester 1",
    feeCleared: true,
    libraryCleared: true,
    attendancePercentage: 91,
    issuedDate: "2026-11-10",
    examUnits: [
      {
        code: "STA 411",
        title: "Design and Analysis of Experiments II",
        date: "2026-11-24",
        time: "09:00 AM - 12:00 PM",
        venue: "Hall 2",
        seatNumber: "H2-019",
      },
      {
        code: "STA 412",
        title: "Non-Parametric Statistical Methods",
        date: "2026-11-28",
        time: "02:00 PM - 05:00 PM",
        venue: "Hall 3",
        seatNumber: "H3-054",
      },
    ],
  },
}

export const EXAM_SEMESTER_OPTIONS = [
  { id: "2026-sem2", label: "2026/2027 • Semester 2 (Current)" },
  { id: "2026-sem1", label: "2026/2027 • Semester 1" },
  { id: "2027-supp", label: "2026/2027 • Supplementary Session (No Card Released)" },
]
