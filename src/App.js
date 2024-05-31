import React from "react"
import Main from './Main';
import Ticket from './ticket.js';
import Payment from './Payment.js';


import {BrowserRouter, Routes, Route, Router } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/ticket" element={<Ticket />} />
      <Route path="/payment/:ticketId" element={<Payment />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
