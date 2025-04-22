import { useEffect, useMemo, useState } from 'react';
import { Container, Table, Form, Button, Row, Col, Card, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';

import TextTruncate from '../extra/TextTruncate';
import AddInventoryModal from './components/AddInventoryModal';
import EditInventoryModal from './components/EditInventoryModal';
import axios from 'axios';
import { io } from 'socket.io-client';
import PaginationControls from '../extra/Paginations';

function InventoryScreen({ handleAskButton }) {
  const [items, setItems] = useState([]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newItem, setNewItem] = useState({
    item_name: '',
    category: '',
    quantity: 1,
    status: 'New',
    serial_number: ''
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_INVENTORY_ITEM}`);
      setItems(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateInventory', () => {
      fetchData();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [search, statusFilter, itemsPerPage]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch =
        item.item_name.toLowerCase().includes(search.toLowerCase()) ||
        item.serial_number.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Memoized paginated items
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (item) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_CREATE_INVENTORY_ITEM}`, item);
      if (response.data.success) {
        setCurrentPage(currentPage);
        setShowAddModal(false);
        // fetchData(); // Refresh list
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async (item) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_UPDATE_INVENTORY_ITEM}/${item.id}`, item);
      if (response.data.success) {
        setCurrentPage(currentPage);
        setShowEditModal(false);
        // fetchData(); // Refresh list
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleSave = (updatedItem) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Pagination logic
  const handlePageSizeChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <Container className="p-0 y-0" fluid>
      <Card className='p-1'>
        <h1 className="mb-4 text-center">Inventory Management</h1>

        <Row className="mb-3 p-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search item name, serial number, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Old">Old</option>
              <option value="Restored">Restored</option>
            </Form.Select>
          </Col>
          <Col md={3} className="d-flex justify-content-end align-items-center">
            <Button variant='dark' onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus-circle me-2"></i> Add New Item
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover responsive className='mb-0'>
          <thead className='table-dark'>
            <tr>
              <th>#ID</th>
              <th>Serial Number</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th className='text-center'>Status</th>
              <th className='text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.serial_number}</td>
                  {/* <td><TextTruncate text={item.item_name} maxLength={10} /></td> */}
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Ask about this item</Tooltip>}
                    >
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          handleAskButton(

                            `What is the purpose or use of this item: "${item.item_name}"${item.serial_number
                              ? ` with serial number ${item.serial_number}`
                              : ''
                            }, category: ${item.category}, status: ${item.status}, quantity: ${item.quantity}?`

                          )
                        }
                      >
                        <TextTruncate text={item.item_name} maxLength={10} />
                      </span>
                    </OverlayTrigger>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td className='text-center'>{item.status}</td>
                  <td className="text-center">
                    <Button variant="warning" size="sm" className="me-2 mb-1" onClick={() => handleEdit(item)}>
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button variant="danger" size="sm" className="me-2 mb-1" onClick={() => handleDelete(item.id)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No records found.</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination controls */}
        <PaginationControls
          filteredReports={filteredItems}
          pageSize={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handlePageSizeChange={handlePageSizeChange}
        />
      </Card>

      <AddInventoryModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        newItem={newItem}
        handleChange={handleAddChange}
      />

      <EditInventoryModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSave={handleEditSubmit}
        item={selectedItem || newItem}
        handleChange={handleEditChange}
      />
    </Container>
  );
}

export default InventoryScreen;
