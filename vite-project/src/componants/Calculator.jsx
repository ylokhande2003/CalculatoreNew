import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Table } from 'antd';
import axios from 'axios';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorButton from './CalculatorButton';
import CustomTable from '../custom/CustomTable';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('');
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const token = localStorage.getItem('authToken'); // Retrieve the JWT token from localStorage

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logs', {
          headers: { Authorization: `Bearer ${token}` }
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
      await axios.delete('http://localhost:5000/api/logs', {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: selectedRows }
      });
      // Fetch updated logs after deletion
      const response = await axios.get('http://localhost:5000/api/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data);
      setFilteredLogs(response.data);
      setSelectedRows([]); // Clear selection after deletion
    } catch (error) {
      console.error('Error deleting logs:', error);
    }
  };

  const calculate = async () => {
    if (!display) {
      alert('Expression is empty');
      return;
    }

    let isValid = true;
    let output;
    try {
      output = eval(display);
      setDisplay(output.toString());
    } catch {
      isValid = false;
      output = null;
      alert('Expression is invalid');
    }

    try {
      await axios.post('http://localhost:5000/api/logs', { expression: display, isValid, output }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const response = await axios.get('http://localhost:5000/api/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data);
      setFilteredLogs(response.data);
    } catch (error) {
      console.error('Error logging expression:', error);
    }
  };

  return (
    <div className="container">
      <div className="calculator">
        <CalculatorDisplay display={display} setDisplay={setDisplay} />
        <div>
          <CalculatorButton label="AC" onClick={() => setDisplay('')} />
          <CalculatorButton label="DC" onClick={() => setDisplay(display.slice(0, -1))} />
          <CalculatorButton label="." onClick={() => setDisplay(display + '.')} />
          <CalculatorButton label="/" onClick={() => setDisplay(display + '/')} />
        </div>
        <div>
          <CalculatorButton label="7" onClick={() => setDisplay(display + '7')} />
          <CalculatorButton label="8" onClick={() => setDisplay(display + '8')} />
          <CalculatorButton label="9" onClick={() => setDisplay(display + '9')} />
          <CalculatorButton label="*" onClick={() => setDisplay(display + '*')} />
        </div>
        <div>
          <CalculatorButton label="4" onClick={() => setDisplay(display + '4')} />
          <CalculatorButton label="5" onClick={() => setDisplay(display + '5')} />
          <CalculatorButton label="6" onClick={() => setDisplay(display + '6')} />
          <CalculatorButton label="-" onClick={() => setDisplay(display + '-')} />
        </div>
        <div>
          <CalculatorButton label="1" onClick={() => setDisplay(display + '1')} />
          <CalculatorButton label="2" onClick={() => setDisplay(display + '2')} />
          <CalculatorButton label="3" onClick={() => setDisplay(display + '3')} />
          <CalculatorButton label="+" onClick={() => setDisplay(display + '+')} />
        </div>
        <div>
          <CalculatorButton label="00" onClick={() => setDisplay(display + '00')} />
          <CalculatorButton label="0" onClick={() => setDisplay(display + '0')} />
          <Button className="equal" onClick={calculate}>=</Button>
        </div>
      </div>
      <div className='table'>
        <Button className="danger" type="danger" onClick={handleDelete} disabled={selectedRows.length === 0}>
          Delete Selected
        </Button>
        <CustomTable
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
    </div>
  );
};

export default Calculator;
