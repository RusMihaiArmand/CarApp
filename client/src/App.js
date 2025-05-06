import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from "./Navbar";
import Home from "./Home";
import Command from "./Command";


import './index.css'


import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  const [message, setMessage] = useState('');


  useEffect(() => {
    
    axios.get('http://localhost:5000/api/greet')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error("There was an error fetching the message!", error);
      });
  }, []);

 

  return (
    <Router>
      <div className="mainApp">
        <div className="navbar"><Navbar /></div>

        <div className="rest">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/command" element={<Command />} />
            

          </Routes>
        </div>
      </div>
    </Router>
  );




}

export default App;
