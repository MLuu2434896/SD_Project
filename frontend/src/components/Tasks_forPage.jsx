import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import axios from "axios";
import moment from "moment";
import AddSprintModal from "./AddSprintModal";
import SprintTasksModal from "./SprintTasksModal";
import TasksTable from "./TasksTable";
import SprintProgress from "./SprintProgress";
import TasksTable_forPage from "./TasksTable_forPage";
import BurnDown from "./BurnDown";
import TasksTable_forPageTwo from "./TasksTable_forPageTwo";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import { Navigate, useNavigate } from "react-router-dom";
//import Taskbar from "../components/Taskbar";

// TODO: Add an error message tag under the table if something went wrong!

const Tasks_forPage = () => {
    var new_date;
    var superID;
    // Getting access token of current user.
    const [ token, _ ] = useContext( UserContext );

    // Error message for axios requests.
    const [ errorMessage, setErrorMessage ] = useState( "" );

    // Sprints of current user.
    const [ sprints, setSprints ] = useState( [] );

    // Request success confirmation.
    const [ isLoaded, setIsLoaded ] = useState( false );

    // Sprint Modal active flag.
    const [ isSprintModalActive, setIsSPrintModalActive ] = useState( false );

    // Task Modal active flag.
    const [ isTaskModalActive, setIsTaskModalActive ] = useState ( false );

    const [ id, setId ] = useState( 8 );

    const [ inputID, setInput] = useState(null);

    const [selectedOption, setSelectedOption] = useState(0);
      
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // Setting up headers and request.
    const getSprintsCurrentUser = async () => {
        // Custom Axios config headers.
        const config = { 
            headers: {
                Authorization: "Bearer " + token
            }
        };
        // Send a get request to server.
        axios.get( "http://localhost:8000/api/show_sprints", config )
            .then( ( response ) => { 
                setSprints( response.data );
                setIsLoaded( true );
                // console.log( response.data );
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
                }
                // Something is wrong with Axios Config.
                else {
                    console.log( error.message );
                    setErrorMessage( "Something went wrong with Axios" );
                }
            });
    }; 

    const handleDeleteSprint = async ( sprint_id ) => {
        // Custom Axios config headers.
        const config = {
            headers : {
                Authorization: "Bearer " + token
            }
        };
        
        // Send a delete request with the provided sprint_id to server.
        axios.delete( `http://localhost:8000/api/delete_sprint/${sprint_id}`, config )
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
                }
                // Something is wrong with Axios Config.
                else {
                    console.log( error.message );
                    setErrorMessage( "Something went wrong with Axios" );
                }
            });
        // Fetch sprints of current user everytime we delete something.
        getSprintsCurrentUser();
    };

    // Set the active flag of the modal to false to close the modal.
    // Also fetch the sprints of the current user and set the ID to null.
    const handleSprintModalClose = () => {
        setIsSPrintModalActive( !isSprintModalActive );
        getSprintsCurrentUser();
        //setId( null );
    };

    // Set the active flag of the modal to false to close the modal.
    // Also fetch the sprints of the current user and set the ID to null.
    const handleTaskModalClose = () => {
        setIsTaskModalActive( !isTaskModalActive );
        getSprintsCurrentUser();
        //setId( null );
    };


    const handleUpdateSprint = async ( sprint_id ) => {
        setId( sprint_id );
        setIsSPrintModalActive( true );
    };

    const handleSprintNameClick = async ( sprint_id ) => {
        setId( sprint_id );
        setIsTaskModalActive( true );
    };

    // Getting all the sprints of the current user/employee everytime the page loads.
    useEffect( () => {
        getSprintsCurrentUser();
    }, [] )
    console.log(id);
    return (
        <div>
            {/* <Taskbar /> */}
            {/* <button className="w-full h-12 px-6 text-white transition-colors duration-150 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClickCapture={ () => { setId( null ) } }
                    onClick={ () => { setIsSPrintModalActive( true ) } }>
                    Add Sprint
            </button> */}
            { /* Only load the table if successfully fetched from backend. */}
            { isLoaded && sprints ? (
                <>
                <div className=" pt-20 relative scrollbar-hide md:scrollbar-default Dashboard min-h-screen grid grid-cols-4 grid-rows-4 gap-2 grid-flow-col pl-20 pr-10 left-40">                   

                    <div className="absolute top-0 left-52">
                        <select id="dropdown" value={selectedOption} onChange={handleSelectChange} onClickCapture={()=> setId(selectedOption)} >
                            {sprints.map((sprint) => (
                            <option key={sprint.sprint_id} value={sprint.sprint_id}>
                                {sprint.sprint_name}
                            </option>
                            ))}
                        </select>
                        {/* {setId(selectedOption)} */}
                        {/* <p>You selected: {selectedOption}</p> */}
                    </div>


                    <div className=" col-start-1 col-span-4 row-start-1 row-span-3 relative -right-40 pb-10 top-10">
                    {/* <h1 className="pt-10 pb-10 pl-10">Current Tasks</h1> */}
                        <TasksTable_forPage token={ token }
                                    id={ id }>
                        </TasksTable_forPage>
                    </div>

                    {/* <div className="relative col-start-3 col-span-2 row-start-1 row-span-1 pl-10 -right-32 pb-10 top-10">
                        <TasksTable_forPageTwo token={ token }
                                    id={ id }>
                        </TasksTable_forPageTwo>
                    </div>   */}

                    {/* <div className="relative col-start-1 col-span-3 row-start-2 row-span-1 -right-28 -top-28">
                        <BurnDown></BurnDown>
                    </div>                */}
                    <AddSprintModal isActiveModal={ isSprintModalActive }
                                    onClose={ handleSprintModalClose }
                                    token={ token }
                                    setErrorMessage={ setErrorMessage }
                                    id={ id }>
                    </AddSprintModal>
                    <SprintTasksModal isActive={ isTaskModalActive }
                                    onClose={ handleTaskModalClose }
                                    token={ token }
                                    setErrorMessage={ setErrorMessage }
                                    id={ id }>
                    </SprintTasksModal>
                </div>
                </>
            ) : (
                <h1> Loading </h1>
            )}
        </div>
    )
};

export default Tasks_forPage;