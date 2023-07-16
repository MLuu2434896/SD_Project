import React from "react";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const DatabaseInterface = () => {
    // useState accepts a return type and returns a var in an object & a setter
    const [ object, setObject ] = useState( [] );
    const [ query, setQuery ] = useState("");

    const navigate = useNavigate();

    // Test function to see how frontend fetches data from backend
    useEffect( () => {
        axios.get( "http://localhost:8000" + query)
            .then( response => {
                console.log( "The sent message was: http://localhost:8000" + query)
                return response.data;
            })
            .then(data => {
                console.log("The recieved data is: \n")
                console.log(data)
                setObject(data)
            })
            .catch( (e) => {
                console.log( {e} );
            })
    }, [query] );

    // Test function to see how frontend fetches info from backend
    const print_info = (value, idx) => {
        return <p key={idx}> {idx + 1}. {value.email} {value.first_name} {value.last_name} {value.id} </p>
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        setObject(query)
    }

    return (
        <>
        <div className="DatabaseInterface">
            <h1 className='text-[#dc2626] text-3xl font-bold hover:underline hover:text-[#fbbf24]'>
                Database Interface Page
            </h1>
            <div>
                <label> Database Query: </label>
                <form onSubmit = {handleSubmit}>
                <input outlinename="queryInput" type="text" value = {query} 
                className="input_box"
                onChange={(e) => setQuery(e.target.value)}></input>
                <button
                    type="button"
                    className="login_btn"
                    >                
                    Query fetches as typed
            </button>
            </form>
        </div>
      
        <h3>This is your query: </h3>
        <p>{query}</p>
        </div>

        <h1><br></br>Results</h1>   <br></br>
        { object.map( print_info ) }
        </>
        
    );
}
export default DatabaseInterface;