// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ApolloProviderWrapper from './ApolloProvider'; // Import the ApolloProvider


function App() {
  return (
    <ApolloProviderWrapper>

    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </ApolloProviderWrapper>

  );
}

export default App;
