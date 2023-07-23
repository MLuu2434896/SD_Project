import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import axios from "axios";
import moment from "moment";

const Tasks = () => {
    // Getting access token of current user.
    const [ token, _ ] = useContext( UserContext );

    // Error message for axios requests.
    const [ errorMessage, setErrorMessage ] = useState( "" );

    // Sprints of current user.
    const [ sprints, setSprints ] = useState( null );

    // Request success confirmation.
    const [ isLoaded, setIsLoaded ] = useState( false );

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
                console.log( response.data );
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

    // Getting all the sprints of the current user/employee everytime the page loads.
    useEffect( () => {
        getSprintsCurrentUser();
    }, [] )

    return (
        <div> 
            { /* Only load the table if successfully fetched from backend. */}
            { isLoaded && sprints ? (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg"> 
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400"> 
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Sprint name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Sprint ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Start Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only"> Action </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { /* Renders all sprints of the current user fetched from URL */}
                            { sprints.map( ( sprint ) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    key={ sprint.sprint_id }>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { sprint.sprint_name }
                                    </th>
                                    <td className="px-6 py-4">
                                        { sprint.sprint_id }
                                    </td>
                                    <td className="px-6 py-4">
                                        { moment( sprint.start_date ).format( "MMM Do YYYY" ) }
                                    </td> 
                                    <td className="px-6 py-4 text-right">
                                        <button type="button" 
                                                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                                            Edit
                                        </button>
                                        <button type="button"
                                                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                                onClick={ () => handleDeleteSprint( sprint.sprint_id ) }>
                                            Delete
                                        </button>
                                    </td>         
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <h1> Loading </h1>
            )}
        </div>
    )
};

export default Tasks;