import {
  MOCK_PAYMENT_INFO,
  MOCK_FEE_STATEMENTS,
  MOCK_FEE_RECEIPTS,
  MOCK_FEE_STRUCTURES,
  PROGRAMME_OPTIONS,
  FORCE_EMPTY_RECEIPTS,
  type FeePaymentInfo,
  type FeeStatementItem,
  type FeeReceiptItem,
  type FeeStructureProgramme,
} from "@/mocks/financials"

const simulateDelay = (ms: number = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function getFeePaymentInfo(): Promise<FeePaymentInfo> {
  await simulateDelay(350)
  return MOCK_PAYMENT_INFO
}

export async function getFeeStatements(): Promise<FeeStatementItem[]> {
  await simulateDelay(400)
  return MOCK_FEE_STATEMENTS
}

export async function getFeeReceipts(): Promise<FeeReceiptItem[]> {
  await simulateDelay(400)
  if (FORCE_EMPTY_RECEIPTS) {
    return []
  }
  return MOCK_FEE_RECEIPTS
}

export async function getFeeStructure(
  programmeId: string = "bed-arts",
  year: number = 1
): Promise<FeeStructureProgramme> {
  await simulateDelay(350)
  const progMap = MOCK_FEE_STRUCTURES[programmeId] || MOCK_FEE_STRUCTURES["bed-arts"]
  const yearData = progMap[year] || progMap[1]
  return yearData
}

export async function getProgrammeOptions() {
  await simulateDelay(150)
  return PROGRAMME_OPTIONS
}

export interface PaymentSubmission {
  amount: number
  accountNumber?: string
  paymentMethod?: string
}

export interface PaymentResult {
  success: boolean
  receiptNumber: string
  transactionRef: string
  amount: number
  timestamp: string
  message: string
}

export async function submitFeePayment(
  data: PaymentSubmission
): Promise<PaymentResult> {
  await simulateDelay(800)

  if (data.amount < 51) {
    throw new Error("Minimum payment amount is KES 51")
  }

  if (data.amount > MOCK_PAYMENT_INFO.outstandingBalance) {
    throw new Error(
      `Amount cannot exceed outstanding balance of KES ${MOCK_PAYMENT_INFO.outstandingBalance.toLocaleString()}`
    )
  }

  const randomRef = `EC${Math.floor(10000000 + Math.random() * 90000000)}`
  const randomRec = `GAU-REC-${Math.floor(10000 + Math.random() * 90000)}`

  return {
    success: true,
    receiptNumber: randomRec,
    transactionRef: randomRef,
    amount: data.amount,
    timestamp: new Date().toISOString(),
    message: "Transaction initiated successfully. Redirecting to payment portal.",
  }
}
