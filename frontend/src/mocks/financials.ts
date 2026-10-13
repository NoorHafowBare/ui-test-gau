export interface FeeStatementItem {
  id: string
  date: string
  reference: string
  description: string
  debit: number
  credit: number
  balance: number
  academicYear: string
  semester: string
}

export type PaymentMode = "M-Pesa" | "Bank Deposit" | "eCitizen" | "HELB"
export type PaymentStatus = "paid" | "cleared" | "pending" | "rejected"

export interface FeeReceiptItem {
  id: string
  date: string
  refNumber: string
  transactionRef: string
  paymentMode: PaymentMode
  paidBy: string
  amount: number
  status: PaymentStatus
  channel: string
  bankBranch?: string
  studentReg: string
  studentName: string
  programme: string
  academicYear: string
  semester: string
  description: string
}

export interface FeeStructureItem {
  id: string
  category: string
  item: string
  sem1: number
  sem2: number
  total: number
  isMandatory: boolean
}

export interface FeeStructureProgramme {
  id: string
  programmeCode: string
  programmeName: string
  faculty: string
  year: number
  academicYear: string
  items: FeeStructureItem[]
  totalSem1: number
  totalSem2: number
  grandTotal: number
}

export interface FeePaymentInfo {
  studentReg: string
  studentName: string
  programme: string
  academicYear: string
  semester: string
  totalBilled: number
  totalPaid: number
  outstandingBalance: number
  minimumPayment: number
  currency: string
  convenienceFeeNote: string
}

/**
 * TOGGLE FOR DEMONSTRATING THE ZERO-ROW EMPTY STATE:
 * Change this constant to `true` to simulate a student with zero receipts,
 * which renders the built-in EmptyState inside the Receipts DataTable.
 */
export const FORCE_EMPTY_RECEIPTS = false

export const MOCK_PAYMENT_INFO: FeePaymentInfo = {
  studentReg: "EDS/0001/26",
  studentName: "Esipila Gabriel",
  programme: "Bachelor of Education (Arts)",
  academicYear: "2026/2027",
  semester: "Semester 2",
  totalBilled: 30000,
  totalPaid: 0,
  outstandingBalance: 30000,
  minimumPayment: 51,
  currency: "KES",
  convenienceFeeNote: "A small convenience fee applies on top of your entered amount.",
}

export const MOCK_FEE_STATEMENTS: FeeStatementItem[] = [
  {
    id: "stmt-001",
    date: "2026-09-02",
    reference: "INV-2026-0902",
    description: "Tuition Fee - Year 3 Semester 1",
    debit: 26000,
    credit: 0,
    balance: 26000,
    academicYear: "2026/2027",
    semester: "Semester 1",
  },
  {
    id: "stmt-002",
    date: "2026-09-02",
    reference: "INV-2026-0903",
    description: "Examination & Assessment Fee",
    debit: 2500,
    credit: 0,
    balance: 28500,
    academicYear: "2026/2027",
    semester: "Semester 1",
  },
  {
    id: "stmt-003",
    date: "2026-09-02",
    reference: "INV-2026-0904",
    description: "Library, Computer & ICT Services",
    debit: 1500,
    credit: 0,
    balance: 30000,
    academicYear: "2026/2027",
    semester: "Semester 1",
  },
  {
    id: "stmt-004",
    date: "2026-09-18",
    reference: "GAU-REC-84192",
    description: "Fee Payment via M-Pesa (Ref: QL83910KD2)",
    debit: 0,
    credit: 15000,
    balance: 15000,
    academicYear: "2026/2027",
    semester: "Semester 1",
  },
  {
    id: "stmt-005",
    date: "2026-10-12",
    reference: "GAU-REC-85721",
    description: "Fee Payment via Equity Bank Deposit (Slip: EQ-77192)",
    debit: 0,
    credit: 15000,
    balance: 0,
    academicYear: "2026/2027",
    semester: "Semester 1",
  },
  {
    id: "stmt-006",
    date: "2027-01-10",
    reference: "INV-2027-0110",
    description: "Tuition Fee - Year 3 Semester 2",
    debit: 26000,
    credit: 0,
    balance: 26000,
    academicYear: "2026/2027",
    semester: "Semester 2",
  },
  {
    id: "stmt-007",
    date: "2027-01-10",
    reference: "INV-2027-0111",
    description: "Examination & Assessment Fee - Sem 2",
    debit: 2500,
    credit: 0,
    balance: 28500,
    academicYear: "2026/2027",
    semester: "Semester 2",
  },
  {
    id: "stmt-008",
    date: "2027-01-10",
    reference: "INV-2027-0112",
    description: "Student Activity & Medical Cover",
    debit: 1500,
    credit: 0,
    balance: 30000,
    academicYear: "2026/2027",
    semester: "Semester 2",
  },
]

