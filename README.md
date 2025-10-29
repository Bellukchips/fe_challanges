# Hiring Management Platform

A modern, full-featured hiring management web application built with Next.js 16, featuring dynamic form validation, role-based access control, and an intuitive user interface for both recruiters and job seekers.

## 📋 Table of Contents

-   [Demo Credentials](https://claude.ai/chat/b7c70b77-3375-4a29-8483-67b384d5173e#demo-credentials)
-   [Tech Stack](https://claude.ai/chat/b7c70b77-3375-4a29-8483-67b384d5173e#tech-stack)
-   [Key Features](https://claude.ai/chat/b7c70b77-3375-4a29-8483-67b384d5173e#key-features)
-   [Getting Started](https://claude.ai/chat/b7c70b77-3375-4a29-8483-67b384d5173e#getting-started)
-   [Features Implementation](https://claude.ai/chat/b7c70b77-3375-4a29-8483-67b384d5173e#features-implementation)

## 🔑 Demo Credentials

### Admin (Recruiter)

-   **Email:** `admin@mail.com`
-   **Password:** `admin123`
-   **Access:** Job management, candidate management, full CRUD operations

### Applicant (Job Seeker)

-   **Email: [john@mail.com](mailto:john@mail.com)**
-   **Password:** john123
-   **Access:** Browse jobs, submit applications

## 🛠 Tech Stack

### Core Framework

-   **Next.js 16** - React framework with App Router
-   **React 19** - UI library
-   **TypeScript** - Type safety and better DX

### UI & Styling

-   **shadcn/ui** - High-quality, accessible component library
-   **Tailwind CSS** - Utility-first CSS framework
-   **Radix UI** - Unstyled, accessible components
-   **Lucide Icons** - Beautiful icon set

### State Management

-   **Zustand** - Lightweight state management (1KB)
-   **Zustand Middleware:**
    -   `persist` - LocalStorage persistence
    -   `devtools` - Redux DevTools integration

### Form & Validation

-   **React Hook Form** - Performant form library
-   **Zod v4** - TypeScript-first schema validation
-   **@hookform/resolvers** - Zod integration with RHF

### Data Layer

-   **Mock JSON API** - Simulated backend with localStorage
-   **LocalStorage** - Client-side data persistence

### Additional Libraries

-   **MediaPipe** *(planned)* - Alternative for gesture recognition

## ✨ Key Features

### For Admins (Recruiters)

#### 1. **Job Management**

-   ✅ Create new job postings
-   ✅ Filter by status (Active/Inactive/Draft)
-   ✅ Search by title
-   ✅ Real-time validation with Zod

#### 2. **Dynamic Form Configuration**

-   ✅ Configure application form fields per job
-   ✅ Three states per field:
    -   **Mandatory** - Required field
    -   **Optional** - Can be skipped
    -   **Off** - Hidden from form
-   ✅ Live preview of form changes

#### 3. **Candidate Management**

-   ✅ View all applicants per job
-   ✅ Resizable table columns (drag to adjust width)
-   ✅ Reorderable columns (drag and drop)
-   ✅ Sort by any column

### For Applicants (Job Seekers)

#### 1. **Job Discovery**

-   ✅ Browse all active job postings
-   ✅ View detailed job descriptions
-   ✅ See salary ranges and requirements

#### 2. **Dynamic Application Form**

-   ✅ Form adapts based on job configuration
-   ✅ Only shows relevant fields
-   ✅ Real-time validation
-   ✅ Error highlighting
-   ✅ Success/failure feedback

#### 3. **Webcam Photo Capture with Gesture** *(in progress)*

-   Hand gesture recognition (👆 ✌️ 🤟) (NOT PERFECT BUT OK)
-   Automatic photo capture on gesture detection
-   Preview before submission
-   Retake functionality

### Shared Features

#### 1. **Authentication & Authorization**

-   ✅ Mock authentication system
-   ✅ Role-based access control (RBAC)
-   ✅ Protected routes
-   ✅ Session persistence
-   ✅ Auto-redirect based on role

#### 2. **UI/UX Excellence**

-   ✅ Responsive design (mobile, tablet, desktop)
-   ✅ Loading states
-   ✅ Error boundaries
-   ✅ Toast notifications
-   ✅ Smooth transitions
-   ✅ Accessible components (ARIA labels)

## 🚀 Getting Started

### Prerequisites

-   **Node.js** 18.x or higher
-   **npm** or **yarn** or **pnpm**

### Installation

1.  **Clone the repository**
    
    ```bash
    git clone https://github.com/yourusername/hiring-platform.gitcd hiring-platform
    ```
    
2.  **Install dependencies**
    
    ```bash
    npm install# oryarn install# orpnpm install
    ```
    
3.  **Create mock data directory**
    
    ```bash
    mkdir -p public/data
    ```
    
4.  **Run development server**
    
    ```bash
    npm run dev # or yarn dev # or pnpm dev
    ```
    
5.  **Open browser**
    
    Navigate to [http://localhost:3000](http://localhost:3000/)
    

## 👤 Author

**Your Name**

-   Email: [lukmancode200@gmail.com](mailto:lukmancode200@gmail.com)
-   GitHub: [@Bellukchips](https://github.com/Bellukchips)

## 🙏 Acknowledgments

-   [Next.js](https://nextjs.org/) - React Framework
-   [shadcn/ui](https://ui.shadcn.com/) - Component Library
-   [Zustand](https://github.com/pmndrs/zustand) - State Management
-   [Tailwind CSS](https://tailwindcss.com/) - Styling
-   [Radix UI](https://www.radix-ui.com/) - Primitives

---

**Note:** This project is a demonstration of frontend development skills and architectural thinking. For production use, implement proper backend, authentication, and security measures.
