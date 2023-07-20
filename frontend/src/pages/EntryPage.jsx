import React, { useContext } from "react";
import { UserContext } from "../components/UserContext";
import { useState, useEffect } from "react";
import ProjectProgress from "../components/ProjectProgress";
import SprintProgress from "../components/SprintProgress";
import Tasks from "../components/Tasks";
import BurnDownChart from "../components/BurnDownChart";
import "../styles/components.css";
import { Chart as ChartJS} from 'chart.js'
import { Bar } from "react-chartjs-2";


const EntryPage = () => {                              //This is a nonfunctional Prototype. Consider this a template - JM
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [role, setRole] = useState("");
    const [token, setToken] = useContext(UserContext);

   return(
        <div className = "entryPage">
            <br></br>
            <h1> This is entry page </h1>
            <div className = "entryPageTopGuiFlexbox">
                <div className = "topRightGuiElement">
                <SprintProgress></SprintProgress>
                </div>
            </div>
            <br></br>
            <div className = "entryPageBottomGuiFlexbox">
                <div className = "bottomLeftGuiElement">
                    <Tasks></Tasks>
                </div>
                <div className = "bottomRightGuiElement">
                    <BurnDownChart></BurnDownChart>
                </div>
            </div>
        </div>
    )
}

export default EntryPage;