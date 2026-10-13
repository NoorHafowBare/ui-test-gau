import { MOCK_STUDENT, type StudentProfile } from "@/mocks/user"

const AUTH_STORAGE_KEY = "gau_portal_auth_state"

const simulateDelay = (ms: number = 80) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function getCurrentUser(): Promise<StudentProfile | null> {
  await simulateDelay(60)
  const isLoggedOut = localStorage.getItem(AUTH_STORAGE_KEY) === "logged_out"
  if (isLoggedOut) {
    return null
  }
  return MOCK_STUDENT
}

export async function login(admissionNo?: string, password?: string): Promise<StudentProfile> {
  await simulateDelay(250)
  if (password !== "password123") {
    throw new Error("Invalid student credentials. Please verify your student number and password.")
  }
  localStorage.removeItem(AUTH_STORAGE_KEY)
  if (admissionNo) {
    return {
      ...MOCK_STUDENT,
      admissionNo: admissionNo.trim().toUpperCase(),
    }
  }
  return MOCK_STUDENT
}

export async function logout(): Promise<void> {
  await simulateDelay(80)
  localStorage.setItem(AUTH_STORAGE_KEY, "logged_out")
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) !== "logged_out"
}
