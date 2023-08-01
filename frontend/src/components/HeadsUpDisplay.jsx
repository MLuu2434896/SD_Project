
import { UserContext } from "./UserContext";
import { React, useContext, useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import "../styles/register.css";
import { useNavigate } from "react-router-dom";


const HeadsUpDisplay = () => {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);
    const navigate = useNavigate();

    return(<>
       <div className='menu-container'>
        <div className='relative space-x-4'>
            <button class='link bg-slate-200 p-0 ' onClick = {() => navigate("/projectpage")}>Projects</button>
            <button class='link bg-slate-200 p-0' onClick = {() => navigate("/sprintprogress")}>Sprints</button>
            <button class='link bg-slate-200 p-0' onClick = {() => navigate("/dashboard")}>Summary</button>
            <button class='link bg-slate-200 p-0' onClick = {() => navigate("/peoplepage")}>People</button>
            </div>
        </div> 
    </>)
};

export default HeadsUpDisplay;