import React from "react";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import Login from "../components/Login";

const Home = () => {
    // useState accepts a return type and returns a var in an object & a setter
    const [ object, setObject ] = useState( [] );
    const navigate = useNavigate();

    // Test function to see how frontend fetches data from backend
    useEffect( () => {
        axios.get( "http://localhost:8000" )
            .then( (response) => {
                const data = response.data
                setObject( data ) 
            })
            .catch( (e) => {
                console.log( {e} );
            })
    }, [] );

    // Test function to see how frontend fetches info from backend
    const print_info = (value, idx) => {
        return <p key={idx}> {idx + 1}. {value.f_name} {value.l_name} </p>
    };

    return (
        <>
        <div className="App">
            <h1 className='text-[#dc2626] text-3xl font-bold hover:underline hover:text-[#fbbf24]'>
                FastAPI React
            </h1>
            { object.map( print_info ) }
        </div>
            <button
                type="button"
                className="login_btn"
                onClick={ () => navigate( "/login" ) } >
                Login
            </button>
            <div>
             <Login/>
            </div>
        </>
    );
}
export default Home;