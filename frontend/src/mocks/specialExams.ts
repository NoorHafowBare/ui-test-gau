export interface SuppEligibleUnit {
  id: string
  code: string
  title: string
  academicYear: string
  semester: string
  fee: number
  previousGrade: string
}

export interface SuppBookingRecord {
  id: string
  bookingReference: string
  units: SuppEligibleUnit[]
  totalFee: number
  bookedDate: string
  paymentStatus: "paid" | "pending"
  academicYear: string
}

export interface SuppExamCardData {
  id: string
  cardReference: string
  academicYear: string
  session: string
  studentNumber: string
  studentName: string
  programme: string
  faculty: string
  papers: {
    code: string
    title: string
    date: string
    time: string
    venue: string
    seatNumber: string
  }[]
  issuedDate: string
  feeCleared: boolean
}

export interface SpecialExamApplicationRecord {
  id: string
  unitCode: string
  unitTitle: string
  reason: "Medical Emergency" | "Compassionate Grounds" | "Academic Clash" | "Official Representation"
  statement: string
  documentName?: string
  appliedDate: string
  status: "approved" | "pending" | "rejected"
  reviewerComments?: string
}

export interface SpecialExamCardData {
  id: string
  permitNumber: string
  academicYear: string
  session: string
  studentNumber: string
  studentName: string
  programme: string
  faculty: string
  approvedPapers: {
    code: string
    title: string
    date: string
    time: string
    venue: string
    seatNumber: string
  }[]
  issuedDate: string
  medicalCleared: boolean
  deanApproved: boolean
}

export const MOCK_SUPP_ELIGIBLE_UNITS: SuppEligibleUnit[] = [
  {
    id: "supp-u-1",
    code: "STA 312",
    title: "Sampling Methodologies & Survey Design",
    academicYear: "2025/2026",
    semester: "SEM 1",
    fee: 1000,
    previousGrade: "E (Referred)",
  },
  {
    id: "supp-u-2",
    code: "MAT 223",
    title: "Linear Algebra II",
    academicYear: "2024/2025",
    semester: "SEM 2",
    fee: 1000,
    previousGrade: "E (Referred)",
  },
  {
    id: "supp-u-3",
    code: "COM 225",
    title: "Operating Systems Principles",
    academicYear: "2024/2025",
    semester: "SEM 2",
    fee: 1000,
    previousGrade: "E (Referred)",
  },
]

export const MOCK_SUPP_BOOKINGS: SuppBookingRecord[] = [
  {
    id: "bk-001",
    bookingReference: "SUP-2027-8491",
    units: [MOCK_SUPP_ELIGIBLE_UNITS[0]],
    totalFee: 1000,
    bookedDate: "2027-02-14",
    paymentStatus: "paid",
    academicYear: "2026/2027",
  },
]

export const MOCK_SUPP_EXAM_CARD: SuppExamCardData = {
  id: "sec-2027",
  cardReference: "GAU/SUP/2026-27/0042",
  academicYear: "2026/2027",
  session: "Supplementary Examinations Session I",
  studentNumber: "BSC/G0001/23",
  studentName: "ESIPILA GABRIEL",
  programme: "BACHELOR OF SCIENCE (APPLIED STATISTIC WITH COMPUTING)",
  faculty: "School of Pure and Applied Sciences",
  issuedDate: "2027-03-22",
  feeCleared: true,
  papers: [
    {
      code: "STA 312",
      title: "Sampling Methodologies & Survey Design",
      date: "2027-04-28",
      time: "09:00 AM - 12:00 PM",
      venue: "Multipurpose Hall A (MPH-A)",
      seatNumber: "SUP-MPH-014",
    },
  ],
}

export const MOCK_SPECIAL_EXAM_APPLICATIONS: SpecialExamApplicationRecord[] = [
  {
    id: "sea-001",
    unitCode: "STA 413",
    unitTitle: "Measure Theory & Probability",
    reason: "Medical Emergency",
    statement: "Was admitted at Garissa Referral Hospital during the regular exam date with acute viral fever. Hospital discharge certificate attached.",
    documentName: "Garissa_Referral_Discharge_Summary.pdf",
    appliedDate: "2026-12-02",
    status: "approved",
    reviewerComments: "Medical board and Dean verified. Approved for special exam sitting.",
  },
  {
    id: "sea-002",
    unitCode: "COM 415",
    unitTitle: "Database Engineering & Big Data",
    reason: "Academic Clash",
    statement: "Official timetable conflict with national university computing championship held at Strathmore University.",
    documentName: "University_Delegation_Letter.pdf",
    appliedDate: "2026-11-28",
    status: "pending",
    reviewerComments: "Application under assessment by Departmental Examination Committee.",
  },
  {
    id: "sea-003",
    unitCode: "STA 323",
    unitTitle: "Econometric Models & Estimation",
    reason: "Compassionate Grounds",
    statement: "Family bereavement during end-semester examination week.",
    documentName: "Burial_Permit_Copy.pdf",
    appliedDate: "2026-05-18",
    status: "approved",
    reviewerComments: "Dean of Students verified compassionate request. Sitting approved.",
  },
]

export const MOCK_SPECIAL_EXAM_CARD: SpecialExamCardData = {
  id: "spec-card-001",
  permitNumber: "GAU/SPEC/2026-27/0019",
  academicYear: "2026/2027",
  session: "Special Examination Sitting (Compassionate / Medical)",
  studentNumber: "BSC/G0001/23",
  studentName: "ESIPILA GABRIEL",
  programme: "BACHELOR OF SCIENCE (APPLIED STATISTIC WITH COMPUTING)",
  faculty: "School of Pure and Applied Sciences",
  issuedDate: "2027-01-10",
  medicalCleared: true,
  deanApproved: true,
  approvedPapers: [
    {
      code: "STA 413",
      title: "Measure Theory & Probability",
      date: "2027-05-02",
      time: "02:00 PM - 05:00 PM",
      venue: "Science Complex Hall B-03",
      seatNumber: "SPEC-008",
    },
  ],
}
