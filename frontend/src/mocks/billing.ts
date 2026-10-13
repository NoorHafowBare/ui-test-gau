export interface BillingSummary {
  totalBilled: number
  totalPaid: number
  balanceDue: number
  currency: string
  academicYear: string
  semester: string
  dueDate: string
}

export const MOCK_BILLING: BillingSummary = {
  totalBilled: 30000,
  totalPaid: 0,
  balanceDue: 30000,
  currency: "KES",
  academicYear: "2026/2027",
  semester: "SEM 2",
  dueDate: "2026-11-15",
}
