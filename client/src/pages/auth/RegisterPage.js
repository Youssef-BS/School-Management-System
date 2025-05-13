import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { USER_ROLES } from "../../config/constants"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة")
      return
    }

    setIsLoading(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      navigate("/login", { state: { message: "تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن" } })
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mx-4 mb-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">إنشاء حساب جديد</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

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
            كلمة المرور
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
            minLength={6}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">
            تأكيد كلمة المرور
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input"
            required
            minLength={6}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="role" className="block text-gray-700 font-bold mb-2">
            نوع الحساب
          </label>
          <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-input" required>
            <option value={USER_ROLES.STUDENT}>طالب</option>
            <option value={USER_ROLES.TEACHER}>معلم</option>
            <option value={USER_ROLES.PARENT}>ولي أمر</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-emerald-600 hover:text-emerald-800">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
