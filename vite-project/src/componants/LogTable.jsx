import React from 'react';
import LogRow from './LogRow';
import Pagination from './Pagination';

const LogTable = ({ logs, handleCheckboxChange, selectedRows, handleSelectAll, filters, handleFilterChange, paginate, currentPage, filteredLogs, itemsPerPage }) => (
  <div className="log-table-container">
    <table className="log-table">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              className='checkbox-input'
              onChange={handleSelectAll}
              checked={filteredLogs.length > 0 && selectedRows.size === filteredLogs.length}
            />
          </th>
          {['_id', 'expression', 'isValid', 'output', 'createdOn'].map(column => (
            <th key={column}>
              {column.replace(/([A-Z])/g, ' $1').toUpperCase()}
              <input
                type="text"
                className='filter-input'
                placeholder={`Filter ${column}`}
                value={filters[column]}
                onChange={(e) => handleFilterChange(e, column)}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {logs.map(log => (
          <LogRow
            key={log._id}
            log={log}
            handleCheckboxChange={handleCheckboxChange}
            selectedRows={selectedRows}
          />
        ))}
      </tbody>
    </table>
    <Pagination
      paginate={paginate}
      currentPage={currentPage}
      totalItems={filteredLogs.length}
      itemsPerPage={itemsPerPage}
    />
  </div>
);

export default LogTable;
