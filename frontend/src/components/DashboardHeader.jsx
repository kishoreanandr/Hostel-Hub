import React from "react";
import { InputGroup, FormControl, Row, Col } from "react-bootstrap";
import { Search } from "lucide-react";

export default function DashboardHeader() {
  return (
    <Row className="mb-4">
      <Col md={6}>
        <h3 className="mb-0">Dashboard</h3>
      </Col>
      <Col md={6}>
        <InputGroup>
          <FormControl placeholder="Search..." />
          <InputGroup.Text>
            <Search />
          </InputGroup.Text>
        </InputGroup>
      </Col>
    </Row>
  );
}
