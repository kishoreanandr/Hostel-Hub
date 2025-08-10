"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Alert, Badge, Button, Modal } from "react-bootstrap"
import axios from "axios"

const ViewReviews = () => {
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
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

  const handleImageClick = (imagePath) => {
    setSelectedImage(`http://localhost:8080/api/reviews/image/${imagePath}`)
    setShowImageModal(true)
  }

  const handleCloseImageModal = () => {
    setShowImageModal(false)
    setSelectedImage(null)
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

                      {review.imagePath && (
                        <div className="text-center mt-3">
                          <div className="mb-2">
                            <img 
                              src={`http://localhost:8080/api/reviews/image/${review.imagePath}`}
                              alt="Review thumbnail"
                              className="img-thumbnail"
                              style={{ 
                                maxWidth: '100px', 
                                maxHeight: '100px',
                                cursor: 'pointer'
                              }}
                              onClick={() => handleImageClick(review.imagePath)}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                          <Button 
                            variant="outline-info" 
                            size="sm"
                            onClick={() => handleImageClick(review.imagePath)}
                            className="w-100"
                          >
                            📷 View Full Image
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Image Modal */}
          <Modal show={showImageModal} onHide={handleCloseImageModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Review Image</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              {selectedImage && (
                <img 
                  src={selectedImage} 
                  alt="Review" 
                  className="img-fluid" 
                  style={{ maxHeight: '70vh' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              )}
              <div style={{ display: 'none' }} className="text-muted">
                Image not available
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseImageModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  )
}

export default ViewReviews
