import './styles/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';

function App() {
  return ( 
    <>
    { /* Pre-define paths to all relevant pages */ }
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route exact path="/login" element={<LoginPage/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
  
}

export default App;
