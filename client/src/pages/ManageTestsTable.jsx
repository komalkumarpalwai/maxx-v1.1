import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ManageTestsTable = () => {
  const [registrationOptions, setRegistrationOptions] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrationOptions();
    fetchTests();
  }, []);

  const fetchRegistrationOptions = async () => {
    try {
      const res = await api.get('/api/meta/registration-options');
      setRegistrationOptions(res.data.options || []);
    } catch (err) {
      setError('Failed to fetch registration options');
    }
  };

  const fetchTests = async () => {
    try {
      const res = await api.get('/api/tests?all=1');
      setTests(res.data.tests || []);
    } catch (err) {
      setError('Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h2>Manage Tests</h2>
      <h3>Registration Options</h3>
      <ul>
        {registrationOptions.map((opt, idx) => (
          <li key={idx}>{opt}</li>
        ))}
      </ul>
      <h3>All Tests</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {tests.map(test => (
            <tr key={test._id}>
              <td>{test.title}</td>
              <td>{test.status}</td>
              <td>{new Date(test.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTestsTable;