export const MOCK_FEE_RECEIPTS: FeeReceiptItem[] = [
  {
    id: "rec-001",
    date: "2026-10-12",
    refNumber: "GAU-REC-85721",
    transactionRef: "EQ-77192083",
    paymentMode: "Bank Deposit",
    paidBy: "Gabriel Esipila",
    amount: 15000,
    status: "cleared",
    channel: "Equity Bank Garissa Branch",
    bankBranch: "Garissa Main Branch",
    studentReg: "EDS/0001/26",
    studentName: "Esipila Gabriel",
    programme: "Bachelor of Education (Arts)",
    academicYear: "2026/2027",
    semester: "Semester 1",
    description: "Semester 1 Fee Clearance - Bank Deposit",
  },
  {
    id: "rec-002",
    date: "2026-09-18",
    refNumber: "GAU-REC-84192",
    transactionRef: "QL83910KD2",
    paymentMode: "M-Pesa",
    paidBy: "Mary Wanjiku (Guardian)",
    amount: 15000,
    status: "paid",
    channel: "eCitizen PesaFlow Paybill 222222",
    studentReg: "EDS/0001/26",
    studentName: "Esipila Gabriel",
    programme: "Bachelor of Education (Arts)",
    academicYear: "2026/2027",
    semester: "Semester 1",
    description: "First Installment Payment via M-Pesa",
  },
  {
    id: "rec-003",
    date: "2026-05-14",
    refNumber: "GAU-REC-79201",
    transactionRef: "HLB-2026-55912",
    paymentMode: "HELB",
    paidBy: "Higher Education Loans Board",
    amount: 22000,
    status: "cleared",
    channel: "Government Capitation / HELB Loan",
    studentReg: "EDS/0001/26",
    studentName: "Esipila Gabriel",
    programme: "Bachelor of Education (Arts)",
    academicYear: "2025/2026",
    semester: "Semester 2",
    description: "Undergraduate Student Loan Disbursement",
  },
  {
    id: "rec-004",
    date: "2026-01-20",
    refNumber: "GAU-REC-73108",
    transactionRef: "EC-88912301",
    paymentMode: "eCitizen",
    paidBy: "Gabriel Esipila",
    amount: 8000,
    status: "paid",
    channel: "eCitizen Online Portal",
    studentReg: "EDS/0001/26",
    studentName: "Esipila Gabriel",
    programme: "Bachelor of Education (Arts)",
    academicYear: "2025/2026",
    semester: "Semester 2",
    description: "Supplementary Registration & Activity Balance",
  },
  {
    id: "rec-005",
    date: "2025-09-11",
    refNumber: "GAU-REC-65490",
    transactionRef: "KCB-881920-GSA",
    paymentMode: "Bank Deposit",
    paidBy: "Gabriel Esipila",
    amount: 30000,
    status: "cleared",
    channel: "KCB Bank Garissa Branch",
    bankBranch: "Garissa Branch",
    studentReg: "EDS/0001/26",
    studentName: "Esipila Gabriel",
    programme: "Bachelor of Education (Arts)",
    academicYear: "2025/2026",
    semester: "Semester 1",
    description: "Annual Tuition & Student Amenities Settlement",
  },
]

