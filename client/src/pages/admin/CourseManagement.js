"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const CourseManagement = () => {
  const [courses, setCourses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    createdBy: "",
    files: [],
  })

  useEffect(() => {
    fetchCourses()
    fetchTeachers()
  }, [])

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

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users")
      const teachersList = response.data.filter((user) => user.role === "teacher")
      setTeachers(teachersList)
      if (teachersList.length > 0 && !formData.createdBy) {
        setFormData((prev) => ({
          ...prev,
          createdBy: teachersList[0]._id,
        }))
      }
    } catch (err) {
      console.error("Failed to fetch teachers:", err)
    }
  }

  const handleChange = (e) => {
    if (e.target.name === "files") {
      setFormData({
        ...formData,
        files: e.target.files,
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const courseData = new FormData()
      courseData.append("title", formData.title)
      courseData.append("description", formData.description)
      courseData.append("createdBy", formData.createdBy)

      if (formData.files) {
        for (let i = 0; i < formData.files.length; i++) {
          courseData.append("files", formData.files[i])
        }
      }

      await axios.post("http://localhost:3000/api/courses", courseData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      resetForm()
      fetchCourses()
    } catch (err) {
      setError("Failed to create course")
      console.error(err)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      createdBy: teachers.length > 0 ? teachers[0]._id : "",
      files: [],
    })
  }

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
      <h1 className="mb-4">Course Management</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Create New Course</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="title" className="form-label">
                  Course Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="createdBy" className="form-label">
                  Assigned Teacher
                </label>
                <select
                  className="form-select"
                  id="createdBy"
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="files" className="form-label">
                Course Materials
              </label>
              <input type="file" className="form-control" id="files" name="files" onChange={handleChange} multiple />
              <div className="form-text">You can select multiple files</div>
            </div>
            <button type="submit" className="btn btn-primary">
              Create Course
            </button>
          </form>
        </div>
      </div>

      <h2 className="mb-3">Course List</h2>
      {courses.length === 0 ? (
        <div className="alert alert-info">No courses available.</div>
      ) : (
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-light">
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

export default CourseManagement
