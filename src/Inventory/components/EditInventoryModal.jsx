import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function EditInventoryModal({ show, onHide, onSave, item, handleChange }) {
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

  // Check if the item category is in the options, if not, add it to the list
  const updatedCategoryOptions = categoryOptions.includes(item.category)
    ? categoryOptions
    : [...categoryOptions, item.category];

  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (item.category === "Other") {
      setCustomCategory(item.customCategory || ''); // If the category is 'Other', use the customCategory value
    } else {
      setCustomCategory('');
    }
  }, [item.category, item.customCategory]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === 'Other') {
      // If 'Other' is selected, keep the custom category input active
      setCustomCategory(item.customCategory || '');
    } else {
      setCustomCategory('');
    }

    // Update category in item object directly if 'Other' is selected
    handleChange(e);
  };

  // Update the item object with the custom category before saving
  const handleSave = (e) => {
    e.preventDefault();

    if (item.category === "Other" && customCategory) {
      // If "Other" is selected and there's a custom category, set the category to the custom value
      item.category = customCategory;
    }

    // Pass the updated item object to the onSave function
    onSave(item);
  };

  return (
    <Modal show={show} onHide={onHide} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Edit Inventory Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3" controlId="item_name">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              name="item_name"
              value={item.item_name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="category"
              value={item.category}
              onChange={handleCategoryChange}
              required
            >
              {updatedCategoryOptions.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Show custom category input if 'Other' is selected */}
          {item.category === "Other" && (
            <Form.Group className="mb-3" controlId="custom_category">
              <Form.Label>Custom Category</Form.Label>
              <Form.Control
                type="text"
                name="customCategory"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  // Optionally update the main item object directly if needed
                }}
                placeholder="Enter custom category"
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3"  controlId="quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={item.status}
              onChange={handleChange}
              required
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Old">Old</option>
              <option value="Restored">Restored</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="serial_number">
            <Form.Label>Serial Number (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="serial_number"
              value={item.serial_number}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditInventoryModal;
