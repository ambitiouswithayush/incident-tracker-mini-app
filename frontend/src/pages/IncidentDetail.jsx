import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIncidentById, updateIncident } from '../api';

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editData, setEditData] = useState({
    status: '',
    owner: '',
    summary: '',
  });

  useEffect(() => {
    const fetchIncident = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getIncidentById(id);
        setIncident(data);
        setEditData({
          status: data.status || '',
          owner: data.owner || '',
          summary: data.summary || '',
        });
      } catch (err) {
        setError('Failed to fetch incident details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccessMessage('');
    try {
      const updated = await updateIncident(id, editData);
      setIncident(updated);
      setSuccessMessage('Incident updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update incident.');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error && !incident) {
    return (
      <div className="incident-detail">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/')} className="back-btn">Back to List</button>
      </div>
    );
  }

  return (
    <div className="incident-detail">
      <div className="header">
        <h1>Incident Details</h1>
        <button onClick={() => navigate('/')} className="back-btn">Back to List</button>
      </div>

      {successMessage && <div className="success">{successMessage}</div>}
      {error && <div className="error">{error}</div>}

      <div className="detail-card">
        <div className="detail-row">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{incident.id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Title:</span>
          <span className="detail-value">{incident.title}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Service:</span>
          <span className="detail-value">{incident.service}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Severity:</span>
          <span className="detail-value">{incident.severity}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Created At:</span>
          <span className="detail-value">{formatDate(incident.createdAt)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Updated At:</span>
          <span className="detail-value">{formatDate(incident.updatedAt)}</span>
        </div>
      </div>

      <div className="update-form">
        <h2>Update Incident</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={editData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="OPEN">OPEN</option>
              <option value="MITIGATED">MITIGATED</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="owner">Owner</label>
            <input
              type="text"
              id="owner"
              name="owner"
              value={editData.owner}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              name="summary"
              value={editData.summary}
              onChange={handleChange}
              rows="4"
              className="form-textarea"
            />
          </div>

          <button type="submit" disabled={updating} className="submit-btn">
            {updating ? 'Updating...' : 'Update Incident'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IncidentDetail;

