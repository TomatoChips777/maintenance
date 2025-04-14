import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row, InputGroup } from 'react-bootstrap';

const dummyInventory = [
  { id: 1, name: 'Laptop', category: 'Electronics', available: true, image: '/assets/laptop.png' },
  { id: 2, name: 'Projector', category: 'Electronics', available: false, image: '/assets/projector.png' },
  { id: 3, name: 'Chair', category: 'Furniture', available: true, image: '/assets/chair.png' },
  { id: 4, name: 'Whiteboard', category: 'Stationery', available: true, image: '/assets/whiteboard.png' },
];

function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const filteredInventory = dummyInventory.filter(item =>
    (category === 'All' || item.category === category) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid>
      <h2 className="mb-4">Inventory Items</h2>

      <Row className="mb-3 align-items-end">
        <Col md={4}>
          <Form.Label>Search by Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Type item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Label>Filter by Category</Form.Label>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>
            <option>Electronics</option>
            <option>Furniture</option>
            <option>Stationery</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-end mt-2">
          <Button variant="success">Request Help</Button>
        </Col>
      </Row>

      <Row>
        {filteredInventory.length === 0 ? (
          <p>No items found.</p>
        ) : (
          filteredInventory.map(item => (
            <Col key={item.id} md={3} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Img variant="top" src={item.image} height="160" style={{ objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    <strong>Category:</strong> {item.category}<br />
                    <strong>Status:</strong>{' '}
                    {item.available ? <span className="text-success">Available</span> : <span className="text-danger">Unavailable</span>}
                  </Card.Text>
                  <Button
                    variant={item.available ? 'primary' : 'secondary'}
                    disabled={!item.available}
                    className="w-100"
                  >
                    {item.available ? 'Request Item' : 'Not Available'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default Inventory;
