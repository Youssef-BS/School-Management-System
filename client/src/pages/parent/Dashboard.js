import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import ChildrenList from "./ChildrenList"
import AttendanceRecords from "./AttendanceRecords"
import axios from "axios"

const ParentDashboard = () => {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users")
        const studentsList = response.data.filter((user) => user.role === "student")
        setChildren(studentsList.slice(0, 2)) // Just take first 2 for demo
      } catch (error) {
        console.error("Error fetching children:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChildren()
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
                  <h1 className="mb-4">Parent Dashboard</h1>
                  <div className="card mb-4">
                    <div className="card-body">
                      <h2 className="card-title">Welcome to the Parent Portal</h2>
                      <p className="card-text">You can view your children's attendance and course information here.</p>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                      <div className="card bg-primary text-white h-100">
                        <div className="card-body text-center">
                          <h3>My Children</h3>
                          <h2 className="display-4">{children.length}</h2>
                        </div>
                        <div className="card-footer bg-primary border-0 text-center">
                          <button className="btn btn-light" onClick={() => (window.location.href = "/parent/children")}>
                            View Children
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
                            onClick={() => (window.location.href = "/parent/attendance")}
                          >
                            Check Attendance
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/children" element={<ChildrenList />} />
            <Route path="/attendance" element={<AttendanceRecords />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default ParentDashboard
