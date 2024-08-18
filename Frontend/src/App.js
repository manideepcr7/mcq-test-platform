import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import FinishPage from './pages/FinishPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/test/:id" element={<TestPage />} />
        <Route path="/finish" element={<FinishPage />} />
      </Routes>
    </Router>
  );
}

export default App;
