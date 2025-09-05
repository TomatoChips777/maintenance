import React from 'react';
import { Button, Form } from 'react-bootstrap';

const PaginationControls = ({
  filteredReports,
  pageSize,
  currentPage,
  setCurrentPage,
  handlePageSizeChange,
  showPageSizeSelect = true,       // NEW → default: show
  disablePageSizeSelect = false    // NEW → default: enabled
}) => {
  const totalPages = Math.ceil(filteredReports.length / pageSize);

  // Calculate the range of records for the current page
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, filteredReports.length);

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
      <div className="d-flex align-items-center mb-2 mb-md-0">
        {/* Page Size Select (conditionally shown/disabled) */}
        {showPageSizeSelect && (
          <Form.Select
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={disablePageSizeSelect}
            className="me-2 rounded-0"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="30">30 per page</option>
            <option value="40">40 per page</option>
            <option value="50">50 per page</option>
          </Form.Select>
        )}
        <span className="text-muted" style={{ fontSize: '0.79rem' }}>
          Showing {startRecord}-{endRecord} of {filteredReports.length} records
        </span>
      </div>

      {/* Pagination buttons */}
      <nav aria-label="Page navigation">
        <ul className="pagination mb-0 d-flex flex-wrap overflow-auto">
          {/* Previous Button */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <Button
              variant="link"
              className="page-link rounded-0"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
          </li>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <li key={pageNumber} className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}>
                <Button
                  variant="link"
                  className="page-link rounded-0"
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              </li>
            );
          })}

          {/* Next Button */}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <Button
              variant="link"
              className="page-link rounded-0"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PaginationControls;
