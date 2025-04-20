import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function AddInventoryModal({ show, onHide, onSubmit, newItem, handleChange }) {
  const [customCategory, setCustomCategory] = useState(false);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    handleChange(e); // Update the newItem state from parent
    setCustomCategory(selected === 'Other');
  };

  const categoryOptions = [
    "Computers",
    "Monitors",
    "Keyboards",
    "Mice",
    "Printers",
    "Networking",
    "Software",
    "Cables & Accessories",
    "Office Equipment",
    "Furniture",
    "Other"
  ];

  return (
    <Modal show={show} onHide={onHide} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Add New Inventory Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => {
          e.preventDefault();

          const finalItem = {
            ...newItem,
            category: newItem.category === "Other" ? newItem.customCategory : newItem.category,
          };

          onSubmit(finalItem);
        }}>

          <Form.Group className="mb-3" controlId="item_name">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              name="item_name"
              value={newItem.item_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={newItem.category}
              onChange={handleCategoryChange} // ← Update this!
              required
            >
              <option value="">Select Category</option>
              {categoryOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </Form.Select>
          </Form.Group>


          {newItem.category === "Other" && (
            <Form.Group className="mb-3" controlId="customCategory">
              <Form.Label>Specify Category</Form.Label>
              <Form.Control
                type="text"
                name="customCategory"
                value={newItem.customCategory || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}


          <Form.Group className="mb-3" controlId="quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={newItem.status}
              onChange={handleChange}
              required
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Old">Old</option>
              <option value="Restored">Restored</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="serial_number">
            <Form.Label>Serial Number (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="serial_number"
              value={newItem.serial_number}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit">
            Add Item
          </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddInventoryModal;
