import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

const AuthLayout = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-emerald-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <Link to="/" className="text-xl font-bold">
            المدرسة الإعدادية شنني
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      <footer className="bg-white py-4 text-center text-gray-600 text-sm">
        <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - المدرسة الإعدادية شنني</p>
      </footer>
    </div>
  )
}

export default AuthLayout
