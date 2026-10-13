import {
  MOCK_LECTURER_EVALUATIONS,
  MOCK_SERVICE_EVALUATIONS,
  type LecturerEvaluationItem,
  type ServiceEvaluationItem,
} from "@/mocks/evaluations"

const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms))

let lecturerStore = [...MOCK_LECTURER_EVALUATIONS]
let serviceStore = [...MOCK_SERVICE_EVALUATIONS]

export async function getLecturerEvaluations(): Promise<LecturerEvaluationItem[]> {
  await simulateDelay(250)
  return [...lecturerStore]
}

export async function submitLecturerEvaluation(
  id: string,
  ratings: Record<string, number>,
  feedback: string
): Promise<LecturerEvaluationItem> {
  await simulateDelay(500)
  const values = Object.values(ratings)
  const averageRating =
    values.length > 0
      ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1))
      : 5.0

  lecturerStore = lecturerStore.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status: "completed",
        completedDate: new Date().toISOString().split("T")[0],
        averageRating,
        feedback,
      }
    }
    return item
  })

  const updated = lecturerStore.find((i) => i.id === id)
  if (!updated) throw new Error("Evaluation record not found")
  return updated
}

export async function getServiceEvaluations(): Promise<ServiceEvaluationItem[]> {
  await simulateDelay(250)
  return [...serviceStore]
}

export async function submitServiceEvaluation(
  id: string,
  ratings: Record<string, number>,
  feedback: string
): Promise<ServiceEvaluationItem> {
  await simulateDelay(500)
  const values = Object.values(ratings)
  const averageRating =
    values.length > 0
      ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1))
      : 5.0

  serviceStore = serviceStore.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status: "completed",
        completedDate: new Date().toISOString().split("T")[0],
        averageRating,
        feedback,
      }
    }
    return item
  })

  const updated = serviceStore.find((i) => i.id === id)
  if (!updated) throw new Error("Service evaluation record not found")
  return updated
}