export const MOCK_FEE_STRUCTURES: Record<string, Record<number, FeeStructureProgramme>> = {
  "bed-arts": {
    1: {
      id: "fs-bed-y1",
      programmeCode: "EDS",
      programmeName: "Bachelor of Education (Arts)",
      faculty: "School of Education & Social Sciences",
      year: 1,
      academicYear: "2026/2027",
      items: [
        { id: "fi-1", category: "Tuition", item: "Tuition Fees", sem1: 20000, sem2: 20000, total: 40000, isMandatory: true },
        { id: "fi-2", category: "Statutory", item: "Registration Fee", sem1: 1000, sem2: 0, total: 1000, isMandatory: true },
        { id: "fi-3", category: "Statutory", item: "Examination Fee", sem1: 2500, sem2: 2500, total: 5000, isMandatory: true },
        { id: "fi-4", category: "Statutory", item: "Library & ICT Fee", sem1: 1500, sem2: 1500, total: 3000, isMandatory: true },
        { id: "fi-5", category: "Statutory", item: "Medical Services & Insurance", sem1: 1000, sem2: 1000, total: 2000, isMandatory: true },
        { id: "fi-6", category: "Statutory", item: "Student Activity Fee", sem1: 1000, sem2: 1000, total: 2000, isMandatory: true },
        { id: "fi-7", category: "Statutory", item: "GUSA Student Union Dues", sem1: 500, sem2: 500, total: 1000, isMandatory: true },
        { id: "fi-8", category: "One-Time", item: "Caution Money (Refundable)", sem1: 2000, sem2: 0, total: 2000, isMandatory: true },
        { id: "fi-9", category: "One-Time", item: "Student Identity Card", sem1: 500, sem2: 0, total: 500, isMandatory: true },
      ],
      totalSem1: 30000,
      totalSem2: 26500,
      grandTotal: 56500,
    },
    2: {
      id: "fs-bed-y2",
      programmeCode: "EDS",
      programmeName: "Bachelor of Education (Arts)",
      faculty: "School of Education & Social Sciences",
      year: 2,
      academicYear: "2026/2027",
      items: [
        { id: "fi-1", category: "Tuition", item: "Tuition Fees", sem1: 20000, sem2: 20000, total: 40000, isMandatory: true },
        { id: "fi-2", category: "Statutory", item: "Registration Fee", sem1: 1000, sem2: 0, total: 1000, isMandatory: true },
        { id: "fi-3", category: "Statutory", item: "Examination Fee", sem1: 2500, sem2: 2500, total: 5000, isMandatory: true },
        { id: "fi-4", category: "Statutory", item: "Library & ICT Fee", sem1: 1500, sem2: 1500, total: 3000, isMandatory: true },
        { id: "fi-5", category: "Statutory", item: "Medical Services & Insurance", sem1: 1000, sem2: 1000, total: 2000, isMandatory: true },
        { id: "fi-6", category: "Statutory", item: "Student Activity Fee", sem1: 1000, sem2: 1000, total: 2000, isMandatory: true },
        { id: "fi-7", category: "Statutory", item: "GUSA Student Union Dues", sem1: 500, sem2: 500, total: 1000, isMandatory: true },
      ],
      totalSem1: 27500,
      totalSem2: 26500,
      grandTotal: 54000,
    },
    3: {
      id: "fs-bed-y3",
      programmeCode: "EDS",
      programmeName: "Bachelor of Education (Arts)",
      faculty: "School of Education & Social Sciences",
      year: 3,
      academicYear: "2026/2027",
      items: [
        { id: "fi-1", category: "Tuition", item: "Tuition Fees", sem1: 22000, sem2: 22000, total: 44000, isMandatory: true },
        { id: "fi-2", category: "Statutory", item: "Registration Fee", sem1: 1000, sem2: 0, total: 1000, isMandatory: true },
        { id: "fi-3", category: "Statutory", item: "Examination Fee", sem1: 2500, sem2: 2500, total: 5000, isMandatory: true },
        { id: "fi-4", category: "Statutory", item: "Library & ICT Fee", sem1: 1500, sem2: 1500, total: 3000, isMandatory: true },
        { id: "fi-5", category: "Statutory", item: "Medical Services & Insurance", sem1: 1000, sem2: 1000, total: 2000, isMandatory: true },
        { id: "fi-6", category: "Statutory", item: "Student Activity Fee", sem1: 1000, sem2: 1000, total: 2000, isMandatory: true },
        { id: "fi-7", category: "Statutory", item: "Teaching Practice / Practicum", sem1: 4000, sem2: 0, total: 4000, isMandatory: true },
        { id: "fi-8", category: "Statutory", item: "GUSA Student Union Dues", sem1: 500, sem2: 500, total: 1000, isMandatory: true },
      ],
      totalSem1: 32500,
      totalSem2: 28500,
      grandTotal: 61000,
    },
    4: {
      id: "fs-bed-y4",
      programmeCode: "EDS",
      programmeName: "Bachelor of Education (Arts)",
      faculty: "School of Education & Social Sciences",
      year: 4,
      academicYear: "2026/2027",
      items: [
        { id: "fi-1", category: "Tuition", item: "Tuition Fees", sem1: 22000, sem2: 22000, total: 44000, isMandatory: true },
        { id: "fi-2", category: "Statutory", item: "Registration Fee", sem1: 1000, sem2: 0, total: 1000, isMandatory: true },
        { id: "fi-3", category: "Statutory", item: "Examination Fee", sem1: 2500, sem2: 2500, total: 5000, isMandatory: true },
        { id: "fi-4", category: "Statutory", item: "Library & ICT Fee", sem1: 1500, sem2: 1500, total: 3000, isMandatory: true },
        { id: "fi-5", category: "Statutory", item: "Medical Services & Insurance", sem1: 1000, sem2: 1000, total: 2000, isMandatory: true },
        { id: "fi-6", category: "Statutory", item: "Graduation & Alumni Fee", sem1: 0, sem2: 5500, total: 5500, isMandatory: true },
        { id: "fi-7", category: "Statutory", item: "GUSA Student Union Dues", sem1: 500, sem2: 500, total: 1000, isMandatory: true },
      ],
      totalSem1: 28500,
      totalSem2: 32500,
      grandTotal: 61000,
    },
  },
  "bsc-cs": {
    1: {
      id: "fs-cs-y1",
      programmeCode: "SCS",
      programmeName: "BSc. Computer Science",
      faculty: "School of Pure and Applied Sciences",
      year: 1,
      academicYear: "2026/2027",
      items: [
        { id: "fi-1", category: "Tuition", item: "Tuition Fees", sem1: 25000, sem2: 25000, total: 50000, isMandatory: true },
        { id: "fi-2", category: "Statutory", item: "Registration Fee", sem1: 1000, sem2: 0, total: 1000, isMandatory: true },
        { id: "fi-3", category: "Statutory", item: "Examination Fee", sem1: 2500, sem2: 2500, total: 5000, isMandatory: true },
        { id: "fi-4", category: "Statutory", item: "Computer Lab & Software Fee", sem1: 3500, sem2: 3500, total: 7000, isMandatory: true },
        { id: "fi-5", category: "Statutory", item: "Medical Services & Insurance", sem1: 1000, sem2: 1000, total: 2000, isMandatory: true },
        { id: "fi-6", category: "Statutory", item: "Student Activity Fee", sem1: 1000, sem2: 1000, total: 2000, isMandatory: true },
        { id: "fi-7", category: "One-Time", item: "Caution Money (Refundable)", sem1: 2000, sem2: 0, total: 2000, isMandatory: true },
        { id: "fi-8", category: "One-Time", item: "Student Identity Card", sem1: 500, sem2: 0, total: 500, isMandatory: true },
      ],
      totalSem1: 36500,
      totalSem2: 33000,
      grandTotal: 69500,
    },
    2: {
      id: "fs-cs-y2",
      programmeCode: "SCS",
      programmeName: "BSc. Computer Science",
      faculty: "School of Pure and Applied Sciences",
      year: 2,
      academicYear: "2026/2027",
      items: [
        { id: "fi-1", category: "Tuition", item: "Tuition Fees", sem1: 25000, sem2: 25000, total: 50000, isMandatory: true },
        { id: "fi-2", category: "Statutory", item: "Registration Fee", sem1: 1000, sem2: 0, total: 1000, isMandatory: true },
        { id: "fi-3", category: "Statutory", item: "Examination Fee", sem1: 2500, sem2: 2500, total: 5000, isMandatory: true },
        { id: "fi-4", category: "Statutory", item: "Computer Lab & Software Fee", sem1: 3500, sem2: 3500, total: 7000, isMandatory: true },
        { id: "fi-5", category: "Statutory", item: "Medical Services & Insurance", sem1: 1000, sem2: 1000, total: 2000, isMandatory: true },
        { id: "fi-6", category: "Statutory", item: "Student Activity Fee", sem1: 1000, sem2: 1000, total: 2000, isMandatory: true },
      ],
      totalSem1: 34000,
      totalSem2: 33000,
      grandTotal: 67000,
    },
    3: {
      id: "fs-cs-y3",
      programmeCode: "SCS",
      programmeName: "BSc. Computer Science",
      faculty: "School of Pure and Applied Sciences",
      year: 3,
      academicYear: "2026/2027",
      items: [
        { id: "fi-1", category: "Tuition", item: "Tuition Fees", sem1: 27000, sem2: 27000, total: 54000, isMandatory: true },
        { id: "fi-2", category: "Statutory", item: "Registration Fee", sem1: 1000, sem2: 0, total: 1000, isMandatory: true },
        { id: "fi-3", category: "Statutory", item: "Examination Fee", sem1: 2500, sem2: 2500, total: 5000, isMandatory: true },
        { id: "fi-4", category: "Statutory", item: "Computer Lab & Software Fee", sem1: 3500, sem2: 3500, total: 7000, isMandatory: true },
        { id: "fi-5", category: "Statutory", item: "Industrial Attachment Supervision", sem1: 5000, sem2: 0, total: 5000, isMandatory: true },
      ],
      totalSem1: 39000,
      totalSem2: 33000,
      grandTotal: 72000,
    },
    4: {
      id: "fs-cs-y4",
      programmeCode: "SCS",
      programmeName: "BSc. Computer Science",
      faculty: "School of Pure and Applied Sciences",
      year: 4,
      academicYear: "2026/2027",
      items: [
        { id: "fi-1", category: "Tuition", item: "Tuition Fees", sem1: 27000, sem2: 27000, total: 54000, isMandatory: true },
        { id: "fi-2", category: "Statutory", item: "Registration Fee", sem1: 1000, sem2: 0, total: 1000, isMandatory: true },
        { id: "fi-3", category: "Statutory", item: "Examination Fee", sem1: 2500, sem2: 2500, total: 5000, isMandatory: true },
        { id: "fi-4", category: "Statutory", item: "Computer Lab & Software Fee", sem1: 3500, sem2: 3500, total: 7000, isMandatory: true },
        { id: "fi-5", category: "Statutory", item: "Graduation & Alumni Fee", sem1: 0, sem2: 5500, total: 5500, isMandatory: true },
      ],
      totalSem1: 34000,
      totalSem2: 38000,
      grandTotal: 72000,
    },
  },
}

export const PROGRAMME_OPTIONS = [
  { id: "bed-arts", label: "Bachelor of Education (Arts)", code: "EDS" },
  { id: "bsc-cs", label: "BSc. Computer Science", code: "SCS" },
]
