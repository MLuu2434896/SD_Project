import './App.css';
import axios from 'axios';
import { useState, useEffect } from "react";

function App() {
  const [object, setObject] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000")
      .then((response) => {
        const data = response.data;
        setObject(data);
      })
      .catch((error) => {
        setObject(error);
      });
  }, []);

  const print_info = (value, idx) => {
    return <p key={idx}>{idx + 1}. {value.f_name} {value.l_name}</p>;
  };

  return (
    <div className="App">
      <h1>FastAPI React</h1>
      {object.length > 0 ? object.map(print_info) : <p>Loading...</p>}
    </div>
  );
}

export default App;
