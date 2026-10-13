export interface StudentProfile {
  id: string
  admissionNo: string
  fullName: string
  email: string
  avatarUrl: string
  programme: string
  stage: string
  status: "Online" | "Offline"
  phone?: string
  postalAddress?: string
  nationalId: string
  gender: "Male" | "Female"
  dob: string
  universityEmail?: string
  universityEmailPassword?: string
}

export const MOCK_STUDENT: StudentProfile = {
  id: "std-001",
  admissionNo: "BSC/G0001/23",
  fullName: "ESIPILA GABRIEL",
  email: "collinsmainabosire@gmail.com",
  avatarUrl: "",
  programme: "BACHELOR OF SCIENCE (APPLIED STATISTIC WITH COMPUTING)",
  stage: "Y4S2",
  status: "Online",
  phone: "", // Empty to demonstrate muted dash
  postalAddress: "688 Garissa",
  nationalId: "34567890",
  gender: "Female",
  dob: "01/01/01",
  universityEmail: "e.gabriel@student.gau.ac.ke",
  universityEmailPassword: "gauStudent#2026",
}
