# Garissa University Student Self-Service Portal

A modern, high-performance, and accessible web portal for students at **Garissa University** (*Oasis of Innovation*), built in accordance with institutional engineering guidelines and design principles.

---

## 🚀 Quick Start

### Installation & Development Server
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Production Build & Validation
```bash
# Type-check and production build
npm run build

# Run linter
npm run lint
```

---

## 🔑 Demo Access Credentials

| Field | Recommended Value | Note |
|---|---|---|
| **Student Number** | `BSC/G0001/23` or `GAU/2023/1042` | Any valid ID format accepted |
| **Password** | `password123` | Validates authentication |

---

## 📁 Architecture & Mock/API Layer

- **Typed Mock Data**: Located in [`src/mocks/`](./src/mocks/) with comprehensive datasets for students, fees, timetable, attachments, elections, hostel, clearance, and evaluations.
- **Async API Services**: Located in [`src/api/`](./src/api/) with simulated asynchronous latency, allowing clean swap to real endpoints with zero changes to UI components.
- **Design Tokens**: Standardized in [`src/index.css`](./src/index.css) and [`src/config/branding.ts`](./src/config/branding.ts).
