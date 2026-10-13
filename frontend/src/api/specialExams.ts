import {
  MOCK_SUPP_ELIGIBLE_UNITS,
  MOCK_SUPP_BOOKINGS,
  MOCK_SUPP_EXAM_CARD,
  MOCK_SPECIAL_EXAM_APPLICATIONS,
  MOCK_SPECIAL_EXAM_CARD,
  type SuppEligibleUnit,
  type SuppBookingRecord,
  type SuppExamCardData,
  type SpecialExamApplicationRecord,
  type SpecialExamCardData,
} from "@/mocks/specialExams"

const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms))

let suppBookingsStore = [...MOCK_SUPP_BOOKINGS]
let specialApplicationsStore = [...MOCK_SPECIAL_EXAM_APPLICATIONS]

export async function getSuppEligibleUnits(): Promise<SuppEligibleUnit[]> {
  await simulateDelay(250)
  return [...MOCK_SUPP_ELIGIBLE_UNITS]
}

export async function getSuppBookings(): Promise<SuppBookingRecord[]> {
  await simulateDelay(300)
  return [...suppBookingsStore]
}

export async function bookSupplementaryUnits(
  unitIds: string[]
): Promise<SuppBookingRecord> {
  await simulateDelay(500)
  const selectedUnits = MOCK_SUPP_ELIGIBLE_UNITS.filter((u) =>
    unitIds.includes(u.id)
  )
  const total = selectedUnits.reduce((sum, u) => sum + u.fee, 0)
  const newBooking: SuppBookingRecord = {
    id: `bk-${Date.now().toString(36)}`,
    bookingReference: `SUP-2027-${Math.floor(1000 + Math.random() * 9000)}`,
    units: selectedUnits,
    totalFee: total,
    bookedDate: new Date().toISOString().split("T")[0],
    paymentStatus: "paid",
    academicYear: "2026/2027",
  }
  suppBookingsStore = [newBooking, ...suppBookingsStore]
  return newBooking
}

export async function getSuppExamCard(): Promise<SuppExamCardData | null> {
  await simulateDelay(350)
  return MOCK_SUPP_EXAM_CARD
}

export async function getSpecialExamApplications(): Promise<SpecialExamApplicationRecord[]> {
  await simulateDelay(300)
  return [...specialApplicationsStore]
}

export async function createSpecialExamApplication(
  data: Omit<SpecialExamApplicationRecord, "id" | "appliedDate" | "status" | "reviewerComments">
): Promise<SpecialExamApplicationRecord> {
  await simulateDelay(500)
  const newApp: SpecialExamApplicationRecord = {
    ...data,
    id: `sea-${Date.now().toString(36)}`,
    appliedDate: new Date().toISOString().split("T")[0],
    status: "pending",
    reviewerComments: "Awaiting Dean & Medical Board verification.",
  }
  specialApplicationsStore = [newApp, ...specialApplicationsStore]
  return newApp
}

export async function getSpecialExamCard(): Promise<SpecialExamCardData | null> {
  await simulateDelay(350)
  return MOCK_SPECIAL_EXAM_CARD
}
