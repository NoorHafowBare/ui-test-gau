import {
  MOCK_CLEARANCE_DEPARTMENTS_INCOMPLETE,
  MOCK_CLEARANCE_DEPARTMENTS_COMPLETE,
  type ClearanceDepartment,
} from "@/mocks/clearance"

const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms))

let isFullClearanceDemo = false

export async function getClearanceStatus(): Promise<{
  departments: ClearanceDepartment[]
  clearedCount: number
  totalCount: number
  percentage: number
  isFullyCleared: boolean
}> {
  await simulateDelay(250)
  const departments = isFullClearanceDemo
    ? MOCK_CLEARANCE_DEPARTMENTS_COMPLETE
    : MOCK_CLEARANCE_DEPARTMENTS_INCOMPLETE

  const clearedCount = departments.filter((d) => d.status === "cleared").length
  const totalCount = departments.length
  const percentage = Math.round((clearedCount / totalCount) * 100)

  return {
    departments,
    clearedCount,
    totalCount,
    percentage,
    isFullyCleared: clearedCount === totalCount,
  }
}

export function toggleClearanceDemoMode(): boolean {
  isFullClearanceDemo = !isFullClearanceDemo
  return isFullClearanceDemo
}

export function getClearanceDemoMode(): boolean {
  return isFullClearanceDemo
}
