import React, { useContext } from "react";

import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";


const Register = () => {
    const [email, setEmail] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);

    const submitRegistration = async() => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email: email, first_name: firstname, last_name: lastname, hashed_password: password})
        };

            const response = await fetch("http://localhost:8000/api/create_user", requestOptions);                      
            const data = await response.json();                                                       //Returns either an empty string (success) or an error message

            if (!response.ok){
                setErrorMessage(data.detail);
            }else{
                setToken(data.access_token);
            }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.length > 1){
            submitRegistration();
        }
        else{
            setErrorMessage("Ensure the password is greater than 1");
        }
    }

    return(
        <div className="grid place-items-center">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className = "title has-text-centered">Registeration Module w/o styling</h1>
                <div className="field">
                    <label className="label">Email Address</label>
                    <div className="control">
                        <input type="email" placeholder="Enter email" value = {email} onChange ={(e) => setEmail(e.target.value)} className = "input_box" required></input>
                    </div>
                </div>

                <div className="field">
                    <label className="label">First Name:</label>
                    <div className="control">
                        <input type="text" placeholder="Enter 1st name" value = {firstname} onChange ={(e) => setFirstName(e.target.value)} className = "input_box" required ></input>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Last Name:</label>
                    <div className="control">
                        <input type="text" placeholder="Enter last name" value = {lastname} onChange ={(e) => setLastName(e.target.value)} className = "input_box" required></input>
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
                    Register Button
                </button>
            </form>
        </div>
    )
};

export default Register;