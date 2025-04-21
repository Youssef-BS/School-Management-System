import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

const StudentAttendance = () => {
  const { user } = useAuth()
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:3000/api/users/${user.id}`)
        setAttendance(response.data.absences || [])
        setError(null)
      } catch (err) {
        setError("Failed to fetch attendance records")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [user.id])

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
      <h1 className="mb-4">My Attendance</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      {attendance.length === 0 ? (
        <div className="alert alert-info">No attendance records available.</div>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Attendance Summary</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5 className="card-title">Total Records</h5>
                      <p className="card-text display-4">{attendance.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <h5 className="card-title">Present</h5>
                      <p className="card-text display-4">{attendance.filter((a) => a.status === "present").length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-danger text-white">
                    <div className="card-body text-center">
                      <h5 className="card-title">Absent</h5>
                      <p className="card-text display-4">{attendance.filter((a) => a.status === "absent").length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Attendance History</h5>
            </div>
            <div className="card-body">
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
                    {attendance.map((record, index) => (
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
          </div>
        </>
      )}
    </div>
  )
}

export default StudentAttendance
