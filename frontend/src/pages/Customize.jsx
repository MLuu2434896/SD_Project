import React, { useContext } from "react";
import Tasks from "../components/Tasks";
import "../styles/components.css";

const Customize = () => {

  return(
    <div className="scrollbar-hide md:scrollbar-default min-h-screen">
      <div className="pl-20 pt-20">
        <Tasks />
      </div>
    </div>

  )

}

export default Customize;