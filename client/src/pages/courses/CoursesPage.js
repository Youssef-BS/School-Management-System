import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../config/constants"
import { useAuth } from "../../contexts/AuthContext"

const CoursesPage = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classroom: "",
    createdBy: "",
    files: [],
  })

  useEffect(() => {
    fetchCourses()
    if (user?.role === "admin" || user?.role === "teacher") {
      fetchClassrooms()
    }
  }, [user])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_URL}/api/courses`)
      setCourses(response.data)
      setError("")
    } catch (err) {
      setError("فشل في جلب بيانات المواد الدراسية")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClassrooms = async () => {
    try {
      let response
      if (user.role === "teacher") {
        response = await axios.get(`${API_URL}/api/classrooms/my-classes/${user.id}`)
      } else {
        response = await axios.get(`${API_URL}/api/classrooms`)
      }
      setClassrooms(response.data)
    } catch (err) {
      console.error("فشل في جلب بيانات الفصول")
    }
  }

  const handleOpenModal = () => {
    setFormData({
      title: "",
      description: "",
      classroom: classrooms.length > 0 ? classrooms[0]._id : "",
      createdBy: user.id,
      files: [],
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      files: e.target.files,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("classroom", formData.classroom)
      formDataToSend.append("createdBy", formData.createdBy)

      if (formData.files) {
        for (let i = 0; i < formData.files.length; i++) {
          formDataToSend.append("files", formData.files[i])
        }
      }

      await axios.post(`${API_URL}/api/courses`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      fetchCourses()
      handleCloseModal()
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء حفظ البيانات")
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المواد الدراسية</h1>
        {(user?.role === "admin" || user?.role === "teacher") && (
          <button
            onClick={handleOpenModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
          >
            إضافة مادة جديدة
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {isLoading ? (
        <div className="text-center py-4">جاري التحميل...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-emerald-600 text-white px-4 py-2">
                <h2 className="text-lg font-bold">{course.title}</h2>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4">{course.description}</p>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">تم الإضافة بواسطة: {course.createdBy?.name || "غير معروف"}</p>
                  <p className="text-sm text-gray-500">تاريخ الإضافة: {formatDate(course.createdAt)}</p>
                </div>

                {course.files && course.files.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">الملفات:</h3>
                    <ul className="space-y-1">
                      {course.files.map((file, index) => (
                        <li key={index}>
                          <a
                            href={`${API_URL}${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-800 flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            ملف {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">لا توجد مواد دراسية متاحة.</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">إضافة مادة دراسية جديدة</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                  عنوان المادة
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                  وصف المادة
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input h-24"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label htmlFor="classroom" className="block text-gray-700 font-bold mb-2">
                  الفصل الدراسي
                </label>
                <select
                  id="classroom"
                  name="classroom"
                  value={formData.classroom}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">اختر الفصل</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom._id} value={classroom._id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="files" className="block text-gray-700 font-bold mb-2">
                  الملفات
                </label>
                <input
                  type="file"
                  id="files"
                  name="files"
                  onChange={handleFileChange}
                  className="form-input"
                  multiple
                />
                <p className="text-sm text-gray-500 mt-1">يمكنك اختيار ملفات متعددة</p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CoursesPage
