import React, { useContext } from "react";
import { UserContext } from "../components/UserContext";
import { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import { BrowserRouter, Routes, Route } from "react-router-dom";


const EntryPage = (token) => {                              //This is a nonfunctional Prototype. Consider this a template - JM
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [role, setRole] = useState("");

    const GetMyInfo = async() => {
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type": "application/json",
                       Authorization: "Bearer " + token,
            }
        };

        const response = await fetch("http://localhost:8000/api/show_user/me", requestOptions);                      
        const data = await response.json();                                                       //Returns either an empty string (success) or an error message

        console.log(data);
        setFirstName(data.first_name);          //Highlights how we must parse JSON object from fast_api
        setLastName(data.last_name);
        setRole(data.role);

   return(
        <h1> Welcome {data.first_name} {lastname} </h1> 
        //<button onClick={(e)=> (setToken(null)}> Logout Button </button>
    )
   }
}

export default EntryPage;