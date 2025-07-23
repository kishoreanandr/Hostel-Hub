"use client"
import { Navbar as BootstrapNavbar, Nav, Container, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          🏠 Hostel Food Review
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {user ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                {user.role !== "ADMIN" && (
                  <>
                    <Nav.Link as={Link} to="/submit-review">
                      Submit Review
                    </Nav.Link>
                    <Nav.Link as={Link} to="/view-reviews">
                      View Reviews
                    </Nav.Link>
                  </>
                )}
              </Nav>
              <Nav>
                <BootstrapNavbar.Text className="me-3">
                  Welcome, {user.name || user.email}
                  {user.role === "ADMIN" && <span className="badge bg-warning ms-2">Admin</span>}
                </BootstrapNavbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/signup">
                Sign Up
              </Nav.Link>
            </Nav>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
