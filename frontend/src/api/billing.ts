import { MOCK_BILLING, type BillingSummary } from "@/mocks/billing"

const simulateDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function getBillingSummary(): Promise<BillingSummary> {
  await simulateDelay(800)
  return MOCK_BILLING
}
