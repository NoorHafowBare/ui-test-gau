# Garissa University Student Self-Service Portal

A modern, high-performance, and accessible web portal for students at **Garissa University** (*Oasis of Innovation*), built in accordance with institutional engineering guidelines and design principles.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Development Server
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Production Build & Validation
```bash
cd frontend

# Type-check and production build
npm run build

# Run linter
npm run lint
```

---

## 🔑 Demo Access Credentials

The portal incorporates simulated authentication for development and evaluation:

| Field | Recommended Value | Note |
|---|---|---|
| **Student Number** | `BSC/G0001/23` or `GAU/2023/1042` | Any valid ID format accepted |
| **Password** | `password123` | Validates authentication |

> **Note**: Entering an invalid password demonstrates the inline alert and toast notification error handling.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/) with `@tailwindcss/vite`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with theme tokens
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) primitives
- **Data Tables**: [TanStack Table v8](https://tanstack.com/table) (sortable, filterable, paginated)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) toast system
- **Icons**: [Lucide React](https://lucide.dev/) (standardized 16px/18px, strokeWidth 1.75)
- **Typography**: [Inter Variable Font](https://fontsource.org/fonts/inter) (weights 400, 500, 600 max)

---

## 📁 Architectural & Folder Structure

The project follows a modular, decoupled data architecture where presentation components never couple directly to raw mock state.

```
frontend/
├── src/
│   ├── api/                     # Async data layer simulating backend REST endpoints
│   │   ├── auth.ts              # Authentication & user session management
│   │   ├── billing.ts           # Dashboard billing metrics
│   │   ├── financials.ts        # Payment gateway, statements, receipts, fees
│   │   ├── academics.ts         # Course registration, timetable, transcript, exam cards
│   │   ├── attachments.ts       # Industrial attachments
│   │   ├── specialExams.ts      # Supplementary booking & special exam cards
│   │   ├── clearance.ts         # Departmental graduation clearance
│   │   ├── requests.ts          # Student petitions & inquiries
│   │   ├── evaluations.ts       # Faculty & institutional appraisals
│   │   ├── hostel.ts            # Hall and room booking
│   │   └── elections.ts         # GUSA electoral ballots
│   │
│   ├── mocks/                   # Strongly-typed mock datasets and demo state
│   │   ├── user.ts              # Student profile & accounts
│   │   ├── financials.ts        # Ledger statements, receipts, structures
│   │   ├── academics.ts         # Unit catalog, schedule, transcripts
│   │   ├── attachments.ts       # Attachment records
│   │   ├── specialExams.ts      # Exam cards and booking records
│   │   ├── clearance.ts         # Department checklists
│   │   ├── requests.ts          # Student tickets and inquiries
│   │   ├── evaluations.ts       # Evaluation questionnaires
│   │   ├── hostel.ts            # Hostels and rooms
│   │   └── elections.ts         # Candidate profiles & election state
│   │
│   ├── components/
│   │   ├── common/              # Reusable core components
│   │   │   ├── DataTable.tsx    # TanStack table with search, sorting, pagination & empty state
│   │   │   ├── PageHeader.tsx   # Breadcrumb, title, description, actions
│   │   │   ├── StatusBadge.tsx  # Universal semantic status badge mapping
│   │   │   ├── EmptyState.tsx   # Reusable zero-row display with icon & action
│   │   │   └── DescriptionList.tsx # Two-column key-value attribute displays
│   │   ├── layout/              # App header and deep-green sidebar
│   │   └── ui/                  # shadcn/ui primitives styled via tokens
│   │
│   ├── layouts/
│   │   ├── AppLayout.tsx        # Authenticated shell (sidebar, top header, content, footer)
│   │   └── AuthLayout.tsx       # Two-column login layout with institutional brand panel
│   │
│   ├── pages/                   # Feature module views
│   │   ├── auth/                # Login & Forgot Password
│   │   ├── dashboard/           # Flat summary cards, profile, personal details
│   │   ├── financials/          # Fee Payment, Statements, Receipts, Fee Structure
│   │   ├── academics/           # Register Units, Timetable, Transcripts, Exam Cards
│   │   ├── attachment/          # Industrial Attachment placements & dialog
│   │   ├── special-exams/       # Supplementary Booking, Special Exam Applications & Cards
│   │   ├── clearance/           # Clearance checklist with progress bar
│   │   ├── requests/            # Student petitions & ticket dialog
│   │   ├── settings/            # Change password with strength meter
│   │   ├── evaluations/         # Faculty and Service Evaluation rating dialogs
│   │   ├── hostel/              # 3-step room booking & allocation management
│   │   └── elections/           # GUSA electoral ballots and voting confirmation
│   │
│   ├── config/                  # Branding tokens, institution metadata, navigation
│   ├── index.css                # Base design system, HSL tokens, WCAG AA compliance
│   └── App.tsx                  # Client-side router configuration
```

---

## 🎨 Design System & Accessibility

1. **Color Palette & Discipline**:
   - **Primary Green** (`#4f7a16`): Reserved strictly for primary call-to-actions, active links, and brand focal points.
   - **Accent Gold** (`#e3b23c` / text `#8c6205`): Applied only as small indicators, active navigation dots, and badge highlights. Never used as large saturated fills.
   - **Background & Card Surfaces**: Neutral `#f5f6f4` background with flat `#ffffff` cards and hairline borders.
   - **Sidebar**: Institutional deep-green (`#1a2c0c`) derived from the primary token with high-contrast typography.
2. **Typography**:
   - Strictly [Inter](https://fontsource.org/fonts/inter) variable font.
   - Font weights capped at 400 (regular), 500 (medium), and 600 (semibold). Never bolder than 600.
3. **Information Density & Scaling**:
   - Screen-width adaptability optimized across 390px, 768px, 1024px, 1280px, 1440px, 1536px, and 1920px.
   - Compact table row heights (~38–40px) and descriptions ensure dashboard and tab views fit standard displays without excessive vertical scrolling.
4. **Interactive Demos**:
   - Header action toggles allow instant demonstration of alternate states (e.g., *Populated vs. Empty State*, *Registration Open vs. Closed*, *Election Active vs. Inactive*).