"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          School Management System
        </Link>

        {user && (
          <div className="d-flex align-items-center">
            <div className="me-3 text-light">
              <span className="me-2">Welcome, {user.name}</span>
              <span className="badge bg-light text-primary">{user.role}</span>
            </div>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
