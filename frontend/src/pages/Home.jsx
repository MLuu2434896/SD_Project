import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { UserContext } from "../components/UserContext";
import React, { useContext } from "react";
import "../styles/login.css";
import graphPic from "./graph1.png"
/*Yes, this is a bad import.*/


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
            <div className="relative top-5">
                <div className="absolute top-40 w-[40%] left-[11%]">
                    <h1 className='Header text-neutral-950 text-3xl font-bold hover:underline'>
                    Collaboration. Made Simple  </h1>
                    <div>
                        <h3 className="text-neutral-800 text-2xl font-medium text-center">   
                        Organize your sprints for your coworkers. <br></br>
                        Keep track of what needs to be done.</h3>
                        
                    </div></div>
                
                <div className="absolute -top-48 -right-[5%] scale-50"><img src={graphPic} /></div>
            </div>
        </div>
        
    );
}
export default Home;