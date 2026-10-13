import {
  MOCK_ACADEMIC_STUDENT,
  MOCK_AVAILABLE_UNITS,
  MOCK_REGISTERED_UNITS,
  MOCK_TIMETABLE_CLASSES,
  MOCK_TRANSCRIPTS,
  MOCK_EXAM_CARDS,
  EXAM_SEMESTER_OPTIONS,
  REGISTRATION_OPEN,
  INITIAL_REGISTERED_EMPTY,
  type AcademicStudentSummary,
  type AvailableCourseUnit,
  type RegisteredCourseUnit,
  type TimetableClass,
  type SemesterTranscript,
  type ExamCardData,
} from "@/mocks/academics"

const simulateDelay = (ms: number = 350) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function getAcademicStudentSummary(): Promise<AcademicStudentSummary> {
  await simulateDelay(250)
  return MOCK_ACADEMIC_STUDENT
}

export async function getUnitRegistrationStatus(): Promise<{
  isOpen: boolean
  deadline: string
}> {
  await simulateDelay(200)
  return {
    isOpen: REGISTRATION_OPEN,
    deadline: "Friday, 16th January 2027 at 11:59 PM",
  }
}

export async function getAvailableUnits(): Promise<AvailableCourseUnit[]> {
  await simulateDelay(350)
  return MOCK_AVAILABLE_UNITS
}

export async function getRegisteredUnits(): Promise<RegisteredCourseUnit[]> {
  await simulateDelay(350)
  if (INITIAL_REGISTERED_EMPTY) {
    return []
  }
  return MOCK_REGISTERED_UNITS
}

export async function registerSelectedUnits(
  unitIds: string[]
): Promise<RegisteredCourseUnit[]> {
  await simulateDelay(600)
  const newlyRegistered: RegisteredCourseUnit[] = MOCK_AVAILABLE_UNITS.filter(
    (u) => unitIds.includes(u.id)
  ).map((u) => ({
    id: `reg-${u.id}`,
    code: u.code,
    title: u.title,
    creditHours: u.creditHours,
    type: u.type,
    registeredDate: new Date().toISOString().split("T")[0],
    status: "approved",
    lecturer: u.lecturer,
  }))

  return [...newlyRegistered, ...MOCK_REGISTERED_UNITS]
}

export async function getTimetableClasses(): Promise<TimetableClass[]> {
  await simulateDelay(350)
  return MOCK_TIMETABLE_CLASSES
}

export async function getTranscripts(
  yearFilter?: string
): Promise<SemesterTranscript[]> {
  await simulateDelay(400)
  if (!yearFilter || yearFilter === "all") {
    return MOCK_TRANSCRIPTS
  }
  return MOCK_TRANSCRIPTS.filter((t) => t.academicYear === yearFilter)
}

export async function getExamCard(
  semesterId: string = "2026-sem2"
): Promise<ExamCardData | null> {
  await simulateDelay(350)
  return MOCK_EXAM_CARDS[semesterId] || null
}

export async function getExamSemesterOptions() {
  await simulateDelay(150)
  return EXAM_SEMESTER_OPTIONS
}
