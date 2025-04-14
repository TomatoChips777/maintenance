// Dashboard.jsx
import React from 'react';
import { Card, Row, Col, Button, Table } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <div>
      <h2 className="mb-4">Borrowing System Dashboard</h2>

      {/* Quick Stats */}
      <Row className="mb-4">
        {[
          { label: "Borrowed Today", value: 12, variant: "primary" },
          { label: "Overdue Returns", value: 5, variant: "danger" },
          { label: "Active Borrowers", value: 28, variant: "success" },
          { label: "Available Items", value: 120, variant: "info" },
        ].map(({ label, value, variant }, index) => (
          <Col key={index} md={3}>
            <Card bg={variant} text="white" className="mb-3 shadow">
              <Card.Body>
                <Card.Title>{value}</Card.Title>
                <Card.Text>{label}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Borrowings */}
      <Card className="mb-4">
        <Card.Header>Recent Borrowing Activity</Card.Header>
        <Card.Body>
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>Item</th>
                <th>Borrower</th>
                <th>Date Borrowed</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Laptop</td>
                <td>Jane Doe</td>
                <td>2025-04-12</td>
                <td>2025-04-15</td>
                <td><span className="badge bg-warning text-dark">Pending</span></td>
              </tr>
              {/* Add more rows dynamically */}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Actions */}
      <div className="d-flex gap-3">
        <Button variant="success">Request Borrow</Button>
        <Button variant="primary">View Inventory</Button>
        <Button variant="secondary">Manage Users</Button>
      </div>
    </div>
  );
};

export default Dashboard;
