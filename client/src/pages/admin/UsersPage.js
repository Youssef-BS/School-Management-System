import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL, USER_ROLES } from "../../config/constants"
import Swal from "sweetalert2"

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_URL}/api/users`)
      setUsers(response.data)
      setError("")
    } catch (err) {
      setError("فشل في جلب بيانات المستخدمين")
      console.error(err)
      Swal.fire({
        title: "خطأ!",
        text: "فشل في جلب بيانات المستخدمين",
        icon: "error",
        confirmButtonText: "حسناً",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode)
    setSelectedUser(user)

    if (mode === "edit" && user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
      })
    }

    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (modalMode === "add") {
        await axios.post(`${API_URL}/api/users`, formData)
        Swal.fire({
          title: "تمت الإضافة!",
          text: "تم إضافة المستخدم بنجاح",
          icon: "success",
          confirmButtonText: "حسناً",
        })
      } else {
        await axios.put(`${API_URL}/api/users/${selectedUser._id}`, formData)
        Swal.fire({
          title: "تم التحديث!",
          text: "تم تحديث بيانات المستخدم بنجاح",
          icon: "success",
          confirmButtonText: "حسناً",
        })
      }

      fetchUsers()
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

  const handleDelete = async (userId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذا المستخدم!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/api/users/${userId}`)
          fetchUsers()
          Swal.fire("تم الحذف!", "تم حذف المستخدم بنجاح.", "success")
        } catch (err) {
          Swal.fire("خطأ!", "فشل في حذف المستخدم", "error")
        }
      }
    })
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "مدير"
      case USER_ROLES.TEACHER:
        return "معلم"
      case USER_ROLES.STUDENT:
        return "طالب"
      case USER_ROLES.PARENT:
        return "ولي أمر"
      default:
        return role
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
        >
          إضافة مستخدم جديد
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {isLoading ? (
        <div className="text-center py-4">جاري التحميل...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  نوع الحساب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "teacher"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "parent"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                      }`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal("edit", user)}
                      className="text-indigo-600 hover:text-indigo-900 ml-4"
                    >
                      تعديل
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900">
                      حذف
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    لا يوجد مستخدمين
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === "add" ? "إضافة مستخدم جديد" : "تعديل بيانات المستخدم"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                  الاسم
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
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                  كلمة المرور {modalMode === "edit" && "(اتركها فارغة إذا لم ترغب في تغييرها)"}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required={modalMode === "add"}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="role" className="block text-gray-700 font-bold mb-2">
                  نوع الحساب
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value={USER_ROLES.ADMIN}>مدير</option>
                  <option value={USER_ROLES.TEACHER}>معلم</option>
                  <option value={USER_ROLES.STUDENT}>طالب</option>
                  <option value={USER_ROLES.PARENT}>ولي أمر</option>
                </select>
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

export default UsersPage
