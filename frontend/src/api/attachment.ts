import { MOCK_ATTACHMENTS, type AttachmentRecord } from "@/mocks/attachment"

const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms))

let attachmentsStore = [...MOCK_ATTACHMENTS]

export async function getAttachments(): Promise<AttachmentRecord[]> {
  await simulateDelay(300)
  return [...attachmentsStore]
}

export async function createAttachment(
  data: Omit<AttachmentRecord, "id" | "status">
): Promise<AttachmentRecord> {
  await simulateDelay(500)
  const newRecord: AttachmentRecord = {
    ...data,
    id: `att-${Date.now().toString(36)}`,
    status: "pending",
  }
  attachmentsStore = [newRecord, ...attachmentsStore]
  return newRecord
}
