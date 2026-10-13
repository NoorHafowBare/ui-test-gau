export interface AttachmentRecord {
  id: string
  period: string
  organization: string
  supervisor: string
  role: string
  location: string
  startDate: string
  endDate: string
  status: "approved" | "pending" | "completed"
  notes?: string
}

export const MOCK_ATTACHMENTS: AttachmentRecord[] = [
  {
    id: "att-001",
    period: "May 2026 - Aug 2026",
    organization: "Safaricom PLC",
    supervisor: "Eng. Samuel Mwangi",
    role: "Data Analytics & Machine Learning Intern",
    location: "Safaricom HQ, Westlands, Nairobi",
    startDate: "2026-05-04",
    endDate: "2026-08-28",
    status: "completed",
    notes: "Attached to Enterprise Data Operations. Submitted final field assessment logbook (Grade: A).",
  },
  {
    id: "att-002",
    period: "May 2025 - Aug 2025",
    organization: "Kenya Revenue Authority (KRA)",
    supervisor: "Ms. Beatrice Nduta",
    role: "Statistical Risk Modeling Intern",
    location: "Times Tower, Haile Selassie Ave, Nairobi",
    startDate: "2025-05-05",
    endDate: "2025-08-15",
    status: "approved",
    notes: "Approved by School of Pure and Applied Sciences industrial placement coordinator.",
  },
  {
    id: "att-003",
    period: "Jan 2025 - Apr 2025",
    organization: "Garissa County Government",
    supervisor: "Mr. Hassan Ali",
    role: "County ICT & Data Records Assistant",
    location: "Garissa County Executive Offices, Garissa",
    startDate: "2025-01-06",
    endDate: "2025-04-18",
    status: "approved",
    notes: "Local administrative attachment. Evaluation verified by county director of statistics.",
  },
]
