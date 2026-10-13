import {
  MOCK_STUDENT_REQUESTS,
  type StudentRequestRecord,
} from "@/mocks/requests"

const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms))

let requestsStore = [...MOCK_STUDENT_REQUESTS]

export async function getStudentRequests(): Promise<StudentRequestRecord[]> {
  await simulateDelay(300)
  return [...requestsStore]
}

export async function createStudentRequest(
  data: Pick<StudentRequestRecord, "type" | "subject" | "details">
): Promise<StudentRequestRecord> {
  await simulateDelay(500)
  const newReq: StudentRequestRecord = {
    ...data,
    id: `req-${Date.now().toString(36)}`,
    referenceNumber: `REQ-2027-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split("T")[0],
    status: "pending",
    responseRemarks: "Request received. Queued for registrar review.",
  }
  requestsStore = [newReq, ...requestsStore]
  return newReq
}
