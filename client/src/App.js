
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"


import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import UsersPage from "./pages/admin/UsersPage"
import ClassroomsPage from "./pages/admin/ClassroomsPage"
import CoursesPage from "./pages/courses/CoursesPage"
import TeacherClassesPage from "./pages/teacher/TeacherClassesPage"
import StudentDashboardPage from "./pages/student/StudentDashboardPage"
import ParentDashboardPage from "./pages/parent/ParentDashboardPage"
import NotFoundPage from "./pages/NotFoundPage"


const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <Routes>

      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>


      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />

        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="classrooms"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher"]}>
              <ClassroomsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="teacher/classes"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherClassesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="courses"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <CoursesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="parent/dashboard"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentDashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
