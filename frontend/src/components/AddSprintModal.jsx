import React, { useEffect, useState } from "react";
import axios from "axios";


const AddSprintModal = ( { isActiveModal, onClose, token, setErrorMessage, id } ) => {
    const [ sprintName, setSprintName ] = useState( "" );

    const getSprintByID = ( sprint_id ) => {
        const config = { 
            headers: {
                Authorization: "Bearer " + token
            }
        };

        axios.get( `http://localhost:8000/api/show_sprint/${sprint_id}`, config )
            .then( ( response ) => {
                // If successfully requested a get request, it'd set sprint name
                // in useState to show it in the form ( referenced by value={} ).
                setSprintName( response.data.sprint_name )
                console.log( "Clicked on edit button of " + JSON.stringify( response.data.sprint_name ) )
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

    // Fetch info of a sprint with the given sprint_id whenever the edit button is pressed.
    useEffect( () => {
        if( id ){
            getSprintByID( id );
        }
    }, [ id, token ] )

    const cleanFormData = () => {
        setSprintName( "" );
    };

    const handleCreateButton = ( event ) => {
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
            sprint_name: sprintName
        } );

        axios.post( "http://localhost:8000/api/create_sprint", data, config )
            .then( ( response ) => {
                // If successfully requested a post request, it'd clean data
                // in useState, and close the modal.
                cleanFormData();
                console.log( "Successfully created a sprint! \n" + JSON.stringify( response.data ) );
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
                }
                // Something is wrong with Axios Config.
                else {
                    console.log( error.message );
                    setErrorMessage( "Something went wrong with Axios" );
                }
            } );
    };

    const handleUpdateButton = ( event ) => {
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
            sprint_name: sprintName
        } );

        axios.put( `http://localhost:8000/api/update_sprint/${id}`, data, config )
            .then( ( response ) => {
                // If successfully updated a sprint, it'd clean data
                // in useState, and close the modal.
                cleanFormData();
                console.log( "Successfully updated a sprint! \n" + JSON.stringify( response.data ) );
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
 
    // Only show the modal if active flag is true.
    if( !isActiveModal ) return null;

    // Responsible for closing the modal when clicking the background.
    const handleOnClose = ( event ) => {
        if( event.target.id === "modal_container" ) onClose();
    };

    return (
       <div id="modal_container"
            className="fixed inset-0 bg-opacity-30 backdrop-blur-sm p-2 overflow-x-hidden overflow-y-auto flex justify-center items-center"
            onClick={ handleOnClose }>
                <div className="relative w-full max-w-sm">
                    { /* Modal content */ }
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        { /* Modal header */ }
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            { id ? (
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Update Sprint
                                </h3>
                            ) : (
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Create Sprint
                                </h3>
                            ) }
                        </div>
                        { /* Modal body */ }
                        <div className="p-6 space-y-6">
                            <form>
                                <div className="rounded mb-6">
                                    <label htmlFor="sprint_name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Sprint Name
                                    </label>
                                    <input type="text"
                                        id="sprint_name"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                        placeholder="Enter a name for the sprint"
                                        value={ sprintName }
                                        onChange={ (e) => { setSprintName( e.target.value ) } } 
                                        required>
                                    </input>
                                </div>
                                { /* Modal footer */ }
                                <div className="flex items-center space-x-3">
                                    { id ? (
                                        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                type="button"
                                                onClick={ handleUpdateButton }> 
                                                Update
                                        </button>
                                    ) : (
                                        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                type="button"
                                                onClick={ handleCreateButton }> 
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

export default AddSprintModal;