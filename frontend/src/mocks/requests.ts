export interface StudentRequestRecord {
  id: string
  referenceNumber: string
  date: string
  type: string
  subject: string
  details: string
  status: "approved" | "pending" | "in progress" | "rejected"
  responseRemarks?: string
}

export const REQUEST_TYPES = [
  "Bonafide Student Letter",
  "Exam Remarking Request",
  "Hostel Reallocation",
  "Academic Leave of Absence",
  "Provisional Transcript Certified Copy",
  "Correction of Bio-data / Name Order",
  "Course Unit Transfer / Exemption",
  "Dean's Recommendation Letter",
]

export const MOCK_STUDENT_REQUESTS: StudentRequestRecord[] = [
  {
    id: "req-001",
    referenceNumber: "REQ-2027-0842",
    date: "2027-03-15",
    type: "Bonafide Student Letter",
    subject: "Embassy Visa Verification Letter for Academic Conference",
    details: "Formal request for an official university letter addressed to the Embassy of Germany for visa processing for the East Africa Student Tech Summit.",
    status: "approved",
    responseRemarks: "Approved and signed by Registrar (Academic Affairs). Collect physical copy with seal at Admissions Counter 4.",
  },
  {
    id: "req-002",
    referenceNumber: "REQ-2027-0791",
    date: "2027-02-28",
    type: "Exam Remarking Request",
    subject: "STA 412 Paper Remarking Appeal",
    details: "Formal petition requesting a re-evaluation of Continuous Assessment Test (CAT 2) script for STA 412 Non-Parametric Statistics due to summation discrepancy.",
    status: "in progress",
    responseRemarks: "Assigned to School Examination Board. Internal review in progress.",
  },
  {
    id: "req-003",
    referenceNumber: "REQ-2027-0610",
    date: "2027-01-20",
    type: "Hostel Reallocation",
    subject: "Ground Floor Room Request due to Knee Recovery",
    details: "Requesting room transfer to Ground Floor Block B-02 following knee arthroscopy surgery as per attached orthopedic surgeon note.",
    status: "approved",
    responseRemarks: "Reallocated to Hall B, Room B-04. Keys available at Hall Warden desk.",
  },
  {
    id: "req-004",
    referenceNumber: "REQ-2026-0504",
    date: "2026-11-12",
    type: "Academic Leave of Absence",
    subject: "Compassionate Deferment of Study Semester",
    details: "Application for leave of absence for 1 semester due to documented family medical emergency.",
    status: "rejected",
    responseRemarks: "Petition declined because application was received after the 4th week statutory semester deadline. Contact Dean for guidance.",
  },
  {
    id: "req-005",
    referenceNumber: "REQ-2026-0422",
    date: "2026-10-05",
    type: "Provisional Transcript Certified Copy",
    subject: "Certified Transcripts for Industrial Placement Application",
    details: "Two certified physical copies of provisional transcripts required for Safaricom enterprise internship vetting.",
    status: "approved",
    responseRemarks: "Certified and stamped. Dispatched to student portal and physical copy ready.",
  },
]
