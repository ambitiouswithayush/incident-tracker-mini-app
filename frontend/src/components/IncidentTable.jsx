import { Link } from 'react-router-dom';

const IncidentTable = ({ incidents, onView }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'SEV1': return 'severity-sev1';
      case 'SEV2': return 'severity-sev2';
      case 'SEV3': return 'severity-sev3';
      case 'SEV4': return 'severity-sev4';
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'OPEN': return 'status-open';
      case 'MITIGATED': return 'status-mitigated';
      case 'RESOLVED': return 'status-resolved';
      default: return '';
    }
  };

  return (
    <table className="incident-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Service</th>
          <th>Severity</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {incidents.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>No incidents found</td>
          </tr>
        ) : (
          incidents.map((incident) => (
            <tr key={incident.id}>
              <td>{incident.title}</td>
              <td>{incident.service}</td>
              <td>
                <span className={`severity-badge ${getSeverityClass(incident.severity)}`}>
                  {incident.severity}
                </span>
              </td>
              <td>
                <span className={`status-badge ${getStatusClass(incident.status)}`}>
                  {incident.status}
                </span>
              </td>
              <td>{formatDate(incident.createdAt)}</td>
              <td>
                <Link to={`/incident/${incident.id}`} className="view-btn">
                  View
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default IncidentTable;

