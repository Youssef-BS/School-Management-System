import { useState, useEffect } from "react"
import axios from "axios"

const ChildrenList = () => {
  const [children, setChildren] = useState([])
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

  if (loading)
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading children data...</span>
        </div>
      </div>
    )

  return (
    <div className="container-fluid p-0">
      <h1 className="mb-4">My Children</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      {children.length === 0 ? (
        <div className="alert alert-info">No children registered.</div>
      ) : (
        <div className="row">
          {children.map((child) => (
            <div key={child._id} className="col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">{child.name}</h5>
                </div>
                <div className="card-body">
                  <p className="mb-2">
                    <strong>Email:</strong> {child.email}
                  </p>
                  <div className="mt-3 pt-3 border-top">
                    <h6 className="mb-3">Attendance Summary</h6>
                    {child.absences && child.absences.length > 0 ? (
                      <div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Total Records:</span>
                          <span className="badge bg-primary">{child.absences.length}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Present:</span>
                          <span className="badge bg-success">
                            {child.absences.filter((a) => a.status === "present").length}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Absent:</span>
                          <span className="badge bg-danger">
                            {child.absences.filter((a) => a.status === "absent").length}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted">No attendance records available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChildrenList
