import React, { useContext, useEffect, useState} from "react";
import moment from "moment";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";

const SprintProgress = ( {token, id} ) => {

    const [filled, setFilled] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
    const [taskLength, setTL] = useState(0);
	useEffect(() => {
		if (filled < 100 && isRunning) {
			setTimeout(() => setFilled(prev => prev += 2), 50)
		}
	},[filled, isRunning])

    console.log("This is sprint ID", id);
    const [tasks, setTasks] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    // State to control add task modal.
    const [ isAddTaskModalActive, setIsAddTaskModalActive ] = useState( false );
  
    // State to save task_id.
    const [ task_id, setTask_id ] = useState( null );
  
  
    const getTasks = async( sprint_id ) => {
      // Custom Axios config headers.
      const config = { 
          headers: {
              Authorization: "Bearer " + token
          }
      };
      // Send a get request to get all the tasks assco. with the given sprint_id.
      axios.get( `http://localhost:8000/api/show_tasks/${sprint_id}` , config )
          .then( ( response ) => { 
              setTasks( response.data );
              setLoaded( true );
              // if ( response.data.length > 0 ) console.log( response.data );
              // else console.log( "Sprint does not have any tasks!" );
          } )
          
          .catch( ( error ) => { 
              // Received a response from server but not the right format.
              if( error.response ){
                  console.log( error.response.status );
                  console.log( error.response.statusText );
                  setErrorMessage( error.response.statusText );
              } 
              // Didn't receive a response, server-side issues.
              else if( error.request ){
                  console.log( error.request );
                  setErrorMessage( "Something went wrong with the server" );
              }
              // Something is wrong with Axios Config.
              else {
                  console.log( error.message );
                  setErrorMessage( "Something went wrong with Axios" );
              }
          });
    };

    useEffect( () => {
        if( id ){
            getTasks( id );
            //console.log("WATCH THIS", tasks.length);
        }
    }, [ id, token ] )

    return(
        <>
        <div>
            {console.log("Completed Tasks", window.sendCompletedLength)}
            {console.log("ALL Tasks", window.sendTaskLength)}
		  <div className="progressbar">
			  <div style={{
				  height: "100%",
				  width: `${(window.sendCompletedLength/window.sendTaskLength)*100}%`,
				  backgroundColor: "#907e94",
				  transition:"width 0.5s"   
			  }}></div>
			  <span className="progressPercent">{ (window.sendCompletedLength/window.sendTaskLength)*100 }%</span>
		  </div>
	    </div>
        </>
    )
}
 export default SprintProgress;