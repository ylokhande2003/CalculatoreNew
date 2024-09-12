// src/components/LogsTable.js
import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Table } from "antd";
import axios from 'axios';
import { useSelector } from 'react-redux';

const LogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const auth = useSelector(state => state.auth);
  const token = auth.token;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logs', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setLogs(response.data);
        setFilteredLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, [token]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
  });

  const columns = [
    {
      title: "_id",
      dataIndex: "_id",
      ...getColumnSearchProps("_id"),
    },
    {
      title: "isValid",
      dataIndex: "isValid",
      ...getColumnSearchProps("isValid"),
    },
    {
      title: "Expression",
      dataIndex: "expression",
      ...getColumnSearchProps("expression"),
    },
    {
      title: "Output",
      dataIndex: "output",
      ...getColumnSearchProps("output"),
    },
    {
      title: "Created On",
      dataIndex: "createdOn",
      ...getColumnSearchProps("createdOn"),
    },
  ];

  const handleCheckboxChange = (selectedRowKeys) => {
    setSelectedRows(selectedRowKeys);
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one log to delete.');
      return;
    }

    try {
      await axios.delete('/api/logs', { 
        headers: { 'Authorization': `Bearer ${token}` },
        data: { ids: selectedRows } 
      });
      // Fetch updated logs after deletion
      const response = await axios.get('/api/logs', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setLogs(response.data);
      setFilteredLogs(response.data);
      setSelectedRows([]); // Clear selection after deletion
    } catch (error) {
      console.error('Error deleting logs:', error);
    }
  };

  return (
    <div>
      <Button className="danger" type="danger" onClick={handleDelete} disabled={selectedRows.length === 0}>
        Delete Selected
      </Button>
      <Table
        rowSelection={{
          type: "checkbox",
          onChange: handleCheckboxChange,
        }}
        columns={columns}
        dataSource={filteredLogs.map((log) => ({
          key: log._id,
          ...log,
        }))}
        pagination={{
          current: currentPage,
          pageSize: itemsPerPage,
          total: filteredLogs.length,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
};

export default LogsTable;
