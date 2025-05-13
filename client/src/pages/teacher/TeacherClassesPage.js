import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../config/constants"
import { useAuth } from "../../contexts/AuthContext"

const TeacherClassesPage = () => {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedClass, setSelectedClass] = useState(null)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [attendanceData, setAttendanceData] = useState({
    studentId: "",
    status: "present",
    note: "",
  })

  useEffect(() => {
    if (user?.id) {
      fetchTeacherClasses()
    }
  }, [user])

  const fetchTeacherClasses = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_URL}/api/classrooms/my-classes/${user.id}`)
      setClasses(response.data)
      setError("")
    } catch (err) {
      setError("فشل في جلب بيانات الفصول")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectClass = (classItem) => {
    setSelectedClass(classItem)
  }

  const handleOpenAttendanceModal = (student) => {
    setAttendanceData({
      studentId: student._id,
      status: "present",
      note: "",
    })
    setShowAttendanceModal(true)
  }

  const handleCloseAttendanceModal = () => {
    setShowAttendanceModal(false)
  }

  const handleAttendanceChange = (e) => {
    const { name, value } = e.target
    setAttendanceData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitAttendance = async (e) => {
    e.preventDefault()

    try {
      await axios.post(`${API_URL}/api/users/${attendanceData.studentId}/attendance`, {
        status: attendanceData.status,
        note: attendanceData.note,
      })

      handleCloseAttendanceModal()
      fetchTeacherClasses()
    } catch (err) {
      setError("فشل في تسجيل الحضور")
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
      <h1 className="text-2xl font-bold mb-6">فصولي الدراسية</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {isLoading ? (
        <div className="text-center py-4">جاري التحميل...</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-emerald-600 text-white px-4 py-2">
                <h2 className="text-lg font-bold">قائمة الفصول</h2>
              </div>
              <div className="p-4">
                {classes.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {classes.map((classItem) => (
                      <li key={classItem._id} className="py-2">
                        <button
                          onClick={() => handleSelectClass(classItem)}
                          className={`w-full text-right px-3 py-2 rounded ${selectedClass?._id === classItem._id ? "bg-emerald-100 text-emerald-800" : "hover:bg-gray-100"}`}
                        >
                          {classItem.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">لا توجد فصول دراسية</p>
                )}
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            {selectedClass ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-emerald-600 text-white px-4 py-2">
                  <h2 className="text-lg font-bold">{selectedClass.name}</h2>
                </div>
                <div className="p-4">
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-700 mb-2">الجدول الدراسي:</h3>
                    {selectedClass.schedule && selectedClass.schedule.length > 0 ? (
                      <ul className="bg-gray-50 rounded p-3">
                        {selectedClass.schedule.map((item, index) => (
                          <li key={index} className="mb-1 text-gray-600">
                            {getArabicDay(item.day)}: {item.startTime} - {item.endTime}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">لا يوجد جدول</p>
                    )}
                  </div>
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-700 mb-2">المواد الدراسية:</h3>
                    {selectedClass.courses && selectedClass.courses.length > 0 ? (
                      <ul className="bg-gray-50 rounded p-3 divide-y divide-gray-200">
                        {selectedClass.courses.map((course) => (
                          <li key={course._id} className="py-2">
                            <h4 className="font-bold">{course.title}</h4>
                            <p className="text-sm text-gray-600">{course.description}</p>
                            <p className="text-xs text-gray-500 mt-1">تاريخ الإضافة: {formatDate(course.createdAt)}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">لا توجد مواد دراسية</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">الطلاب:</h3>
                    {selectedClass.students && selectedClass.students.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الاسم
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                البريد الإلكتروني
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الإجراءات
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedClass.students.map((student) => (
                              <tr key={student._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{student.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => handleOpenAttendanceModal(student)}
                                    className="text-emerald-600 hover:text-emerald-900"
                                  >
                                    تسجيل الحضور
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500">لا يوجد طلاب</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">الرجاء اختيار فصل من القائمة</p>
              </div>
            )}
          </div>
        </div>
      )}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">تسجيل الحضور</h2>

            <form onSubmit={handleSubmitAttendance}>
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 font-bold mb-2">
                  الحالة
                </label>
                <select
                  id="status"
                  name="status"
                  value={attendanceData.status}
                  onChange={handleAttendanceChange}
                  className="form-input"
                  required
                >
                  <option value="present">حاضر</option>
                  <option value="absent">غائب</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="note" className="block text-gray-700 font-bold mb-2">
                  ملاحظات
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={attendanceData.note}
                  onChange={handleAttendanceChange}
                  className="form-input h-24"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseAttendanceModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
                >
                  تسجيل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherClassesPage
