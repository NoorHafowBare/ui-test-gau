import { MOCK_STUDENT, type StudentProfile } from "@/mocks/user"

const simulateDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function getStudentProfile(): Promise<StudentProfile> {
  await simulateDelay(800)
  return MOCK_STUDENT
}
