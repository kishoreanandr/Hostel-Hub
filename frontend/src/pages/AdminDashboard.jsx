"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Table, Button, Badge, Form, Alert, Modal } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"

const AdminDashboard = () => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    mealType: "",
    date: "",
    rating: "",
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    byMealType: {},
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [reviews, filters])

  const fetchReviews = async () => {
    try {
      const response = await axios.get("/api/reviews")
      setReviews(response.data)
      calculateStats(response.data)
    } catch (error) {
      setError("Failed to load reviews")
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (reviewsData) => {
    const total = reviewsData.length
    const avgRating =
      total > 0 ? Math.round((reviewsData.reduce((sum, review) => sum + review.rating, 0) / total) * 10) / 10 : 0

    const byMealType = reviewsData.reduce((acc, review) => {
      acc[review.mealType] = (acc[review.mealType] || 0) + 1
      return acc
    }, {})

    setStats({ total, avgRating, byMealType })
  }

  const applyFilters = () => {
    let filtered = [...reviews]

    if (filters.mealType) {
      filtered = filtered.filter((review) => review.mealType === filters.mealType)
    }

    if (filters.date) {
      filtered = filtered.filter((review) => new Date(review.reviewDate).toISOString().split("T")[0] === filters.date)
    }

    if (filters.rating) {
      filtered = filtered.filter((review) => review.rating === Number.parseInt(filters.rating))
    }

    setFilteredReviews(filtered)
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const clearFilters = () => {
    setFilters({
      mealType: "",
      date: "",
      rating: "",
    })
  }

  const handleDeleteClick = (review) => {
    setReviewToDelete(review)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/reviews/admin/delete/${reviewToDelete.id}`)
      setReviews(reviews.filter((review) => review.id !== reviewToDelete.id))
      setShowDeleteModal(false)
      setReviewToDelete(null)
    } catch (error) {
      setError("Failed to delete review")
      console.error("Error deleting review:", error)
    }
  }

  const getMealTypeIcon = (mealType) => {
    const icons = {
      BREAKFAST: "🌅",
      LUNCH: "🌞",
      SNACKS: "🍪",
      DINNER: "🌙",
    }
    return icons[mealType] || "🍽️"
  }

  const getRatingStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating)
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return "success"
    if (rating >= 3) return "warning"
    return "danger"
  }

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Admin Dashboard 👨‍💼</h2>
            <Badge bg="primary">Total Reviews: {stats.total}</Badge>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h4 className="text-primary">{stats.total}</h4>
                  <p>Total Reviews</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h4 className="text-success">{stats.avgRating}</h4>
                  <p>Average Rating</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h4 className="text-info">{stats.byMealType.BREAKFAST || 0}</h4>
                  <p>Breakfast Reviews</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h4 className="text-warning">{stats.byMealType.DINNER || 0}</h4>
                  <p>Dinner Reviews</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>🔍 Filter Reviews</Card.Title>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Meal Type</Form.Label>
                    <Form.Select name="mealType" value={filters.mealType} onChange={handleFilterChange}>
                      <option value="">All Meals</option>
                      <option value="BREAKFAST">Breakfast</option>
                      <option value="LUNCH">Lunch</option>
                      <option value="SNACKS">Snacks</option>
                      <option value="DINNER">Dinner</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="date" value={filters.date} onChange={handleFilterChange} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Rating</Form.Label>
                    <Form.Select name="rating" value={filters.rating} onChange={handleFilterChange}>
                      <option value="">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button variant="outline-secondary" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Reviews Table */}
          <Card>
            <Card.Body>
              <Card.Title>📋 All Reviews ({filteredReviews.length})</Card.Title>
              {filteredReviews.length === 0 ? (
                <Alert variant="info">No reviews found matching the current filters.</Alert>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Student</th>
                      <th>Meal</th>
                      <th>Rating</th>
                      <th>Comments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReviews.map((review) => (
                      <tr key={review.id}>
                        <td>
                          <small>{new Date(review.reviewDate).toLocaleDateString()}</small>
                        </td>
                        <td>
                          <strong>{review.user?.name || review.user?.email || "Anonymous"}</strong>
                        </td>
                        <td>
                          <Badge bg="secondary">
                            {getMealTypeIcon(review.mealType)} {review.mealType}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getRatingColor(review.rating)}>
                            {getRatingStars(review.rating)} ({review.rating}/5)
                          </Badge>
                        </td>
                        <td>
                          <div style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {review.comments || "No comments"}
                          </div>
                        </td>
                        <td>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(review)}>
                            🗑️ Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this review? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Review
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default AdminDashboard
