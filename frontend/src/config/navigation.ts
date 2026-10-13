import {
  LayoutDashboard,
  CreditCard,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  CheckCheck,
  FileText,
  Settings,
  Star,
  Bed,
  Vote,
  type LucideIcon,
} from "lucide-react"

export interface NavSubItem {
  title: string
  path: string
  badge?: string
}

export interface NavItem {
  title: string
  icon: LucideIcon
  path?: string
  children?: NavSubItem[]
  group: "MAIN NAVIGATION" | "PERIODIC ACTIVITIES"
}

export const NAVIGATION_CONFIG: NavItem[] = [
  // MAIN NAVIGATION
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/app/dashboard",
    group: "MAIN NAVIGATION",
  },
  {
    title: "Financials",
    icon: CreditCard,
    group: "MAIN NAVIGATION",
    children: [
      { title: "Fee Payment", path: "/app/financials/fee-payment" },
      { title: "Fees Statement (PDF)", path: "/app/financials/statement" },
      { title: "Receipts", path: "/app/financials/receipts" },
      { title: "NFM Fee Structure", path: "/app/financials/fee-structure" },
    ],
  },
  {
    title: "Academics",
    icon: GraduationCap,
    group: "MAIN NAVIGATION",
    children: [
      { title: "Register Units", path: "/app/academics/register-units" },
      { title: "My Timetable", path: "/app/academics/timetable" },
      { title: "Provisional Transcript", path: "/app/academics/transcript" },
      { title: "Exam Cards", path: "/app/academics/exam-cards" },
    ],
  },
  {
    title: "Industrial Attachment",
    icon: Briefcase,
    group: "MAIN NAVIGATION",
    children: [
      { title: "My Attachments", path: "/app/attachment/my-attachments" },
    ],
  },
  {
    title: "Special & Supp Exams",
    icon: AlertTriangle,
    group: "MAIN NAVIGATION",
    children: [
      { title: "Supplementary Booking", path: "/app/special-exams/supp-booking" },
      { title: "Supplementary Exam Card", path: "/app/special-exams/supp-card" },
      { title: "Special Exam Application", path: "/app/special-exams/special-application" },
      { title: "Special Exam Card", path: "/app/special-exams/special-card" },
    ],
  },
  {
    title: "Clearance",
    icon: CheckCheck,
    group: "MAIN NAVIGATION",
    children: [
      { title: "My Clearance", path: "/app/clearance/my-clearance" },
    ],
  },
  {
    title: "Student Requests",
    icon: FileText,
    group: "MAIN NAVIGATION",
    children: [
      { title: "My Requests", path: "/app/requests/my-requests" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    group: "MAIN NAVIGATION",
    children: [
      { title: "Change Password", path: "/app/settings/change-password" },
    ],
  },

  // PERIODIC ACTIVITIES
  {
    title: "Evaluations",
    icon: Star,
    group: "PERIODIC ACTIVITIES",
    children: [
      { title: "Lecturer Evaluation", path: "/app/evaluations/lecturer" },
      { title: "Other Evaluation", path: "/app/evaluations/other" },
    ],
  },
  {
    title: "Hostel Booking",
    icon: Bed,
    path: "/app/hostel-booking",
    group: "PERIODIC ACTIVITIES",
  },
  {
    title: "Student Elections",
    icon: Vote,
    path: "/app/student-elections",
    group: "PERIODIC ACTIVITIES",
  },
]
