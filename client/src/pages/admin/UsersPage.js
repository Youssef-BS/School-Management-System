// Updated UsersPage Component
import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL, USER_ROLES } from "../../config/constants"
import Swal from "sweetalert2"

const UsersPage = () => {
  const [users, setUsers] = useState([])
  console.log(users)
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
    children: [],
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
        children: user.children?.map(child => child._id) || []
      })
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
        children: []
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

  const handleChildrenChange = (e) => {
    const options = e.target.options
    const selectedChildren = []
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedChildren.push(options[i].value)
      }
    }
    setFormData((prev) => ({ ...prev, children: selectedChildren }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (modalMode === "add") {
        await axios.post(`${API_URL}/api/users`, formData)
        Swal.fire({ title: "تمت الإضافة!", text: "تم إضافة المستخدم بنجاح", icon: "success", confirmButtonText: "حسناً" })
      } else {
        await axios.put(`${API_URL}/api/users/${selectedUser._id}`, formData)
        Swal.fire({ title: "تم التحديث!", text: "تم تحديث بيانات المستخدم بنجاح", icon: "success", confirmButtonText: "حسناً" })
      }

      fetchUsers()
      handleCloseModal()
    } catch (err) {
      const errorMsg = err.response?.data?.message || "حدث خطأ أثناء حفظ البيانات"
      setError(errorMsg)
      Swal.fire({ title: "خطأ!", text: errorMsg, icon: "error", confirmButtonText: "حسناً" })
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
        <button onClick={() => handleOpenModal("add")} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded">
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع الحساب</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleLabel(user.role)}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button onClick={() => handleOpenModal("edit", user)} className="text-green-600 hover:text-green-900">تعديل</button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{modalMode === "add" ? "إضافة مستخدم" : "تعديل مستخدم"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="الاسم" className="w-full border px-3 py-2 rounded" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="البريد الإلكتروني" className="w-full border px-3 py-2 rounded" required />
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="كلمة المرور" className="w-full border px-3 py-2 rounded" />
              <select name="role" value={formData.role} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                {Object.values(USER_ROLES).map((role) => (
                  <option key={role} value={role}>{getRoleLabel(role)}</option>
                ))}
              </select>
              {formData.role === 'parent' && (
                <select multiple value={formData.children} onChange={handleChildrenChange} className="w-full border px-3 py-2 rounded">
                  {users.filter(u => u.role === 'student').map(child => (
                    <option key={child._id} value={child._id}>{child.name}</option>
                  ))}
                </select>
              )}
              <div className="flex justify-end gap-2">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">حفظ</button>
                <button onClick={handleCloseModal} type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage