import { useState, useEffect } from 'react'

const Command = () => {

  const [ledState, setLedState] = useState('OFF');
  const [sliderState, setSliderState] = useState(0);

  const [speed, setSpeed] = useState(0);
  const [mototDirection, setMotorDiction] = useState('STOP');

  const [val, setVal] = useState(-1);


  const baseUrl = "http://127.0.0.1:5000"


  useEffect(() => {
    const fetchLedState = async () => {
      try {
        const response = await fetch(baseUrl + "/state_led");
        const data = await response.json();
        setLedState(data.ledState);
      } catch (error) {
        console.error("Failed to fetch LED state:", error);
      }
    };


    const fetchSpeedState = async () => {
      try {
        const response = await fetch(baseUrl + "/state_speed");
        const data = await response.json();
        setSpeed(data.speed);
        setMotorDiction(data.direction);

        
        if(data.direction=='BACKWARDS'){
          setSliderState(-data.speed);
        }
        else{
          setSliderState(data.speed);
        }

      } catch (error) {
        console.error("Failed to fetch Speed state:", error);
      }
    };


    const fetchVal = async () => {
      try {
        const response = await fetch(baseUrl + "/state_val");
        const data = await response.json();
        setVal(data.testVal);
      } catch (error) {
        console.error("Failed to fetch LED state:", error);
      }
    };


    fetchLedState();
    fetchSpeedState();
    fetchVal();
  }, []);



  const changeState = async () => {
    try {
      const response = await fetch(baseUrl + "/change_led", {
        method: "POST",
      });
      const data = await response.json();

      console.log(data);

      setLedState(data.ledState);
    } catch (error) {
      setLedState("ERROR");
      console.error("Error fetching message:", error);
    }
    
  };


  const getVal = async () => {
    try {
      const response = await fetch(baseUrl + "/state_val");
      const data = await response.json();

      console.log(data);

      setVal(data.testVal);
    } catch (error) {
      setVal("ERROR");
      console.error("Error fetching message:", error);
    }
    
  };


  const changeSpeed = async () => {

    const url = new URL(baseUrl + "/change_speed");

    url.searchParams.append("slider", sliderState); 


    try {
      const response = await fetch(url, {
        method: "POST",
      });
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


      <br></br><br></br><br></br>

      <p> {val} </p>

      <br></br>

      <button className="buttonS1" onClick={getVal}> GET TEST VAL </button>
      

    </div>




  );
}

export default Command;