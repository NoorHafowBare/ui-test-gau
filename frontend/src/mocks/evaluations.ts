export interface LecturerEvaluationItem {
  id: string
  unitCode: string
  unitTitle: string
  lecturerName: string
  academicYear: string
  semester: string
  status: "pending" | "completed"
  completedDate?: string
  averageRating?: number
  feedback?: string
}

export interface ServiceEvaluationItem {
  id: string
  serviceName: string
  category: "Academic Support" | "Campus Life" | "Infrastructure" | "Health & Wellness"
  location: string
  status: "pending" | "completed"
  completedDate?: string
  averageRating?: number
  feedback?: string
}

export interface EvaluationQuestion {
  id: string
  title: string
  description: string
}

export const LECTURER_EVALUATION_QUESTIONS: EvaluationQuestion[] = [
  {
    id: "q1",
    title: "Punctuality & Lecture Attendance",
    description: "The instructor arrived promptly and conducted all scheduled contact hours consistently.",
  },
  {
    id: "q2",
    title: "Course Syllabus & Learning Objectives",
    description: "Course outline, core curriculum objectives, and grading schemes were explained clearly.",
  },
  {
    id: "q3",
    title: "Mastery of Subject & Teaching Clarity",
    description: "The instructor explained complex theoretical concepts with effective clarity and real-world examples.",
  },
  {
    id: "q4",
    title: "Fairness of CATs & Practical Assessment",
    description: "Continuous assessment tests and lab assignments were fair, returned promptly, and constructively reviewed.",
  },
  {
    id: "q5",
    title: "Availability for Consultations",
    description: "The instructor maintained accessible office hours and offered valuable guidance outside regular lectures.",
  },
]

export const SERVICE_EVALUATION_QUESTIONS: EvaluationQuestion[] = [
  {
    id: "sq1",
    title: "Resource Availability & Accessibility",
    description: "Adequate materials, digital resources, and equipment were available to meet student demands.",
  },
  {
    id: "sq2",
    title: "Staff Courtesy & Professionalism",
    description: "Staff members in this department were approachable, respectful, and addressed issues promptly.",
  },
  {
    id: "sq3",
    title: "Facility Cleanliness & Maintenance",
    description: "Physical facilities, computers, or amenities were clean, operational, and safe to use.",
  },
  {
    id: "sq4",
    title: "Service Reliability & Turnaround Time",
    description: "Requests, inquiries, or service operations were delivered within acceptable timeframes.",
  },
  {
    id: "sq5",
    title: "Overall Service Satisfaction",
    description: "Overall standard of service contributed positively to your campus learning environment.",
  },
]

export const MOCK_LECTURER_EVALUATIONS: LecturerEvaluationItem[] = [
  {
    id: "le-1",
    unitCode: "STA 421",
    unitTitle: "Applied Multivariate Statistical Methods",
    lecturerName: "Dr. Abdi Mohamed",
    academicYear: "2026/2027",
    semester: "Semester 2",
    status: "pending",
  },
  {
    id: "le-2",
    unitCode: "STA 422",
    unitTitle: "Time Series Analysis & Forecasting",
    lecturerName: "Prof. Kenneth Ochieng",
    academicYear: "2026/2027",
    semester: "Semester 2",
    status: "pending",
  },
  {
    id: "le-3",
    unitCode: "STA 423",
    unitTitle: "Stochastic Processes & Actuarial Models",
    lecturerName: "Dr. Amina Yusuf",
    academicYear: "2026/2027",
    semester: "Semester 2",
    status: "completed",
    completedDate: "2027-03-24",
    averageRating: 4.8,
    feedback: "Exceptional mastery of stochastic models and very helpful in tutorial sessions.",
  },
  {
    id: "le-4",
    unitCode: "COM 424",
    unitTitle: "Machine Learning & Statistical Data Mining",
    lecturerName: "Dr. Farah Hassan",
    academicYear: "2026/2027",
    semester: "Semester 2",
    status: "pending",
  },
  {
    id: "le-5",
    unitCode: "COM 425",
    unitTitle: "Cloud Computing & Distributed Systems",
    lecturerName: "Mr. David Mutua",
    academicYear: "2026/2027",
    semester: "Semester 2",
    status: "completed",
    completedDate: "2027-03-22",
    averageRating: 4.6,
    feedback: "Hands-on cloud architecture labs were well-structured and engaging.",
  },
]

export const MOCK_SERVICE_EVALUATIONS: ServiceEvaluationItem[] = [
  {
    id: "se-1",
    serviceName: "University Central Library & E-Learning Portal",
    category: "Academic Support",
    location: "Main Campus Library Building",
    status: "pending",
  },
  {
    id: "se-2",
    serviceName: "Campus ICT Laboratories & WiFi Network",
    category: "Infrastructure",
    location: "ICT Complex Labs 1-4",
    status: "pending",
  },
  {
    id: "se-3",
    serviceName: "Student Health Services & Campus Clinic",
    category: "Health & Wellness",
    location: "University Health Centre",
    status: "completed",
    completedDate: "2027-03-18",
    averageRating: 4.4,
    feedback: "Doctor consultations were prompt and medications readily available.",
  },
  {
    id: "se-4",
    serviceName: "University Cafeteria & Student Mess",
    category: "Campus Life",
    location: "Central Student Center",
    status: "pending",
  },
  {
    id: "se-5",
    serviceName: "Campus Security & Night Perimeter Lighting",
    category: "Infrastructure",
    location: "University Security Directorate",
    status: "completed",
    completedDate: "2027-03-15",
    averageRating: 4.7,
    feedback: "Security personnel are visible and perimeter lighting has greatly improved.",
  },
]
