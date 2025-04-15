import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "100vh" }}
    >
      <h1 className="display-1 text-primary">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="text-muted mb-4">The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  )
}

export default NotFound
