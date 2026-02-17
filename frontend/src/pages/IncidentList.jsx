import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIncidents } from '../api';
import IncidentTable from '../components/IncidentTable';

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIncidents(page, 10, search, severity, status, 'createdAt', 'desc');
      setIncidents(data.data);
      setTotalPages(data.pages);
    } catch (err) {
      setError('Failed to fetch incidents. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [page, severity, status]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (page === 1) {
        fetchIncidents();
      } else {
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [search]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="incident-list">
      <div className="header">
        <h1>Incident Tracker</h1>
        <Link to="/create" className="create-btn">Create Incident</Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="filter-select"
        >
          <option value="">All Severities</option>
          <option value="SEV1">SEV1</option>
          <option value="SEV2">SEV2</option>
          <option value="SEV3">SEV3</option>
          <option value="SEV4">SEV4</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="MITIGATED">MITIGATED</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <IncidentTable incidents={incidents} />
          <div className="pagination">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="page-info">Page {page} of {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default IncidentList;

