"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/admin/Dashboard"
import TeacherDashboard from "./pages/teacher/Dashboard"
import ParentDashboard from "./pages/parent/Dashboard"
import StudentDashboard from "./pages/student/Dashboard"
import NotFound from "./pages/NotFound"

import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const { user } = useAuth()

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "admin" && <AdminDashboard />}
              {user?.role === "teacher" && <TeacherDashboard />}
              {user?.role === "parent" && <ParentDashboard />}
              {user?.role === "student" && <StudentDashboard />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent/*"
          element={
            <ProtectedRoute requiredRole="parent">
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
