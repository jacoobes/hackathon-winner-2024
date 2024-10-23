import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom'; // Import Routes component
import { useAuth } from './useAuth.jsx'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes> {/* Wrap Route components in Routes */}
            <Route path="/" element={<div>Hello</div>}/>
      </Routes>
    </Router>
  );
};


export default App;
