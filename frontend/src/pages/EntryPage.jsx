import React, { useContext } from "react";
import { UserContext } from "../components/UserContext";
import { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import { BrowserRouter, Routes, Route } from "react-router-dom";


const EntryPage = (token) => {

    const GetMyInfo = async() => {
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify('Authorization: Bearer ' + token),
        };

        const response = await fetch("http://localhost:8000/api/show_user/me", requestOptions);                      
        const data = await response.json();                                                       //Returns either an empty string (success) or an error message

        console.log(data);

   return(
        <h1> Welcome {data[1]} </h1> 
        //<button onClick={(e)=> (setToken(null)}> Logout Button </button>
    )
   }
}

export default EntryPage;