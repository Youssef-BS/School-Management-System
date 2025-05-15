"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-green-600">
                المدرسة الإعدادية شنني

              </Link>
            </div>
            <div className="hidden sm:mr-6 sm:flex sm:items-center sm:space-x-8 sm:space-x-reverse">
              <Link to="/" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">
                الرئيسية
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">
                عن المنصة
              </Link>
              <Link to="/features" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">
                المميزات
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">
                اتصل بنا
              </Link>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 space-x-reverse bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
                >
                  <span>{user.name}</span>
                  <ChevronDown size={16} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to={`/dashboard/${user.role}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-right"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <User size={16} />
                        <span>لوحة التحكم</span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-right"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <LogOut size={16} />
                        <span>تسجيل الخروج</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium">
                  تسجيل الدخول
                </Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 font-medium"
            >
              الرئيسية
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 font-medium"
            >
              عن المنصة
            </Link>
            <Link
              to="/features"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 font-medium"
            >
              المميزات
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 font-medium"
            >
              اتصل بنا
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-2 space-y-1">
                <Link
                  to={`/dashboard/${user.role}`}
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 font-medium"
                >
                  لوحة التحكم
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-right px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 font-medium"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 font-medium"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 font-medium"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
