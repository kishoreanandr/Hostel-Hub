"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"

const UserDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalReviews: 0,
    recentReviews: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      const response = await axios.get("/api/reviews")
      const allReviews = response.data

      // Filter reviews by current user (if user info is available in reviews)
      const userReviews = allReviews.filter((review) => review.user && review.user.email === user.email)

      setStats({
        totalReviews: userReviews.length,
        recentReviews: userReviews.slice(0, 3), // Get last 3 reviews
      })
    } catch (error) {
      setError("Failed to load dashboard data")
      console.error("Error fetching user stats:", error)
    } finally {
      setLoading(false)
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
          <h2 className="mb-4">Welcome, {user.name || user.email}! 👋</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Quick Actions */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <Card.Title>📝 Submit New Review</Card.Title>
                  <Card.Text>Share your experience about today's meals</Card.Text>
                  <Button as={Link} to="/submit-review" variant="primary">
                    Submit Review
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <Card.Title>👀 View All Reviews</Card.Title>
                  <Card.Text>Browse reviews from all students</Card.Text>
                  <Button as={Link} to="/view-reviews" variant="outline-primary">
                    View Reviews
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Stats */}
          <Row className="mb-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Card.Title>📊 Your Review Statistics</Card.Title>
                  <Row>
                    <Col md={4} className="text-center">
                      <h3 className="text-primary">{stats.totalReviews}</h3>
                      <p>Total Reviews Submitted</p>
                    </Col>
                    <Col md={4} className="text-center">
                      <h3 className="text-success">
                        {stats.recentReviews.length > 0
                          ? Math.round(
                              (stats.recentReviews.reduce((sum, review) => sum + review.rating, 0) /
                                stats.recentReviews.length) *
                                10,
                            ) / 10
                          : 0}
                      </h3>
                      <p>Average Rating Given</p>
                    </Col>
                    <Col md={4} className="text-center">
                      <h3 className="text-info">
                        {stats.recentReviews.length > 0
                          ? new Date(stats.recentReviews[0].reviewDate).toLocaleDateString()
                          : "N/A"}
                      </h3>
                      <p>Last Review Date</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Reviews */}
          {stats.recentReviews.length > 0 && (
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>📋 Your Recent Reviews</Card.Title>
                    {stats.recentReviews.map((review, index) => (
                      <div key={review.id || index} className="border-bottom py-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6>
                              {getMealTypeIcon(review.mealType)} {review.mealType}
                              <span className="ms-2">{getRatingStars(review.rating)}</span>
                            </h6>
                            <p className="mb-1 text-muted small">{new Date(review.reviewDate).toLocaleDateString()}</p>
                            {review.comments && <p className="mb-0">{review.comments}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="text-center mt-3">
                      <Button as={Link} to="/view-reviews" variant="outline-primary" size="sm">
                        View All Reviews
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default UserDashboard
