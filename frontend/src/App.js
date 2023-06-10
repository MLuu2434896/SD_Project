import './App.css';
import axios from 'axios';
import { useState, useEffect } from "react";

function App() {
  // useState accepts a return type and returns a var in an object and a setter
  const [ object, setObject ] = useState( [] );

  // Test function to see how frontend fetches data from backend
  useEffect( () => {
    axios.get( "http://localhost:8000" )
      .then( (response) => {
        const data = response.data
        setObject( data ) 
      })
      .catch( (e) => {
        setObject( e )
      })
  }, [] );

  // Test function to see how frontend fetches info from backend
  const print_info = (value, idx) => {
    return <p key={idx}> {idx + 1}. {value.f_name} {value.l_name} </p>
  }

  return (
    <div className="App">
      <h1>
          FastAPI React
      </h1>
      { object.map( print_info ) }
    </div>
  );
}

export default App;
