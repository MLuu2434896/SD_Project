import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TaskModal.css"

const SprintTasksModal = ( { isActive, onClose, token, setErrorMessage, id } ) => {

    const [ tasks, setTasks ] = useState( [] );
    const [ currentSprint, setCurrentSprint ] = useState( [] );
    const [ isLoaded, setIsLoaded ] = useState( false );

    // Getting all tasks in a specific sprint.
    const getSprintTasks = async( sprint_id ) => {
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
                setIsLoaded( true );

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

    const getCurrentSprint = async( sprint_id ) => {
        // Custom Axios config headers.
        const config = { 
            headers: {
                Authorization: "Bearer " + token
            }
        };
        // Send a get request to get the sprint with the given sprint_id.
        axios.get( `http://localhost:8000/api/show_sprint/${sprint_id}` , config )
            .then( ( response ) => { 
                // get the current sprint.
                setCurrentSprint( response.data );
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

    // Whenever this modal appears, it's going to fetch all the tasks using the given 
    // sprint_id.
    useEffect( () => {
        if( id ){
            getSprintTasks( id );
            getCurrentSprint( id );
        }
    }, [ id, token ] )

    if ( !isActive ) return null;

    // Close the modal whenever 
    const handleOnClose = ( event ) => {
        if( event.target.id === "task_modal_container" ) onClose();
    };

    return ( 
        <div id="task_modal_container"
            className="fixed inset-0 bg-opacity-30 backdrop-blur-sm p-2 overflow-x-hidden overflow-y-auto flex justify-center items-center"
            onClick={ handleOnClose }>
                <div className="relative w-full max-w-3xl max-h-full">
                    { /* Modal Content */ }
                    <div className="relative bg-gray-50 rounded-lg shadow dark:bg-gray-700 dark:text-gray-400">
                        { /* Modal Header */ }
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            { /* Modal Title */}
                            <h3 className="text-xl font-semibold font-mono uppercase text-gray-500 dark:text-gray-400">
                                {currentSprint.sprint_name}
                            </h3>
                        </div>
                        { /* Modal body - cards */ }
                        <div className="flex flex-col bg-white m-auto p-auto">
                            <div className="flex overflow-x-scroll pb-3 pt-3 hide-scroll-bar">
                                <div className="flex flex-nowrap md:ml-3 ml-1">
                                    { /* Card Div */}
                                    { tasks.map( ( task ) => (
                                        <div className="inline-block px-3"
                                             id={task.task_id}>
                                            <div className="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                                { /* Card Label */}
                                                <h1 className="mb-2 text-xl font-mono tracking-tight text-center text-gray-900">
                                                    {task.task_name}
                                                </h1>
                                                { /* Card Description */}
                                                <p className="mb-2 font-normal p-3 text-gray-700 dark:text-gray-400">
                                                    {task.task_info}
                                                </p>
                                                { /* Button Group */ }
                                                <div className="absolute px-7">
                                                    <button type="button"
                                                            className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400">
                                                            Complete
                                                    </button>
                                                    <button type="button"
                                                            className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400">
                                                            Edit
                                                    </button>
                                                    <button type="button"
                                                            className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400">
                                                            Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) ) }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        
    );
}

export default SprintTasksModal;