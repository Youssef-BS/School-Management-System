import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import UserManagement from "./UserManagement"
import CourseManagement from "./CourseManagement"
import axios from "axios"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersResponse, coursesResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/users"),
          axios.get("http://localhost:3000/api/courses"),
        ])

        setStats({
          totalUsers: usersResponse.data.length,
          totalCourses: coursesResponse.data.length,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

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
                  <h1 className="mb-4">Admin Dashboard</h1>
                  <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                      <div className="card bg-primary text-white">
                        <div className="card-body text-center">
                          <h3>Total Users</h3>
                          <h2 className="display-4">{stats.totalUsers}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card bg-success text-white">
                        <div className="card-body text-center">
                          <h3>Total Courses</h3>
                          <h2 className="display-4">{stats.totalCourses}</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <h2 className="card-title">Quick Actions</h2>
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        <button className="btn btn-primary" onClick={() => (window.location.href = "/admin/users")}>
                          Manage Users
                        </button>
                        <button className="btn btn-success" onClick={() => (window.location.href = "/admin/courses")}>
                          Manage Courses
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/courses" element={<CourseManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
