import React from 'react';
import './Pagination.css'; // Import the updated CSS for pagination

const Pagination = ({ paginate, currentPage, totalItems, itemsPerPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const createPageRange = (current, total) => {
    const range = [];
    const rangeSize = 5;

    let start = Math.max(1, current - Math.floor(rangeSize / 2));
    let end = Math.min(total, current + Math.floor(rangeSize / 2));

    if (end - start < rangeSize - 1) {
      start = Math.max(1, end - rangeSize + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const pageRange = createPageRange(currentPage, totalPages);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      paginate(page);
    }
  };

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo; Previous
      </button>
      {currentPage > 1 && (
        <>
          {currentPage > 2 && totalPages > 5 && (
            <button className="pagination-button" onClick={() => handlePageChange(1)}>
              1
            </button>
          )}
          {currentPage > 3 && totalPages > 5 && (
            <span className="pagination-ellipsis">...</span>
          )}
        </>
      )}
      {pageRange.map((number) => (
        <button
          key={number}
          className={`pagination-button ${currentPage === number ? 'active' : ''}`}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </button>
      ))}
      {currentPage < totalPages - 1 && (
        <>
          {currentPage < totalPages - 2 && totalPages > 5 && (
            <span className="pagination-ellipsis">...</span>
          )}
          {currentPage < totalPages && (
            <button className="pagination-button" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          )}
        </>
      )}
      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;
