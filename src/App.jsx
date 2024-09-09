// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import AdminPanel from './components/AdminPanel';
import Login from './Login';
import AdminPanel from './AdminPanel';
// import ManageAccommodations from './components/ManageAccommodations';
// import ManageReservations from './components/ManageReservations';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPanel/>} />

        {/* <Route path="/admin" element={<AdminPanel />}>
          <Route path="accommodations" element={<ManageAccommodations />} />
          <Route path="reservations" element={<ManageReservations />} />
        </Route>
        <Route path="/" element={<Login />} /> */}
      </Routes>
    </Router>
  );
};

export default App;

