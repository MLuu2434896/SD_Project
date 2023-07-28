import React, {useState, useEffect} from "react";
import axios from "axios";

const AddTaskModal = ( { isActive, onClose, token, setErrorMessage, sprint_id, task_id } ) => {
    const [ taskName, setTaskName ] = useState( "" );
    const [ taskDesc, setTaskDesc ] = useState( "" );

    const clearFormData = () => {
        setTaskName( "" );
        setTaskDesc( "" );
    };


    const handleCreateBtn = ( event ) => {
        event.preventDefault();

        // Have to set the content-type to application/json since Axios treats the STRINGIFIED 
        // JSON data as application/x-www-form-urlencoded.
        const config = { 
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        };

        const data = JSON.stringify( {
            task_name : taskName,
            task_info : taskDesc
        } );

        axios.post( `http://localhost:8000/api/create_task/${sprint_id}`, data, config )
            .then( ( response ) => {
                // If successfully requested a post request, it'd clean data
                // in useState, and close the modal.
                clearFormData();
                console.log( `Successfully created a task in sprint ${sprint_id}! \n` + JSON.stringify( response.data ) );
                onClose();
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
            } );
    };
    
    // Whenever this button is clicked, it'd send the user's inputs to a UPDATE_URL
    // using the task_id passed to this modal.
    // On success: clear the form/user's input and close the modal.
    // Otherwise, setErrormessage to the server's error reponse.
    const handleUpdateBtn = ( event ) => {
        event.preventDefault();

        // Have to set the content-type to application/json since Axios treats the STRINGIFIED 
        // JSON data as application/x-www-form-urlencoded.
        const config = { 
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        };

        const data = JSON.stringify( {
            task_name : taskName,
            task_info : taskDesc
        } );

        axios.put( `http://localhost:8000/api/update_task/${task_id}`, data, config )
            .then( ( response ) => {
                // If successfully updated a task, it'd clean data
                // in useState, and close the modal.
                clearFormData();
                console.log( "Successfully updated a task! \n" + JSON.stringify( response.data ) );
                onClose();
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
            } );
    };

    // Whenever this modal opens, get the current task and set the form's suggestions 
    // to the current task's name and description.
    const getTaskByID = async ( task_id ) => {
        const config = { 
            headers: {
                Authorization: "Bearer " + token
            }
        };

        axios.get( `http://localhost:8000/api/show_task/${task_id}`, config )
            .then( ( response ) => {
                // If successfully requested a get request, it'd set sprint name
                // in useState to show it in the form ( referenced by value={} ).
                setTaskName( response.data.task_name );
                setTaskDesc( response.data.task_info );
                console.log( `Successfully fetched a task with the id: ${task_id}` );
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
            } );
    };

    // Get the info of the clicked task everytime this modal opens.
    useEffect( () => {
        if( task_id ) getTaskByID( task_id );
    }, [ task_id, token ] );

    const handleOnClose = ( event ) => {
        if( event.target.id === "add_task_modal_container" ) onClose();
    };

    if( !isActive ) return null;

    return(
        <div id="add_task_modal_container"
             className="fixed inset-0 bg-opacity-30 backdrop-blur-sm p-2 overflow-x-hidden overflow-y-auto flex justify-center items-center"
             onClick={ handleOnClose }> 
            <div className="relative w-full max-w-sm">
                { /* Modal content */ }
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    { /* Modal header */ }
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        { task_id ? (
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Update Task
                            </h3>
                        ) : (
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Create Task
                            </h3>
                        ) }
                    </div>
                    { /* Modal body */ }
                    <div className="p-6 space-y-6">
                        <form>
                            <div className="rounded mb-6 ">
                                <label htmlFor="task_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Task Name
                                </label>
                                <input type="text"
                                    id="task_name"
                                    className="shadow-sm mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    placeholder="Enter a name for the task"
                                    value={ taskName }
                                    onChange={ (e) => { setTaskName( e.target.value ) } } 
                                    required>
                                </input>
                                <label htmlFor="task_description"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Task Description
                                </label>
                                <input type="text"
                                    id="task_description"
                                    className="shadow-sm mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    placeholder="Enter a description"
                                    value={ taskDesc }
                                    onChange={ (e) => { setTaskDesc( e.target.value ) } } 
                                    required>
                                </input>
                            </div>
                            { /* Modal footer */ }
                            <div className="flex items-center space-x-3">
                                { /* The button will alternate between Update and Create depending of where the user clicked */}
                                { task_id ? (
                                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            type="button"
                                            onClick={ handleUpdateBtn }> 
                                            Update
                                    </button>
                                ) : (
                                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            type="button"
                                            onClick={ handleCreateBtn }> 
                                            Create
                                    </button>
                                ) }
                                <button className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                        type="button"
                                        onClick={ onClose }>
                                        Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default AddTaskModal;