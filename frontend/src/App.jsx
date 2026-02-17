import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IncidentList from './pages/IncidentList';
import CreateIncident from './pages/CreateIncident';
import IncidentDetail from './pages/IncidentDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<IncidentList />} />
          <Route path="/create" element={<CreateIncident />} />
          <Route path="/incident/:id" element={<IncidentDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

