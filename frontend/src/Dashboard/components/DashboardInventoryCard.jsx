import { Card, Table, Row, Button, Col } from "react-bootstrap";
import { useState } from "react";
function DashboardInventoryCard({ inventoryData }) {

const [inventoryPage, setInventoryPage] = useState(1);
  const itemsPerPage = 5;
    const conditionCounts = inventoryData.reduce((acc, item) => {
        const condition = item.status?.toLowerCase();
        if (condition === 'new') acc.new += 1;
        else if (condition === 'used') acc.used += 1;
        else if (condition === 'old') acc.old += 1;
        else if (condition === 'restored') acc.restored += 1;
        return acc;
    }, { new: 0, used: 0, old: 0, restored: 0 });

    const indexOfLastItem = inventoryPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInventoryItems = inventoryData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(inventoryData.length / itemsPerPage);

    const handlePrevPage = () => {
        if (inventoryPage > 1) setInventoryPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (inventoryPage < totalPages) setInventoryPage(prev => prev + 1);
    };

    
return(
 <Card>
        <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
            Inventory Overview
        </Card.Header>
        <Card.Body>
            <Table responsive bordered hover size="sm">
                <thead className="table-light">
                    <tr>
                        <th>Item</th>
                        <th>Available</th>
                        <th>Total</th>
                        <th className='text-center'>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {inventoryData.map((inv, idx) => ( */}
                    {currentInventoryItems.map((inv, idx) => (
                        <tr key={idx}>
                            <td>{inv.item}</td>
                            <td>{inv.available}</td>
                            <td>{inv.total}</td>
                            <td className='text-center'>{inv.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* New section: condition breakdown */}
            <hr />
            <h6>Item Condition Breakdown:</h6>
            <Row>
                <Col xs={6} md={3}><strong>New:</strong> {conditionCounts.new}</Col>
                <Col xs={6} md={3}><strong>Used:</strong> {conditionCounts.used}</Col>
                <Col xs={6} md={3}><strong>Old:</strong> {conditionCounts.old}</Col>
                <Col xs={6} md={3}><strong>Restored:</strong> {conditionCounts.restored}</Col>
            </Row>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center mt-3">
            <div>
                Page {inventoryPage} of {totalPages}
            </div>
            <div>
                <Button
                    variant="outline-dark"
                    size="sm"
                    className="me-2"
                    disabled={inventoryPage === 1}
                    onClick={handlePrevPage}
                >
                    Previous
                </Button>
                <Button
                    variant="outline-dark"
                    size="sm"
                    disabled={inventoryPage === totalPages}
                    onClick={handleNextPage}
                >
                    Next
                </Button>
            </div>
        </Card.Footer>
    </Card>
);
   
};

export default DashboardInventoryCard;