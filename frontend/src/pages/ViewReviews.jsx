"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Alert, Badge, Button } from "react-bootstrap"
import axios from "axios"

const ViewReviews = () => {
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    mealType: "",
    date: "",
    rating: "",
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
    } catch (error) {
      setError("Failed to load reviews")
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
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

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))

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
    <Container>
      <Row>
        <Col>
          <h2 className="mb-4">👀 All Food Reviews</h2>

          {error && <Alert variant="danger">{error}</Alert>}

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
                      <option value="BREAKFAST">🌅 Breakfast</option>
                      <option value="LUNCH">🌞 Lunch</option>
                      <option value="SNACKS">🍪 Snacks</option>
                      <option value="DINNER">🌙 Dinner</option>
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

          {/* Reviews List */}
          <div className="mb-3">
            <Badge bg="primary">Total Reviews: {filteredReviews.length}</Badge>
          </div>

          {filteredReviews.length === 0 ? (
            <Alert variant="info">
              {reviews.length === 0
                ? "No reviews have been submitted yet."
                : "No reviews found matching the current filters."}
            </Alert>
          ) : (
            <Row>
              {filteredReviews.map((review) => (
                <Col md={6} lg={4} key={review.id} className="mb-4">
                  <Card className="h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Badge bg="secondary">
                          {getMealTypeIcon(review.mealType)} {review.mealType}
                        </Badge>
                        <Badge bg={getRatingColor(review.rating)}>{getRatingStars(review.rating)}</Badge>
                      </div>

                      <Card.Title className="h6">
                        By: {review.user?.name || review.user?.email || "Anonymous"}
                      </Card.Title>

                      <Card.Text className="small text-muted">
                        📅 {new Date(review.reviewDate).toLocaleDateString()}
                        {review.reviewDateTime && (
                          <span className="ms-2">🕐 {new Date(review.reviewDateTime).toLocaleTimeString()}</span>
                        )}
                      </Card.Text>

                      {review.comments && <Card.Text>"{review.comments}"</Card.Text>}

                      {review.image && (
                        <div className="text-center">
                          <Badge bg="info">📷 Image Attached</Badge>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ViewReviews
