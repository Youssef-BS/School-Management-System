import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { USER_ROLES } from "../../config/constants"

const DashboardPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect based on user role
    if (user) {
      switch (user.role) {
        case USER_ROLES.ADMIN:
          // Admin stays on the dashboard
          break
        case USER_ROLES.TEACHER:
          navigate("/teacher/classes")
          break
        case USER_ROLES.STUDENT:
          navigate("/student/dashboard")
          break
        case USER_ROLES.PARENT:
          navigate("/parent/dashboard")
          break
        default:
          break
      }
    }
  }, [user, navigate])

  if (user?.role !== USER_ROLES.ADMIN) {
    return <div className="p-4">جاري التحويل...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">لوحة تحكم المدير</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-emerald-500">
          <h2 className="text-lg font-bold mb-2">إدارة المستخدمين</h2>
          <p className="text-gray-600 mb-4">إضافة وتعديل وحذف المستخدمين في النظام</p>
          <button
            onClick={() => navigate("/users")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
          >
            إدارة المستخدمين
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-emerald-500">
          <h2 className="text-lg font-bold mb-2">إدارة الفصول</h2>
          <p className="text-gray-600 mb-4">إنشاء وتعديل الفصول الدراسية وتوزيع الطلاب والمعلمين</p>
          <button
            onClick={() => navigate("/classrooms")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
          >
            إدارة الفصول
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-emerald-500">
          <h2 className="text-lg font-bold mb-2">المواد الدراسية</h2>
          <p className="text-gray-600 mb-4">عرض وإدارة المواد الدراسية المتاحة في النظام</p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
          >
            عرض المواد
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">مرحباً بك في لوحة تحكم المدير</h2>
        <p className="text-gray-600">
          من هنا يمكنك إدارة جميع جوانب النظام التعليمي بما في ذلك المستخدمين والفصول والمواد الدراسية. استخدم الأزرار
          أعلاه للوصول إلى الأقسام المختلفة من لوحة التحكم.
        </p>
      </div>
    </div>
  )
}

export default DashboardPage
