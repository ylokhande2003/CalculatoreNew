import React, { useState } from 'react';
import Pagination from '../componants/Pagination';
import './custome.css';

const CustomTable = ({ columns, dataSource, rowSelection, pagination }) => {
  const [currentPage, setCurrentPage] = useState(pagination.current || 1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState({});
  const [searchVisible, setSearchVisible] = useState({}); // State to handle visibility of search input

  const itemsPerPage = pagination.pageSize || 10;

  const handleRowSelect = (key) => {
    const newSelectedRowKeys = selectedRowKeys.includes(key)
      ? selectedRowKeys.filter((selectedKey) => selectedKey !== key)
      : [...selectedRowKeys, key];

    setSelectedRowKeys(newSelectedRowKeys);
    rowSelection.onChange(newSelectedRowKeys);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelectedRowKeys = paginatedData.map((item) => item.key);
      setSelectedRowKeys(newSelectedRowKeys);
      rowSelection.onChange(newSelectedRowKeys);
    } else {
      setSelectedRowKeys([]);
      rowSelection.onChange([]);
    }
  };

  const handleSearchChange = (e, dataIndex) => {
    const value = e.target.value.toLowerCase();
    setSearchText({ ...searchText, [dataIndex]: value });
  };

  const toggleSearchVisibility = (dataIndex) => {
    setSearchVisible((prev) => ({ ...prev, [dataIndex]: !prev[dataIndex] }));
  };

  const filteredData = dataSource.filter((item) =>
    columns.every((col) =>
      item[col.dataIndex]
        ? item[col.dataIndex]
            .toString()
            .toLowerCase()
            .includes(searchText[col.dataIndex] || '')
        : true
    )
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedRowKeys.includes(item.key));

  return (
    <div className="custom-table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {rowSelection && (
              <th>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((col) => (
              <th key={col.dataIndex}>
                <div className="header-title-container">
                  {col.title}
                  <button
                    className="search-button"
                    onClick={() => toggleSearchVisibility(col.dataIndex)}
                  >
                  🔍
                  </button>
                </div>
                {searchVisible[col.dataIndex] && (
                  <input
                    type="text"
                    placeholder={`Search ${col.title}`}
                    value={searchText[col.dataIndex] || ''}
                    onChange={(e) => handleSearchChange(e, col.dataIndex)}
                    className="search-input"
                    onBlur={() => setSearchVisible((prev) => ({ ...prev, [col.dataIndex]: false }))}
                    autoFocus
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.key}>
              {rowSelection && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRowKeys.includes(item.key)}
                    onChange={() => handleRowSelect(item.key)}
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.dataIndex}>{item[col.dataIndex]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        paginate={setCurrentPage}
        currentPage={currentPage}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default CustomTable;
