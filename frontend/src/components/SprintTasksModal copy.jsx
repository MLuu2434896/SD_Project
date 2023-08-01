import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TaskModal.css"
import AddTaskModal from "./AddTaskModal";

const SprintTasksModal = ( { isActive, onClose, token, setErrorMessage, id } ) => {

    const [ tasks, setTasks ] = useState( [] );
    const [ currentSprint, setCurrentSprint ] = useState( [] );
    const [ isLoaded, setIsLoaded ] = useState( false );

    // State to control add task modal.
    const [ isAddTaskModalActive, setIsAddTaskModalActive ] = useState( false );

    // State to save task_id.
    const [ task_id, setTask_id ] = useState( null );

    // Doesn't work for some reason
    // DON't USE THIS!!!
    const sort_tasks = ( a, b ) => {
        return a.is_complete - b.is_complete;
    };

    // Getting all tasks of a specific sprint.
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
        // console.log( tasks.sort( sort_tasks ) );
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

    // Set task_id to null, get tasks of current sprint, and close the add_task_modal whenever
    // the add_task_modal is close.
    const handleAddTaskModalClose = () => {
        getSprintTasks( id );
        setTask_id( null );
        setIsAddTaskModalActive( !isAddTaskModalActive );
    };

    // Open the add task modal and set the task_id to the one that was being clicked whenever
    // the edit button is pressed.
    const handleEditBtn = async ( taskID ) => {
        setTask_id( taskID );
        setIsAddTaskModalActive( true );
    };

    // Send a request to delete a task using the given task_id.
    // On success: console.log the server's reponse for testing purposes.
    // On failure: setErrorMessage to the server's reponse.
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
        await getSprintTasks( id )
    };

    // Send a request to update the completed status of a task using the given task_id.
    // On success: get all tasks of current sprint console.log the server's reponse for testing purposes.
    // On failure: setErrorMessage to the server's reponse.
    const handleCompleteBtn = async( taskID ) => {
        // Send a post request with the provided sprint_id to server.
        axios.put( `http://localhost:8000/api/complete_task/${taskID}` )
            .then( ( response ) => {
                // Fetch tasks of current sprint everytime we delete something.
                getSprintTasks( id );
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

    // Whenever this modal appears, it's going to fetch all the tasks using the given 
    // sprint_id.
    useEffect( () => {
        if( id ){
            getSprintTasks( id );
            getCurrentSprint( id );
        }
    }, [ id, token ] );

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
                            { /* Add task button */}
                            <button className="rounded-sm dark:hover:bg-gray-600"
                                    onClick={ () => setIsAddTaskModalActive( true ) }>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     fill="none" 
                                     viewBox="0 0 24 24" 
                                     strokeWidth={1.7} 
                                     stroke="currentColor" 
                                     className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                        { /* Modal body - cards */ }
                        <div className="flex flex-col bg-white m-auto p-auto">
                            <div className="flex overflow-x-scroll pb-3 pt-3 hide-scroll-bar">
                                <div className="flex flex-nowrap md:ml-3 ml-1">
                                    { /* Card Div - a card will gray out if a task is completed */}
                                    { tasks.map( ( task ) => (
                                        task.is_complete === 0 ? (
                                            <div className="inline-block px-3"
                                                 key={task.task_id}>
                                                <div className="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-gray-50 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                                    { /* Card Label */}
                                                    <h1 className="mb-2 text-xl font-mono tracking-tight text-center text-gray-900">
                                                        {task.task_name}
                                                    </h1>
                                                    { /* Card Description */}
                                                    <p className="font-normal p-3 max-h-36 overflow-y-scroll hide-scroll-bar text-gray-700 dark:text-gray-400">
                                                        {task.task_info}
                                                    </p>
                                                    { /* Button Group */ }
                                                    <div className="sticky top-[100vh] align-top text-center mb-3">
                                                        <button type="button"
                                                                className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
                                                                onClick={ () => handleCompleteBtn( task.task_id ) }>
                                                                Complete
                                                        </button>
                                                        <button type="button"
                                                                className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
                                                                onClick={ () => handleEditBtn( task.task_id ) }>
                                                                Edit
                                                        </button>
                                                        <button type="button"
                                                                className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
                                                                onClick={ () => handleDeleteBtn( task.task_id ) }>
                                                                Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="inline-block px-3"
                                                 key={task.task_id}>
                                                <div className="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-gray-50 opacity-40 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                                    { /* Card Label */}
                                                    <h1 className="mb-2 text-xl font-mono tracking-tight text-center text-gray-900">
                                                        {task.task_name}
                                                    </h1>
                                                    { /* Card Description */}
                                                    <p className="font-normal p-3 max-h-36 overflow-y-scroll hide-scroll-bar text-gray-700 dark:text-gray-400">
                                                        {task.task_info}
                                                    </p>
                                                    { /* Button Group */ }
                                                    <div className="sticky top-[100vh] align-top text-center mb-3">
                                                        <button type="button"
                                                                className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
                                                                onClick={ () => handleCompleteBtn( task.task_id ) }>
                                                                Complete
                                                        </button>
                                                        <button type="button"
                                                                className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
                                                                onClick={ () => handleEditBtn( task.task_id ) }>
                                                                Edit
                                                        </button>
                                                        <button type="button"
                                                                className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
                                                                onClick={ () => handleDeleteBtn( task.task_id ) }>
                                                                Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ) ) }
                                </div>
                            </div>
                        </div>
                    </div>
                    <AddTaskModal isActive={ isAddTaskModalActive }
                                  onClose={ handleAddTaskModalClose }
                                  token={ token }
                                  setErrorMessage={ setErrorMessage }
                                  sprint_id={ id }
                                  task_id={ task_id }>
                    </AddTaskModal>
                </div>
        </div>
        
    );
}

export default SprintTasksModal;

// { /* Card Div */}
// { tasks.map( ( task ) => (
//     <div className="inline-block px-3"
//             key={task.task_id}>
//         <div className="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-gray-50 hover:shadow-xl transition-shadow duration-300 ease-in-out">
//             { /* Card Label */}
//             <h1 className="mb-2 text-xl font-mono tracking-tight text-center text-gray-900">
//                 {task.task_name}
//             </h1>
//             { /* Card Description */}
//             <p className="font-normal p-3 max-h-36 overflow-y-scroll hide-scroll-bar text-gray-700 dark:text-gray-400">
//                 {task.task_info}
//             </p>
//             { /* Button Group */ }
//             <div className="sticky top-[100vh] align-top text-center mb-3">
//                 <button type="button"
//                         className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
//                         onClick={ () => handleCompleteBtn( task.task_id ) }>
//                         Complete
//                 </button>
//                 <button type="button"
//                         className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
//                         onClick={ () => handleEditBtn( task.task_id ) }>
//                         Edit
//                 </button>
//                 <button type="button"
//                         className="py-1 px-3 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
//                         onClick={ () => handleDeleteBtn( task.task_id ) }>
//                         Delete
//                 </button>
//             </div>
//         </div>
//     </div>
// ) ) }