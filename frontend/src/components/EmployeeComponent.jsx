import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import axios from "axios";
import moment from "moment";
import AddSprintModal from "./AddSprintModal";
import "../styles/login.css";

// TODO: Add an error message tag under the table if something went wrong!

// function changevalue(){
//     document.querySelectorAll(".SLCT").forEach(function(item) {
//        if (item.key != "1") {
//           item.innerText = "";
//        }
//     });
//  }

const EmployeeComponent = () => {
    // Getting access token of current user.
    const [ token, _ ] = useContext( UserContext );

    // Error message for axios requests.
    const [ errorMessage, setErrorMessage ] = useState( "" );

    // Current Employees.
    const [ employees, updateEmployees ] = useState( [] );

    // Request success confirmation.
    const [ isLoaded, setIsLoaded ] = useState( false );

    // Modal active flag.
    const [ isActiveModal, setIsActiveModal ] = useState( false );

    const [ id, setId ] = useState( null );

    // Setting up headers and request.
    const getCurrentUsers = async () => {
        // Custom Axios config headers.
        const config = { 
            headers: {
                Authorization: "Bearer " + token
            }
        };
        // Send a get request to server.
        axios.get( "http://localhost:8000/api/show_users", config )
            .then( ( response ) => { 
                updateEmployees( response.data );
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

    const handleDeleteUser = async ( user_id ) => {
        // Custom Axios config headers.
        const config = {
            headers : {
                Authorization: "Bearer " + token
            }
        };
        
        // Send a delete request with the provided user_id to server.
        axios.delete( `http://localhost:8000/api/delete_user/${user_id}`, config )
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
        getCurrentUsers();
    };

    const handleModalClose = () => {
        setIsActiveModal( !isActiveModal );
        getCurrentUsers();
        setId( null );
    };

    const handleUpdateUser = async ( user_id ) => {
        setId( user_id );
        setIsActiveModal( true );
    };

    // Getting all the tasks of the current user/employee everytime the page loads.
    useEffect( () => {
        getCurrentUsers();
    }, [] )

    return (
        <div className="w-half">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full relative right-1/4"
                        onClick={ () => { setIsActiveModal( true ) } }>
                        Add New Employee
                </button>
            { /* Only load the table if successfully fetched from backend. */}
            { isLoaded && employees ? (
                <>
                <div className="pl-4 pt-4 pb-4 relative overflow-x-auto shadow-md sm:rounded-lg"> 
                    <table className="border-collapse border border-slate-500 ... "> 
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
                            { employees.map( ( employee ) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    key={ employee.id }>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { employee.id }
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { employee.first_name }
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { employee.last_name }
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { employee.email }
                                    </th>
                                    
                                    <td className="px-6 py-4 text-right">
                                        <button type="button" 
                                                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                                onClick={ () => handleUpdateUser( employee.id ) }>
                                            Edit
                                        </button>
                                        <button type="button"
                                                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                                onClick={ () => handleDeleteUser( employee.id ) }>
                                            Delete
                                        </button>
                                    </td>         
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Table for selective info */}
                <div className="pl-4 pt-4 pb-4 relative overflow-x-auto shadow-md sm:rounded-lg"> 
                    <table className="border-collapse border border-slate-500 ... "> 
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
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
                            { employees.map( ( employee ) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"

                                    key={ employee.id }>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { employee.first_name }
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { employee.last_name }
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { employee.email }
                                    </th>
                                    
                                    <td className="px-6 py-4 text-right">
                                        <button type="button" 
                                                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                                onClick={ () => handleUpdateUser( employee.id ) }>
                                            Edit
                                        </button>
                                        <button type="button"
                                                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                                onClick={ () => handleDeleteUser( employee.id ) }>
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

export default EmployeeComponent;