import {useState} from 'react'


const Command = () => {

  const [ledState, setLedState ] = useState('OFF');

  const changeState = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/led");
      const data = await response.json();

      console.log(data);

      setLedState(data.ledState);
    } catch (error) {
      setLedState("ERROR");
      console.error("Error fetching message:", error);
    }
  };


   return (
    <div className="commands">
      <h1>COMMANDS</h1>

      <br></br>

      <p> {ledState} </p>

      <br></br>
      
     <button className="buttonS1" onClick={changeState}> CHANGE LED </button>
      
    </div>
  );
}

export default Command;