import React, { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import { Container, Row, Col, Table } from "react-bootstrap";
import { Star, MessageCircle, CheckCircle, FileText } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

export default function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axiosInstance.get("/reviews/get")
      .then(res => setReviews(res.data.slice(-3).reverse())) // Get latest 3 reviews
      .catch(err => console.error("Error fetching reviews", err));

    axiosInstance.get("/complaints/get")
      .then(res => setComplaints(res.data.slice(-3).reverse())) // Get latest 3 complaints
      .catch(err => console.error("Error fetching complaints", err));
  }, []);

  return (
    <Container fluid className="p-4">
      <DashboardHeader />

      <Row className="mb-4">
        <Col md={3}>
          <StatCard icon={Star} title="Total Reviews" count={reviews.length} color="#007bff" />
        </Col>
        <Col md={3}>
          <StatCard icon={MessageCircle} title="Total Complaints" count={complaints.length} color="#dc3545" />
        </Col>
        <Col md={3}>
          <StatCard icon={CheckCircle} title="Resolved Issues" count={complaints.filter(c => c.status === "Resolved").length} color="#28a745" />
        </Col>
        <Col md={3}>
          <StatCard icon={FileText} title="Pending Issues" count={complaints.filter(c => c.status !== "Resolved").length} color="#ffc107" />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <h5>Recent Reviews</h5>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>User</th>
                <th>Hostel</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r, index) => (
                <tr key={index}>
                  <td>{r.username}</td>
                  <td>{r.hostel}</td>
                  <td>{'⭐'.repeat(r.rating)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md={6}>
          <h5>Recent Complaints</h5>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>User</th>
                <th>Issue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, index) => (
                <tr key={index}>
                  <td>{c.username}</td>
                  <td>{c.issue}</td>
                  <td>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
