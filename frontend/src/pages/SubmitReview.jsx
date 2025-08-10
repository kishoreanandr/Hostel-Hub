"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const SubmitReview = () => {
  const [formData, setFormData] = useState({
    mealType: "",
    rating: 5,
    comments: "",
    image: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({
        ...formData,
        image: e.target.files[0],
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const submitData = new FormData()
      submitData.append("mealType", formData.mealType)
      submitData.append("rating", formData.rating)
      submitData.append("comments", formData.comments)
      if (formData.image) {
        submitData.append("image", formData.image)
      }

      await axios.post("/api/reviews/submit", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setSuccess("Review submitted successfully!")
      setTimeout(() => {
        alert("Confirmation Email has sent!..")
        navigate("/dashboard")
      }, 2000)
    } catch (error) {
      setError(error.response?.data || "Failed to submit review")
      console.error("Error submitting review:", error)
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

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <h3>📝 Submit Food Review</h3>
              </Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Meal Type *</Form.Label>
                  <Form.Select name="mealType" value={formData.mealType} onChange={handleChange} required>
                    <option value="">Select meal type</option>
                    <option value="BREAKFAST">🌅 Breakfast</option>
                    <option value="LUNCH">🌞 Lunch</option>
                    <option value="SNACKS">🍪 Snacks</option>
                    <option value="DINNER">🌙 Dinner</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Rating * ({formData.rating}/5)</Form.Label>
                  <Form.Range name="rating" min="1" max="5" value={formData.rating} onChange={handleChange} />
                  <div className="text-center mt-2">
                    <span style={{ fontSize: "1.5rem" }}>
                      {"⭐".repeat(formData.rating)}
                      {"☆".repeat(5 - formData.rating)}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Comments</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    placeholder="Share your thoughts about the food quality, taste, presentation, etc."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Upload Image (Optional)</Form.Label>
                  <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} />
                  <Form.Text className="text-muted">Upload a photo of your meal (JPG, PNG, etc.)</Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" disabled={loading} size="lg">
                    {loading ? "Submitting..." : "Submit Review"}
                  </Button>
                  <Button variant="outline-secondary" onClick={() => navigate("/dashboard")}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SubmitReview
