import React, { useContext } from "react";
import { UserContext } from "../components/UserContext";
import SprintProgress from "../components/SprintProgress";
import Tasks from "../components/Tasks";
import BurnDownChart from "../components/BurnDownChart";
import "../styles/components.css";
import { Navigate, useNavigate } from "react-router-dom";
//import Taskbar from "../components/Taskbar";
import BurnDown from "../components/BurnDown";
import Tasks_forPage from "../components/Tasks_forPage";


const TasksPage = () => {
    const [token, setToken] = useContext(UserContext);
    const navigate = useNavigate()

    const handleLogout = () => {
        setToken( null );
        navigate( "/login" );
    };

   return(
        <div >
            {/* <Taskbar /> */}
            <br></br>
            {
                !token ? (
                    <Navigate to="/login"></Navigate>
                ) : (
                    <div className="relative min-h-screen">
                        <div className = "">
                            <Tasks_forPage></Tasks_forPage>
                        </div>
                    </div>
                )
                
            }
            
        </div>

        
    )
}

export default TasksPage;