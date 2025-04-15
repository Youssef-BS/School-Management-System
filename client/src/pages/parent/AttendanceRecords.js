"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const AttendanceRecords = () => {
  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:3000/api/users")
        const studentsList = response.data.filter((user) => user.role === "student")
        setChildren(studentsList.slice(0, 2)) // Just take first 2 for demo
        setError(null)
      } catch (err) {
        setError("Failed to fetch children")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchChildren()
  }, [])

  const handleChildSelect = async (childId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${childId}`)
      setSelectedChild(response.data)
    } catch (err) {
      setError("Failed to fetch child details")
      console.error(err)
    }
  }

  if (loading)
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading attendance records...</span>
        </div>
      </div>
    )

  return (
    <div className="container-fluid p-0">
      <h1 className="mb-4">Attendance Records</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Select Child</h5>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {children.map((child) => (
                  <li
                    key={child._id}
                    className={`list-group-item ${selectedChild?._id === child._id ? "active" : ""} cursor-pointer`}
                    onClick={() => handleChildSelect(child._id)}
                    style={{ cursor: "pointer" }}
                  >
                    {child.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            {selectedChild ? (
              <>
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Attendance for {selectedChild.name}</h5>
                </div>
                <div className="card-body">
                  {selectedChild.absences && selectedChild.absences.length > 0 ? (
                    <>
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
                            {selectedChild.absences.map((record, index) => (
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

                      <div className="card mt-4">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Summary</h5>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <div className="card bg-light">
                                <div className="card-body text-center">
                                  <h6 className="card-title">Total Records</h6>
                                  <p className="card-text fs-4">{selectedChild.absences.length}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 mb-3">
                              <div className="card bg-success text-white">
                                <div className="card-body text-center">
                                  <h6 className="card-title">Present</h6>
                                  <p className="card-text fs-4">
                                    {selectedChild.absences.filter((a) => a.status === "present").length}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 mb-3">
                              <div className="card bg-danger text-white">
                                <div className="card-body text-center">
                                  <h6 className="card-title">Absent</h6>
                                  <p className="card-text fs-4">
                                    {selectedChild.absences.filter((a) => a.status === "absent").length}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted text-center py-4">No attendance records available for this child.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="card-body text-center py-5">
                <p className="text-muted mb-0">Select a child from the list to view attendance records</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceRecords
