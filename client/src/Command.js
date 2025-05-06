import { useState } from 'react'

const Command = () => {

  const [ledState, setLedState] = useState('OFF');
  const [sliderState, setSliderState] = useState(0);

  const [speed, setSpeed] = useState(0);
  const [mototDirection, setMotorDiction] = useState('STOP');

  // const baseUrl = "http://0.0.0.0:5000"
  const baseUrl = "http://127.0.0.1:5000"


  const changeState = async () => {
    try {
      const response = await fetch(baseUrl + "/led");
      const data = await response.json();

      console.log(data);

      setLedState(data.ledState);
    } catch (error) {
      setLedState("ERROR");
      console.error("Error fetching message:", error);
    }
  };


  const changeSpeed = async () => {

    const url = new URL(baseUrl + "/speed");

    url.searchParams.append("slider", sliderState); 


    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log(data);

      setSpeed(data.speed);
      setMotorDiction(data.direction);
    } catch (error) {
      setSpeed(0);
      setMotorDiction('STOP');
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


      <br></br><br></br><br></br>


      <label htmlFor="speed-slider" className="label1">
        Angle: {sliderState}°
      </label>

      <br></br>

      <input
        id="angle-speed"
        type="range"
        min={-180}
        max={180}
        step={1}
        value={sliderState}
        onChange={(e) => setSliderState(Number(e.target.value))}
        className="name1"
      />

      <br></br>
      <button className="buttonS1" onClick={changeSpeed}> CHANGE SPEED </button> 

      
      <p>SPEED: {speed} </p>
      <br></br><br></br>
      <p>DIRECTION: {mototDirection} </p>
      

    </div>




  );
}

export default Command;