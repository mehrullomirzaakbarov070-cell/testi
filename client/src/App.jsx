import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobDetailPage from './pages/JobDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
    </Routes>
  );
}

export default App;
