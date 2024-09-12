import React from 'react';

const LogRow = ({ log, handleCheckboxChange, selectedRows }) => (
  <tr>
    <td>
      <input
        type="checkbox"
        checked={selectedRows.has(log._id)}
        onChange={() => handleCheckboxChange(log._id)}
      />
    </td>
    <td>{log._id}</td>
    <td>{log.expression}</td>
    <td>{log.isValid ? 'Yes' : 'No'}</td>
    <td>{log.output}</td>
    <td>{new Date(log.createdOn).toLocaleString()}</td>
  </tr>
);

export default LogRow;
