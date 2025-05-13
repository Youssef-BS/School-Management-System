import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../config/constants"
import { useAuth } from "../../contexts/AuthContext"

const StudentDashboardPage = () => {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [courses, setCourses] = useState([])
  const [absences, setAbsences] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user?.id) {
      fetchStudentData()
    }
  }, [user])

  const fetchStudentData = async () => {
    try {
      setIsLoading(true)

      const userResponse = await axios.get(`${API_URL}/api/users/${user.id}`)
      const userData = userResponse.data

      setAbsences(userData.absences || [])

      const classroomsResponse = await axios.get(`${API_URL}/api/classrooms`)
      const studentClasses = classroomsResponse.data.filter((classroom) =>
        classroom.students.some((student) => student._id === user.id || student === user.id)
      )
      setClasses(studentClasses)

      const coursesResponse = await axios.get(`${API_URL}/api/courses`)
      const studentClassIds = studentClasses.map((cls) => cls._id)
      const studentCourses = coursesResponse.data.filter((course) =>
        studentClassIds.includes(course.classroom)
      )
      setCourses(studentCourses)

      setError("")
    } catch (err) {
      console.error(err)
      setError("فشل في جلب البيانات")
    } finally {
      setIsLoading(false)
    }
  }

  const getArabicDay = (day) => {
    const days = {
      Monday: "الإثنين",
      Tuesday: "الثلاثاء",
      Wednesday: "الأربعاء",
      Thursday: "الخميس",
      Friday: "الجمعة",
      Saturday: "السبت",
      Sunday: "الأحد",
    }
    return days[day] || day
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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">لوحة الطالب</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-lg text-gray-600">جاري التحميل...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4 border-b pb-2">فصولي الدراسية</h2>
            {classes.length > 0 ? (
              classes.map((cls) => (
                <div key={cls._id} className="mb-4 border-b last:border-0 pb-4">
                  <h3 className="text-lg font-bold text-gray-800">{cls.name}</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-semibold">المعلمين:</p>
                    <ul className="list-disc list-inside">
                      {cls.teachers?.map((teacher) => (
                        <li key={teacher._id}>{teacher.name}</li>
                      ))}
                    </ul>
                    <p className="font-semibold mt-2">الجدول:</p>
                    {cls.schedule?.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {cls.schedule.map((item, idx) => (
                          <li key={idx}>
                            {getArabicDay(item.day)}: {item.startTime} - {item.endTime}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">لا يوجد جدول</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">لا توجد فصول دراسية</p>
            )}
          </section>
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4 border-b pb-2">المواد الدراسية</h2>
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course._id} className="mb-4 border-b last:border-0 pb-4">
                  <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  <p className="text-xs text-gray-500 mt-1">تم الإضافة بواسطة: {course.createdBy?.name || "غير معروف"}</p>
                  <p className="text-xs text-gray-500">تاريخ الإضافة: {formatDate(course.createdAt)}</p>

                  {course.files?.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold text-sm text-gray-700">الملفات:</p>
                      <ul className="space-y-1 mt-1">
                        {course.files.map((file, index) => (
                          <li key={index}>
                            <a
                              href={`${API_URL}${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:underline text-sm flex items-center"
                            >
                              📄 ملف {index + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">لا توجد مواد دراسية</p>
            )}
          </section>
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4 border-b pb-2">الحضور والغياب</h2>
            {absences.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {absences.map((absence) => (
                  <li key={absence._id} className="py-3">
                    <p className="text-sm text-gray-700">التاريخ: {formatDate(absence.date)}</p>
                    <p
                      className={`text-sm font-bold ${
                        absence.status === "absent" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      الحالة: {absence.status === "absent" ? "غائب" : "حاضر"}
                    </p>
                    {absence.note && (
                      <p className="text-xs text-gray-500 mt-1">ملاحظة: {absence.note}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">لا توجد سجلات حضور أو غياب</p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default StudentDashboardPage

