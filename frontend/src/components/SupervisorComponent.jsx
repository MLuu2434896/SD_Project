import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import axios from "axios";
import moment from "moment";
import AddSprintModal from "./AddSprintModal";
import "../styles/login.css";

// TODO: Add an error message tag under the table if something went wrong!

const SupervisorComponent = () => {
    // Getting access token of current user.
    const [ token, _ ] = useContext( UserContext );

    // Error message for axios requests.
    const [ errorMessage, setErrorMessage ] = useState( "" );

    // Current Supervisors.
    const [ supervisors, updateSupervisors ] = useState( [] );

    // Request success confirmation.
    const [ isLoaded, setIsLoaded ] = useState( false );

    // Modal active flag.
    const [ isActiveModal, setIsActiveModal ] = useState( false );

    const [ id, setId ] = useState( null );

    // Setting up headers and request.
    const getCurrentSupervisors = async () => {
        // Custom Axios config headers.
        const config = { 
            headers: {
                Authorization: "Bearer " + token
            }
        };
        // Send a get request to server.
        axios.get( "http://localhost:8000/api/show_supervisors", config )
            .then( ( response ) => { 
                updateSupervisors( response.data );
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

    const handleDeleteSupervisor = async ( user_id ) => {
        // Custom Axios config headers.
        const config = {
            headers : {
                Authorization: "Bearer " + token
            }
        };
        
        // Send a delete request with the provided user_id to server.
        axios.delete( `http://localhost:8000/api/delete_supervisor/${user_id}`, config )
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
        // Fetch all current user info everytime we delete something.
        getCurrentSupervisors();
    };

    const handleModalClose = () => {
        setIsActiveModal( !isActiveModal );
        getCurrentSupervisors();
        setId( null );
    };


    // Getting all the tasks of the current user/employee everytime the page loads.
    useEffect( () => {
        getCurrentSupervisors();
    }, [] )

    return (
        <div className="w-half">
            <button className="w-full h-12 px-6 text-white transition-colors duration-150 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={ () => { setIsActiveModal( true ) } }>
                    Add New Supervisor
            </button>

            { /* Only load the table if successfully fetched from backend. */}
            { isLoaded && supervisors ? (
                <>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg"> 
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400"> 
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Employee ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    First Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Last Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only"> Action </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { /* Renders all employee info fetched from URL */}
                            { supervisors.map( ( supervisor ) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    key={ supervisor.id }>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { supervisor.id }
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { supervisor.first_name }
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { supervisor.last_name }
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { supervisor.email }
                                    </th>
                                    
                                    <td className="px-6 py-4 text-right">
                                        <button type="button"
                                                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                                onClick={ () => handleDeleteSupervisor( supervisor.id ) }>
                                            Delete
                                        </button>
                                    </td>         
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <AddSprintModal isActiveModal={ isActiveModal }
                                onClose={ handleModalClose }
                                token={ token }
                                setErrorMessage={ setErrorMessage }
                                id={ id }>
                </AddSprintModal>
                </>
            ) : (
                <h1> Loading </h1>
            )}
        </div>
    )
};

export default SupervisorComponent;