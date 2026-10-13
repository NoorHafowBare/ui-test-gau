import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

import { AuthLayout } from "@/layouts/AuthLayout"
import { AppLayout } from "@/layouts/AppLayout"

import { LoginPage } from "@/pages/auth/LoginPage"
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage"
import { DesignSystemPreview } from "@/pages/DesignSystemPreview"
import { DashboardPage } from "@/pages/dashboard/DashboardPage"
import { FeePaymentPage } from "@/pages/financials/FeePaymentPage"
import { FeesStatementPage } from "@/pages/financials/FeesStatementPage"
import { FeeReceiptsPage } from "@/pages/financials/FeeReceiptsPage"
import { FeeStructurePage } from "@/pages/financials/FeeStructurePage"
import { RegisterUnitsPage } from "@/pages/academics/RegisterUnitsPage"
import { TimetablePage } from "@/pages/academics/TimetablePage"
import { TranscriptPage } from "@/pages/academics/TranscriptPage"
import { ExamCardsPage } from "@/pages/academics/ExamCardsPage"
import { MyAttachmentsPage } from "@/pages/attachment/MyAttachmentsPage"
import { SuppBookingPage } from "@/pages/special-exams/SuppBookingPage"
import { SuppCardPage } from "@/pages/special-exams/SuppCardPage"
import { SpecialApplicationPage } from "@/pages/special-exams/SpecialApplicationPage"
import { SpecialCardPage } from "@/pages/special-exams/SpecialCardPage"
import { MyClearancePage } from "@/pages/clearance/MyClearancePage"
import { MyRequestsPage } from "@/pages/requests/MyRequestsPage"
import { ChangePasswordPage } from "@/pages/settings/ChangePasswordPage"
import { LecturerEvaluationPage } from "@/pages/evaluations/LecturerEvaluationPage"
import { OtherEvaluationPage } from "@/pages/evaluations/OtherEvaluationPage"
import { HostelBookingPage } from "@/pages/hostel/HostelBookingPage"
import { StudentElectionsPage } from "@/pages/elections/StudentElectionsPage"

export function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Standalone Design System Preview */}
          <Route path="/design-system-preview" element={<DesignSystemPreview />} />

          {/* Protected App Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            
            {/* Main Navigation */}
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Financials */}
            <Route path="financials/fee-payment" element={<FeePaymentPage />} />
            <Route path="financials/statement" element={<FeesStatementPage />} />
            <Route path="financials/receipts" element={<FeeReceiptsPage />} />
            <Route path="financials/fee-structure" element={<FeeStructurePage />} />

            {/* Academics */}
            <Route path="academics/register-units" element={<RegisterUnitsPage />} />
            <Route path="academics/timetable" element={<TimetablePage />} />
            <Route path="academics/transcript" element={<TranscriptPage />} />
            <Route path="academics/exam-cards" element={<ExamCardsPage />} />

            {/* Industrial Attachment */}
            <Route path="attachment/my-attachments" element={<MyAttachmentsPage />} />

            {/* Special & Supp Exams */}
            <Route path="special-exams/supp-booking" element={<SuppBookingPage />} />
            <Route path="special-exams/supp-card" element={<SuppCardPage />} />
            <Route path="special-exams/special-application" element={<SpecialApplicationPage />} />
            <Route path="special-exams/special-card" element={<SpecialCardPage />} />

            {/* Clearance */}
            <Route path="clearance/my-clearance" element={<MyClearancePage />} />

            {/* Student Requests */}
            <Route path="requests/my-requests" element={<MyRequestsPage />} />

            {/* Settings */}
            <Route path="settings/change-password" element={<ChangePasswordPage />} />

            {/* Periodic Activities: Evaluations */}
            <Route path="evaluations/lecturer" element={<LecturerEvaluationPage />} />
            <Route path="evaluations/other" element={<OtherEvaluationPage />} />

            {/* Periodic Activities: Hostel & Elections */}
            <Route path="hostel-booking" element={<HostelBookingPage />} />
            <Route path="student-elections" element={<StudentElectionsPage />} />
          </Route>

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  )
}

export default App
