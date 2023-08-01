import React, { useContext } from "react";
import Tasks from "../components/Tasks";
import SprintProgress from "../components/SprintProgress";
import "../styles/components.css";
import SprintTasksModal from "../components/SprintTasksModal";
import TasksTable from "../components/TasksTable";
import Selector from "../components/Selector";

const Experimental = () => {

  return(
    <div className="scrollbar-hide md:scrollbar-default Dashboard bg-gray-200 min-h-screen pl-10 pr-10">
      <div className="pl-20 pt-20">
        <h1>01</h1>
        <Tasks />
      </div>
    </div>

  )

}

export default Experimental;