import React from "react";
import "../styles/login.css";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Login from "../components/Login";
import { UserContext } from "../components/UserContext";

const Login_page = () => {
    const [token, setToken] = useContext( UserContext );

    return (
    <div>
        <div className="placeholder">
            <h1> This is the login page </h1>
            { /* Redirect to /dashboard if the user is authorized, otherwise 
                show login module */ }
            { !token ? (
                <Login></Login>
            ) : (
                <Navigate to="/dashboard"></Navigate>
            ) }
        </div>
        
    </div>
    )
};
export default Login_page;