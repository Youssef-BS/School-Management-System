"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const StudentCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:3000/api/courses")
        setCourses(response.data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch courses")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading)
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading courses...</span>
        </div>
      </div>
    )

  return (
    <div className="container-fluid p-0">
      <h1 className="mb-4">Available Courses</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      {courses.length === 0 ? (
        <div className="alert alert-info">No courses available.</div>
      ) : (
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">{course.title}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text">{course.description}</p>
                  <div className="mt-3 pt-3 border-top">
                    <p className="mb-1">
                      <strong>Teacher:</strong> {course.createdBy?.name || "Unknown"}
                    </p>
                    <p className="mb-1">
                      <strong>Created:</strong> {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {course.files && course.files.length > 0 && (
                    <div className="mt-3">
                      <h6 className="mb-2">Materials:</h6>
                      <ul className="list-group list-group-flush">
                        {course.files.map((file, index) => (
                          <li key={index} className="list-group-item px-0">
                            <a
                              href={`http://localhost:3000${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              <i className="bi bi-file-earmark-text me-2"></i>
                              Material {index + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentCourses
