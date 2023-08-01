import React, { useContext, useEffect, useState} from "react";
import moment from "moment";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";
import AddTaskModal from "./AddTaskModal";

const TasksTable_forPageTwo = ( {token, id} ) => {
 window.sendTaskLength = 0;
 window.sendCompletedLength = 0;

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

  const handleDeleteBtn = async( taskID ) => {
    // Custom Axios config headers.
    const config = {
        headers : {
            Authorization: "Bearer " + token
        }
    };
    
    // Send a delete request with the provided sprint_id to server.
    axios.delete( `http://localhost:8000/api/delete_task/${taskID}`, config )
        .then( ( response ) => {
            console.log( response.data.message );
        })
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
    // Fetch tasks of current sprint everytime we delete something.
    
    console.log("Is this the entity???", id);
    getTasks( id );
  
  };

  const handleCompleteBtn = async( taskID ) => {
    // Send a post request with the provided sprint_id to server.
    axios.put( `http://localhost:8000/api/complete_task/${taskID}` )
        .then( ( response ) => {
            // Fetch tasks of current sprint everytime we delete something.
            getTasks( id );
            console.log( `Successfully updated complete status of ${taskID}` + JSON.stringify( response.data ) );
        })
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
  
  const handleAddTaskModalClose = () => {
    getTasks( id );
    setTask_id( null );
    setIsAddTaskModalActive( !isAddTaskModalActive );
  };

  const handleEditBtn = async ( taskID ) => {
    setTask_id( taskID );
    setIsAddTaskModalActive( true );
  };


  useEffect( () => {
    if( id ){
        getTasks( id );
    }
}, [ id, token ] )

  return(
    <>
      <ErrorMessage message = {errorMessage}/>
      {loaded && tasks ? (
        <div className="max-h-56 pl-10">
          <div className=" relative overflow-x-auto sm:rounded-lg grid-flow-col grid-rows-2 grid gap-11"> 
            <table className=" table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400 row-span-1 row-start-1">
            <thead className="underline text-gray-700 uppercase  dark:text-black text-lg">
                  <tr>
                    {/* <th>Task ID</th>
                    <th scope="col" className="px-6 py-3">Task Name</th> */}
                    <th>Completed Tasks</th>
                    {/* <th scope="col" className="px-6 py-3">Task Status</th> */}
                    {/* <th scope="col" className="px-6 py-3">
                        <span className="sr-only"> Action </span>
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                    { /* Renders all sprints of the current user fetched from URL */}              
                    { tasks.filter((task) => (task.is_complete == 1)).map( ( task ) => (
                        console.log("True task length: ", tasks.length),
                        window.sendTaskLength = tasks.length,
                        window.sendCompletedLength = tasks.filter((task) => (task.is_complete == 1)).length,
                        <tr className=" text-white"
                            key={ task.task_id }>
                              {/* {console.log(tasks.filter((task) => (task.is_complete == 0)).length)} */}
                            {/* <th scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                { task.task_id }
                            </th> */}
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black text-base">
                                { task.task_name }
                            </td>
                            {/* <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                { task.task_info }
                              </td>     */}
                            {/* <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                { task.is_complete }
                            </td> */}
                            {/* <td className="px-6 py-4 text-right">
                              <button type="button"
                                      className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
                                      onClick={ () => handleCompleteBtn( task.task_id ) }
                                      >
                                      Complete
                              </button>
                            </td>          */}
                        </tr>
                    ))}
                </tbody>

              </table>
            </div>
        </div>
      ): <p>Loading...</p>}
        <AddTaskModal isActive={ isAddTaskModalActive }
          onClose={ handleAddTaskModalClose }
          token={ token }
          setErrorMessage={ setErrorMessage }
          sprint_id={ id }
          task_id={ task_id }>
        </AddTaskModal>     
    </>
  )
}

export default TasksTable_forPageTwo;