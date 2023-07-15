import './styles/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import DatabaseInterface from './pages/DatabaseInterface';
import Register from './components/Register';
import Login from './components/Login';


function App() {
  return ( 
    <>
    { /* Pre-define paths to all relevant pages */ }
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route exact path="/login" element={<LoginPage/>}></Route>
        <Route exact path="/loginModule" element={<Login/>}></Route>
        <Route exact path="/DBTesting" element={<DatabaseInterface/>}></Route>
        <Route exact path="/reg" element={<Register/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
  
}

export default App;
