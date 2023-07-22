import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import "../styles/login.css";
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [token, setToken] = useContext(UserContext);

    const nagivate = useNavigate();

    const submitLogin = async() => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: JSON.stringify('grant_type=&username='+ email + '&password=' + password + '&scope=&client_id=&client_secret='
            ),
        };

        const response = await fetch("http://localhost:8000/api/token", requestOptions);                      
        const data = await response.json();
        if (!response.ok){
            setErrorMessage(data.detail);
            return false;
        }else{
            setToken(data.access_token);
            console.log("The token is: " + data.access_token);
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if ( submitLogin() )
        {
            nagivate( "/dashboard" );
        }
    }

    // const requestOptions = {
    //     method: "GET",
    //     headers: {"Content-Type": "application/json",
    //                 Authorization: "Bearer " + token,
    //     }
    // };

    // useEffect(() => {                                                   // Was GetMyInfo previously (study this)
    //     fetch("http://localhost:8000/api/show_user/me", requestOptions)
    //     .then(res => {
    //         return res.json();
    //     })                      
    //     .then(data => {
    //         console.log(data);
    //         setFirstName(data.first_name);          //Highlights how we must parse JSON object from fast_api
    //         setLastName(data.last_name);
    //         setRole(data.role);
    //     })
    //     .catch(e => {
    //         console.log("show_me request denied");
    //     })
    // }, []);


   return (
    <div className="column">
        <form className="box" onSubmit={handleSubmit}>
            <h1 className = "title has-text-centered">Login Module w/o styling</h1>
            <div className="field">
                <label className="label">Email Address</label>
                <div className="control">
                    <input type="email" 
                           placeholder="Enter email" 
                           value = {email} 
                           onChange ={(e) => setEmail(e.target.value)} 
                           className = "input_box" 
                           required>
                    </input>
                </div>
            </div>

            <div className="field">
                <label className="label">Password:</label>
                <div className="control">
                    <input type="password" 
                           placeholder="Enter password" 
                           value = {password} 
                           onChange ={(e) => setPassword(e.target.value)} 
                           className = "input_box" 
                           required>
                    </input>
                </div>
            </div>

            <ErrorMessage message = {errorMessage}></ErrorMessage>

            <br></br>
            <button className="button is primary" 
                    type="submit">
                    Login
            </button>

        </form>
    </div>
   )
};

export default Login;