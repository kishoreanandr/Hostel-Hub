import React from "react";
import { Card } from "react-bootstrap";

const StatCard = ({ icon: Icon, title, count, color }) => {
  return (
    <Card className="shadow-sm text-white" style={{ backgroundColor: color }}>
      <Card.Body className="d-flex align-items-center justify-content-between">
        <div>
          <h6 className="mb-1">{title}</h6>
          <h4>{count}</h4>
        </div>
        <Icon size={32} />
      </Card.Body>
    </Card>
  );
};

export default StatCard;
