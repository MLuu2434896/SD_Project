import React, { useContext } from "react";
import { Line } from "react-chartjs-2";
import {Chart as CHARTJS} from 'chart.js/auto'
import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import axios from "axios";
import moment from "moment";
import AddSprintModal from "./AddSprintModal";
import "../styles/App.css";

const BurnDownChart = () => {                             
   const [ token, _ ] = useContext( UserContext );
   const [ errorMessage, setErrorMessage ] = useState( "" );
   const [ sprints, setSprints ] = useState( [] );
   const [ hoursInfo, updateHoursInfo ] = useState( [] );
   const [ isLoaded, setIsLoaded ] = useState( false );
   const [ id, setId ] = useState( null );
   var [ numOfSprints, updateNumOfSprints ] = useState( 0 );
   var [ numOfDaysInASprint, updateNumOfDaysInASprint ] = useState( null );
   const label = [];
   
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
               setSprints( response.data);
               setIsLoaded( true );
               updateNumOfSprints( response.data.length );
               //console.log( response.data );
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
            GetGraphInfo();
      }; 
   
       // Getting all the sprints of the current user/employee everytime the page loads.
       useEffect( () => {
           getSprintsCurrentUser();
       }, [isLoaded] )                 // this condition ensures the graph will update anytime data is fetched

   const GetGraphInfo = async () => {
      for (let i = 0; i < numOfSprints; i++){
         console.log("@ i " + i + " the hours info is: " + sprints[i].hours_logs)             //highlights how to access info fetched via axios

         if (!(sprints[i].hours_logs).includes("-1")){
            //console.log("These are the droids you're looking for: " + sprints[i].hours_logs)
            updateHoursInfo(sprints[i].hours_logs.split(","))
            updateNumOfDaysInASprint(sprints[i].hours_logs.split(",").length)
         }
      }
   }
   
   //console.log("The number of sprints is: " + numOfSprints + " and the number of entries in hoursInfo is: " + numOfDaysInASprint);
   for (let i = 1; i <= numOfDaysInASprint; i++){
      hoursInfo[i - 1] = parseInt(hoursInfo[i - 1]);                //converts hoursInfo into ints from String & Newline chars
      label[i - 1] = ("Day " + i);                                   //Note: Must be in main due as the only way to preserve label info inside a function is w/ useState methods
   }
   console.log("@ the end of main hoursInfo is: " + hoursInfo + " and label is: " + label)

   const UserData = {
      labels: label,
      datasets: [
         {
            label: 'Hours remaining',
            data: hoursInfo,
            borderColor: 'black',
            borderWidth: 1,
         },
      ],
   }; 
  

   return <Line data={UserData}/>;
}

export default BurnDownChart;