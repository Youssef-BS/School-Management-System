import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../config/constants"

const ParentDashboardPage = () => {
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentClasses, setStudentClasses] = useState([])
  const [studentCourses, setStudentCourses] = useState([])

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_URL}/api/users`)
      const allStudents = response.data.filter((user) => user.role === "student")
      setStudents(allStudents)

      if (allStudents.length > 0) {
        setSelectedStudent(allStudents[0])
        fetchStudentData(allStudents[0]._id)
      }

      setError("")
    } catch (err) {
      setError("فشل في جلب بيانات الطلاب")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStudentData = async (studentId) => {
    try {
      const studentResponse = await axios.get(`${API_URL}/api/users/${studentId}`)
      const studentData = studentResponse.data


      const classroomsResponse = await axios.get(`${API_URL}/api/classrooms`)
      const allClassrooms = classroomsResponse.data

    
      const classes = allClassrooms.filter((classroom) =>
        classroom.students.some((student) => student._id === studentId || student === studentId),
      )

      setStudentClasses(classes)

      const coursesResponse = await axios.get(`${API_URL}/api/courses`)
      const allCourses = coursesResponse.data

      const classIds = classes.map((cls) => cls._id)
      const courses = allCourses.filter((course) => classIds.includes(course.classroom))

      setStudentCourses(courses)
    } catch (err) {
      console.error("فشل في جلب بيانات الطالب", err)
    }
  }

  const handleSelectStudent = (student) => {
    setSelectedStudent(student)
    fetchStudentData(student._id)
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
      <h1 className="text-2xl font-bold mb-6">متابعة الأبناء</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {isLoading ? (
        <div className="text-center py-4">جاري التحميل...</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-emerald-600 text-white px-4 py-2">
                <h2 className="text-lg font-bold">قائمة الأبناء</h2>
              </div>
              <div className="p-4">
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li key={student._id} className="py-2">
                        <button
                          onClick={() => handleSelectStudent(student)}
                          className={`w-full text-right px-3 py-2 rounded ${selectedStudent?._id === student._id ? "bg-emerald-100 text-emerald-800" : "hover:bg-gray-100"}`}
                        >
                          {student.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">لا يوجد طلاب</p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            {selectedStudent ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-emerald-600 text-white px-4 py-2">
                    <h2 className="text-lg font-bold">معلومات الطالب</h2>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700">
                      <span className="font-bold">الاسم:</span> {selectedStudent.name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-bold">البريد الإلكتروني:</span> {selectedStudent.email}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-emerald-600 text-white px-4 py-2">
                    <h2 className="text-lg font-bold">سجل الحضور والغياب</h2>
                  </div>
                  <div className="p-4">
                    {selectedStudent.absences && selectedStudent.absences.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                التاريخ
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الحالة
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ملاحظات
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedStudent.absences.map((absence, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{formatDate(absence.date)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${absence.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                  >
                                    {absence.status === "present" ? "حاضر" : "غائب"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{absence.note || "-"}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">لا يوجد سجل حضور وغياب</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-emerald-600 text-white px-4 py-2">
                    <h2 className="text-lg font-bold">الفصول الدراسية</h2>
                  </div>
                  <div className="p-4">
                    {studentClasses.length > 0 ? (
                      <div className="space-y-4">
                        {studentClasses.map((classItem) => (
                          <div key={classItem._id} className="border-b pb-4 last:border-0 last:pb-0">
                            <h3 className="font-bold text-lg text-gray-800 mb-2">{classItem.name}</h3>

                            <div className="mb-3">
                              <h4 className="font-bold text-gray-700 mb-1">المعلمين:</h4>
                              <ul className="list-disc list-inside text-gray-600">
                                {classItem.teachers &&
                                  classItem.teachers.map((teacher) => <li key={teacher._id}>{teacher.name}</li>)}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-bold text-gray-700 mb-1">الجدول:</h4>
                              {classItem.schedule && classItem.schedule.length > 0 ? (
                                <ul className="text-gray-600">
                                  {classItem.schedule.map((item, index) => (
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
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">لا توجد فصول دراسية</p>
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-emerald-600 text-white px-4 py-2">
                    <h2 className="text-lg font-bold">المواد الدراسية</h2>
                  </div>
                  <div className="p-4">
                    {studentCourses.length > 0 ? (
                      <div className="space-y-4">
                        {studentCourses.map((course) => (
                          <div key={course._id} className="border-b pb-4 last:border-0 last:pb-0">
                            <h3 className="font-bold text-lg text-gray-800 mb-1">{course.title}</h3>
                            <p className="text-gray-600 mb-2">{course.description}</p>

                            <p className="text-sm text-gray-500 mb-2">
                              تم الإضافة بواسطة: {course.createdBy?.name || "غير معروف"}
                            </p>
                            <p className="text-sm text-gray-500 mb-3">تاريخ الإضافة: {formatDate(course.createdAt)}</p>

                            {course.files && course.files.length > 0 && (
                              <div>
                                <h4 className="font-bold text-gray-700 mb-1">الملفات:</h4>
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
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">لا توجد مواد دراسية</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">الرجاء اختيار طالب من القائمة</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ParentDashboardPage
