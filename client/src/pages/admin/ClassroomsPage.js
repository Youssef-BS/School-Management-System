import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL, DAYS_OF_WEEK_EN } from "../../config/constants"
import Swal from "sweetalert2"

const ClassroomsPage = () => {
  const [classrooms, setClassrooms] = useState([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("add") // 'add' or 'edit'
  const [selectedClassroom, setSelectedClassroom] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    studentIds: [],
    teacherIds: [],
    schedule: [],
  })
  const [scheduleItem, setScheduleItem] = useState({
    day: "Monday",
    startTime: "",
    endTime: "",
  })

  useEffect(() => {
    fetchClassrooms()
    fetchUsers()
  }, [])

  const fetchClassrooms = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_URL}/api/classrooms`)
      setClassrooms(response.data)
      setError("")
    } catch (err) {
      setError("فشل في جلب بيانات الفصول")
      console.error(err)
      Swal.fire({
        title: "خطأ!",
        text: "فشل في جلب بيانات الفصول",
        icon: "error",
        confirmButtonText: "حسناً",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`)
      setUsers(response.data)
    } catch (err) {
      console.error("فشل في جلب بيانات المستخدمين")
    }
  }

  const handleOpenModal = (mode, classroom = null) => {
    setModalMode(mode)
    setSelectedClassroom(classroom)

    if (mode === "edit" && classroom) {
      setFormData({
        name: classroom.name,
        studentIds: classroom.students.map((student) => student._id),
        teacherIds: classroom.teachers.map((teacher) => teacher._id),
        schedule: classroom.schedule || [],
      })
    } else {
      setFormData({
        name: "",
        studentIds: [],
        teacherIds: [],
        schedule: [],
      })
    }

    setScheduleItem({
      day: "Monday",
      startTime: "",
      endTime: "",
    })

    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedClassroom(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value)

    setFormData((prev) => ({
      ...prev,
      [name]: selectedValues,
    }))
  }

  const handleScheduleItemChange = (e) => {
    const { name, value } = e.target
    setScheduleItem((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addScheduleItem = () => {
    if (!scheduleItem.startTime || !scheduleItem.endTime) {
      Swal.fire({
        title: "تنبيه!",
        text: "الرجاء إدخال وقت البداية والنهاية",
        icon: "warning",
        confirmButtonText: "حسناً",
      })
      return
    }

    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { ...scheduleItem }],
    }))

    setScheduleItem({
      day: "Monday",
      startTime: "",
      endTime: "",
    })
  }

  const removeScheduleItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }))
  }

const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (modalMode === "add") {
        await axios.post(`${API_URL}/api/classrooms`, formData)
        Swal.fire({
          title: "تمت الإضافة!",
          text: "تم إضافة الفصل بنجاح",
          icon: "success",
          confirmButtonText: "حسناً",
        })
      } else {
        await axios.put(`${API_URL}/api/classrooms/${selectedClassroom._id}`, formData)
        Swal.fire({
          title: "تم التحديث!",
          text: "تم تحديث بيانات الفصل بنجاح",
          icon: "success",
          confirmButtonText: "حسناً",
        })
      }

      fetchClassrooms()
      handleCloseModal()
    } catch (err) {
      const errorMsg = err.response?.data?.message || "حدث خطأ أثناء حفظ البيانات"
      setError(errorMsg)
      Swal.fire({
        title: "خطأ!",
        text: errorMsg,
        icon: "error",
        confirmButtonText: "حسناً",
      })
    }
  }

  const handleDelete = async (classroomId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذا الفصل!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/api/classrooms/${classroomId}`)
          fetchClassrooms()
          Swal.fire("تم الحذف!", "تم حذف الفصل بنجاح.", "success")
        } catch (err) {
          Swal.fire("خطأ!", "فشل في حذف الفصل", "error")
        }
      }
    })
  }

  const getArabicDay = (englishDay) => {
    const arabicDays = {
      Monday: "الإثنين",
      Tuesday: "الثلاثاء",
      Wednesday: "الأربعاء",
      Thursday: "الخميس",
      Friday: "الجمعة",
      Saturday: "السبت",
      Sunday: "الأحد",
    }

    return arabicDays[englishDay] || englishDay
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الفصول الدراسية</h1>
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
        >
          إضافة فصل جديد
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {isLoading ? (
        <div className="text-center py-4">جاري التحميل...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <div key={classroom._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-emerald-600 text-white px-4 py-2 flex justify-between items-center">
                <h2 className="text-lg font-bold">{classroom.name}</h2>
                <div>
                  <button
                    onClick={() => handleOpenModal("edit", classroom)}
                    className="text-white hover:text-emerald-200 mr-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(classroom._id)} className="text-white hover:text-red-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-700 mb-2">المعلمين:</h3>
                  {classroom.teachers && classroom.teachers.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {classroom.teachers.map((teacher) => (
                        <li key={teacher._id} className="text-gray-600">
                          {teacher.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">لا يوجد معلمين</p>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-gray-700 mb-2">الطلاب:</h3>
                  <p className="text-gray-600">{classroom.students ? classroom.students.length : 0} طالب</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-700 mb-2">الجدول:</h3>
                  {classroom.schedule && classroom.schedule.length > 0 ? (
                    <ul className="text-sm text-gray-600">
                      {classroom.schedule.map((item, index) => (
                        <li key={index} className="mb-1">
                          {getArabicDay(item.day)}: {item.startTime} - {item.endTime}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">لا يوجد جدول</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {classrooms.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">لا توجد فصول دراسية. قم بإضافة فصل جديد.</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{modalMode === "add" ? "إضافة فصل جديد" : "تعديل بيانات الفصل"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                  اسم الفصل
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="teacherIds" className="block text-gray-700 font-bold mb-2">
                  المعلمين
                </label>
                <select
                  id="teacherIds"
                  name="teacherIds"
                  multiple
                  value={formData.teacherIds}
                  onChange={handleMultiSelectChange}
                  className="form-input h-32"
                >
                  {users
                    .filter((user) => user.role === "teacher")
                    .map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </option>
                    ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">اضغط Ctrl للاختيار المتعدد</p>
              </div>

              <div className="mb-4">
                <label htmlFor="studentIds" className="block text-gray-700 font-bold mb-2">
                  الطلاب
                </label>
                <select
                  id="studentIds"
                  name="studentIds"
                  multiple
                  value={formData.studentIds}
                  onChange={handleMultiSelectChange}
                  className="form-input h-32"
                >
                  {users
                    .filter((user) => user.role === "student")
                    .map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name}
                      </option>
                    ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">اضغط Ctrl للاختيار المتعدد</p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">الجدول الدراسي</label>

                <div className="bg-gray-50 p-4 rounded mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label htmlFor="day" className="block text-gray-700 text-sm font-bold mb-1">
                        اليوم
                      </label>
                      <select
                        id="day"
                        name="day"
                        value={scheduleItem.day}
                        onChange={handleScheduleItemChange}
                        className="form-input"
                      >
                        {Object.keys(DAYS_OF_WEEK_EN).map((day) => (
                          <option key={day} value={DAYS_OF_WEEK_EN[day]}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="startTime" className="block text-gray-700 text-sm font-bold mb-1">
                        وقت البداية
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={scheduleItem.startTime}
                        onChange={handleScheduleItemChange}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label htmlFor="endTime" className="block text-gray-700 text-sm font-bold mb-1">
                        وقت النهاية
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={scheduleItem.endTime}
                        onChange={handleScheduleItemChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addScheduleItem}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm"
                  >
                    إضافة موعد
                  </button>
                </div>

                {formData.schedule.length > 0 && (
                  <div className="bg-white border rounded p-4">
                    <h4 className="font-bold text-gray-700 mb-2">المواعيد المضافة:</h4>
                    <ul className="space-y-2">
                      {formData.schedule.map((item, index) => (
                        <li key={index} className="flex justify-between items-center border-b pb-2">
                          <span>
                            {getArabicDay(item.day)}: {item.startTime} - {item.endTime}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeScheduleItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
                  {modalMode === "add" ? "إضافة" : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClassroomsPage