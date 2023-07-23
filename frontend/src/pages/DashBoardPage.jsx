import React, { useContext } from "react";
import { UserContext } from "../components/UserContext";
import SprintProgress from "../components/SprintProgress";
import Tasks from "../components/Tasks";
import BurnDownChart from "../components/BurnDownChart";
import "../styles/components.css";
import { Navigate, useNavigate } from "react-router-dom";


const DashBoardPage = () => {
    const [token, setToken] = useContext(UserContext);
    const navigate = useNavigate()

    const handleLogout = () => {
        setToken( null );
        navigate( "/login" );
    };

   return(
        <div>
            <br></br>
            <h1 className="text-center"> This is the dashboard page </h1>
            <div className="grid place-content-end mr-16">
                <button onClick={ handleLogout }>
                        Logout </button>
            </div>
            {
                !token ? (
                    <Navigate to="/login"></Navigate>
                ) : (
                    <div>
                        <div className = "entryPageTopGuiFlexbox">
                            <div className = "topRightGuiElement">
                                <SprintProgress></SprintProgress>
                            </div>
                        </div>
                        <br></br>
                        <div className = "entryPageBottomGuiFlexbox">
                            <div className = "bottomLeftGuiElement"
                                 onClick={ () => { navigate( "/tasks" ) } }>
                                <Tasks></Tasks>
                            </div>
                            <div className = "bottomRightGuiElement">
                                <BurnDownChart></BurnDownChart>
                            </div>
                        </div>  
                    </div>
                )
                
            }
            
        </div>
    )
}

export default DashBoardPage;