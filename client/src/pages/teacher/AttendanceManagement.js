"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const AttendanceManagement = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [attendanceData, setAttendanceData] = useState({
    status: "present",
    note: "",
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3000/api/users")
      const studentsList = response.data.filter((user) => user.role === "student")
      setStudents(studentsList)
      setError(null)
    } catch (err) {
      setError("Failed to fetch students")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStudentSelect = (student) => {
    setSelectedStudent(student)
    setAttendanceData({
      status: "present",
      note: "",
    })
  }

  const handleChange = (e) => {
    setAttendanceData({
      ...attendanceData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedStudent) return

    try {
      await axios.post(`http://localhost:3000/api/users/${selectedStudent._id}/attendance`, attendanceData)

      // Show success message
      const successAlert = document.getElementById("success-alert")
      if (successAlert) {
        successAlert.classList.remove("d-none")
        setTimeout(() => {
          successAlert.classList.add("d-none")
        }, 3000)
      }

      // Refresh student data
      const response = await axios.get(`http://localhost:3000/api/users/${selectedStudent._id}`)
      const updatedStudents = students.map((student) => (student._id === selectedStudent._id ? response.data : student))
      setStudents(updatedStudents)
      setSelectedStudent(response.data)

      // Reset form
      setAttendanceData({
        status: "present",
        note: "",
      })
    } catch (err) {
      setError("Failed to mark attendance")
      console.error(err)
    }
  }

  if (loading)
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading students...</span>
        </div>
      </div>
    )

  return (
    <div className="container-fluid p-0">
      <h1 className="mb-4">Attendance Management</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="alert alert-success d-none" id="success-alert">
        Attendance marked successfully!
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Students</h5>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {students.map((student) => (
                  <li
                    key={student._id}
                    className={`list-group-item ${selectedStudent?._id === student._id ? "active" : ""} cursor-pointer`}
                    onClick={() => handleStudentSelect(student)}
                    style={{ cursor: "pointer" }}
                  >
                    {student.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            {selectedStudent ? (
              <>
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Mark Attendance for {selectedStudent.name}</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        className="form-select"
                        id="status"
                        name="status"
                        value={attendanceData.status}
                        onChange={handleChange}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="note" className="form-label">
                        Note (Optional)
                      </label>
                      <textarea
                        className="form-control"
                        id="note"
                        name="note"
                        value={attendanceData.note}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Mark Attendance
                    </button>
                  </form>

                  {selectedStudent.absences && selectedStudent.absences.length > 0 && (
                    <div className="mt-4">
                      <h5 className="border-bottom pb-2">Attendance History</h5>
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Note</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedStudent.absences.map((record, index) => (
                              <tr key={index}>
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td>
                                  <span className={`badge ${record.status === "absent" ? "bg-danger" : "bg-success"}`}>
                                    {record.status}
                                  </span>
                                </td>
                                <td>{record.note || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="card-body text-center py-5">
                <p className="text-muted mb-0">Select a student from the list to mark attendance</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceManagement
