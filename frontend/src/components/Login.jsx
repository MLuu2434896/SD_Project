import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);


    const submitLogin = async() => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: JSON.stringify('grant_type=&username='+ email + '&password=' + password + '&scope=&client_id=&client_secret='
        ),
    };

        const response = await fetch("http://localhost:8000/api/token", requestOptions);                      
        const data = await response.json;                                                       //Returns either an empty string (success) or an error message

        if (!response.ok){
            setErrorMessage(data.detail);
        }else{
            setToken(data.access_token);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitLogin();
    }

   return(
    <div className="column">
        <form className="box" onSubmit={handleSubmit}>
            <h1 className = "title has-text-centered">Login Module w/o styling</h1>
            <div className="field">
                <label className="label">Email Address</label>
                <div className="control">
                    <input type="email" placeholder="Enter email" value = {email} onChange ={(e) => setEmail(e.target.value)} className = "input_box" required></input>
                </div>
            </div>

            <div className="field">
                <label className="label">Password:</label>
                <div className="control">
                    <input type="password" placeholder="Enter password" value = {password} onChange ={(e) => setPassword(e.target.value)} className = "input_box" required></input>
                </div>
            </div>

            <ErrorMessage message = {errorMessage}></ErrorMessage>

            <br></br>
            <button className="button is primary" type="submit">
                Login Button
            </button>
        </form>
        <br></br>

        Current Form Input Values
        <br></br>
        {email}
        <br />
        {password} 
    </div>
   )
}

export default Login;