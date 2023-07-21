import './styles/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DatabaseInterface from './pages/DatabaseInterface';
import Register from './components/Register';
import Login from './components/Login';
import BurnDownChart from './components/BurnDownChart';
import SprintProgress from './components/SprintProgress';
import Tasks from './components/Tasks';
import { ProgressBar } from './components/ProgressBar';

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
        <Route exact path="/chart" element={<BurnDownChart/>}></Route>
        <Route exact path="/sprintpro" element={<SprintProgress/>}></Route>
        <Route exact path="/tasks" element={<Tasks/>}></Route>
        <Route exact path="/progressbar" element={<ProgressBar/>}></Route>
        <Route exact path="/registerPage" element={<RegisterPage/>}> </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
  
}

export default App;
