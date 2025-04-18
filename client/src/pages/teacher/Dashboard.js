"use client"

import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import TeacherCourses from "./TeacherCourses"
import AttendanceManagement from "./AttendanceManagement"
import { useAuth } from "../../context/AuthContext"
import axios from "axios"

const TeacherDashboard = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/courses")
        const teacherCourses = response.data.filter((course) => course.createdBy?._id === user.id)
        setCourses(teacherCourses)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeacherCourses()
  }, [user.id])

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1 className="mb-4">Teacher Dashboard</h1>
                  <div className="card mb-4">
                    <div className="card-body">
                      <h2 className="card-title">Welcome, {user.name}!</h2>
                      <p className="card-text">You have {courses.length} course(s) assigned to you.</p>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                      <div className="card bg-primary text-white h-100">
                        <div className="card-body text-center">
                          <h3>My Courses</h3>
                          <h2 className="display-4">{courses.length}</h2>
                        </div>
                        <div className="card-footer bg-primary border-0 text-center">
                          <button className="btn btn-light" onClick={() => (window.location.href = "/teacher/courses")}>
                            Manage Courses
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card bg-success text-white h-100">
                        <div className="card-body text-center">
                          <h3>Attendance</h3>
                          <i className="bi bi-calendar-check display-4"></i>
                        </div>
                        <div className="card-footer bg-success border-0 text-center">
                          <button
                            className="btn btn-light"
                            onClick={() => (window.location.href = "/teacher/attendance")}
                          >
                            Take Attendance
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/courses" element={<TeacherCourses />} />
            <Route path="/attendance" element={<AttendanceManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
