import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { UserContext } from "../components/UserContext";
import React, { useContext } from "react";
import "../styles/login.css";



const Home = () => {
    const [token, setToken] = useContext(UserContext);              //This checks to see if there's currently a login
    const navigate = useNavigate();

    useEffect( () => {
        if (token){
            console.log("There is a user logged in");
        }
        else{
            console.log("There is no user logged in");
        }
    }, [token] );

    return (
        <div>
            <div className="text-center">
                <h1 className='Header text-[#dc2626] text-3xl font-bold hover:underline hover:text-[#fbbf24]'>
                    Welcome to Trackage where we definitely care about our project!  </h1>
                    <br />
                    <div>
                        <h3 className="text-3xl font-bold underline"> We currently have 4 paths:</h3>
                    <h4 className="text-1xl font-bold underline">
                        1. "/" which renders Home (this page: Home)
                        <br></br>
                        2. "/login" which renders Tofu's Login Page template (LoginPage)
                        <br></br>
                        3. "/loginModule" which renders White_Mages functional login module (Login)
                        <br></br>
                        4. "/DBTesting" which renders White_Mages Fast API access point (limited to api/show_users)
                        <br />
                        5. "/reg" which renders White_Mages functional user registration module (Register) 
                        <br />
                        6. "/chart" which will show just the burndown chart
                        <br></br>
                        7.  "/sprintpro" which will show just the sprint progress bar
                        <br></br>
                        8. "/tasks" which will show just the tasks element
                        <br></br>
                        9. "/progressbar" which will show the progress bar component
                        </h4>
                    </div>
            </div>

            <br></br>
            <hr></hr>

            <div className="grid grid-cols-1 content-start bg-gray-50 gap-4"> 
            { /* Log in Button - will navigate user to "/login" if clicked */ }
                <button className="LoginBtn"
                        type="button"
                        onClick={ () => { navigate( "/login" ) } }>
                        Log in 
                </button>

                <br></br>

            { /* Register Button - will navigate user to "/register" if clicked */ }
                <button className="RegisterBtn"
                        type="button"
                        onClick={ () => { navigate( "/register" ) } }>
                        Register
                </button>
            </div>
        </div>
        
    );
}
export default Home;