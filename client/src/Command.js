import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';



const Command = () => {

  const [ledState, setLedState] = useState('OFF');
  const [sliderState, setSliderState] = useState(0);

  const [speed, setSpeed] = useState(0);

  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);
  const [stops, setStops] = useState(0);


  const [recentTemp, setRecentTemp] = useState([]);
  const [recentHum, setRecentHum] = useState([]);
  const [recentSpeed, setRecentSpeed] = useState([]);

  const [fanControl, setFanControl] = useState('MANUAL');
  const [carStatus, setCarStatus] = useState('STATIONARY');
  
  const baseUrl = "http://127.0.0.1:5000"


  useEffect(() => {
    
    const updateGraphs = async () => {
      try {
        const response = await fetch(baseUrl + "/get_graph_values");
        const data = await response.json();

        var formattedData = data.temp_vals.map((temp, idx) => ({ name: idx, temp }));
        setRecentTemp(formattedData);

        formattedData = data.hum_vals.map((hum, idx) => ({ name: idx, hum }));
        setRecentHum(formattedData);


        formattedData = data.speed_vals.map((speed, idx) => ({ name: idx, speed }));
        setRecentSpeed(formattedData);


      } catch (error) {
        console.error("Failed to fetch recents values; error - ", error);
      }
    };

    // fetchLedState();
    // fetchSpeedState();
    // fetchVal();
    // updateGraphs();



    const fetchEverything = async () => {
      try {
        const response = await fetch(baseUrl + "/get_all_values");
        const data = await response.json();
        setTemp(data.temp);
        setHum(data.hum);
        setStops(data.stops);
        setSpeed(data.fan_speed);

        if(data.car_moving == true)
        {
          setCarStatus('MOVING');
        }
        else
        {
          setCarStatus('STATIONARY');
        }

      } catch (error) {
        console.error("Failed to fetch LED state:", error);
      }
    };


    //to do
    const fetchControlType = async () => {
      try {
        const response = await fetch(baseUrl + "/get_control_type");
        const data = await response.json();

        setFanControl(data.control_type);

      } catch (error) {
        console.error("Failed to fetch control type:", error);
      }
    };


    fetchControlType();
    fetchEverything();
    updateGraphs();

    const intervalId = setInterval(() => {
      fetchEverything();
      updateGraphs();
    }, 1000);


    return () => clearInterval(intervalId);


  }, []);


  // to delete later
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


  
  const changeControl = async () => {
    try {
      const response = await fetch(baseUrl + "/change_control_type", {
        method: "POST",
      });

      const data = await response.json();

      console.log(data);

      setFanControl(data.control_type);
    } catch (error) {
      setFanControl("ERROR");
      console.error("Error fetching message:", error);
    }
    
  };



  //to do
  const moveCar = async () => {
    try {
      const response = await fetch(baseUrl + "/continue_car_movement", {
        method: "POST",
      });

      const data = await response.json();
      console.log(data);

    } catch (error) {
      setFanControl("ERROR");
      console.error("Error fetching message:", error);
    }
    
  };



  const changeSpeed = async () => {

    const url = new URL(baseUrl + "/change_fan_speed");

    url.searchParams.append("slider", sliderState); 


    try {
      const response = await fetch(url, {
        method: "POST",
      });
      const data = await response.json();

      console.log(data);

      setSpeed(data.fan_speed);
    } catch (error) {
      setSpeed(0);
      console.error("Error fetching message:", error);
    }
  };


  return (
    <div className="commands">
      <h1 className="commandsTitle">COMMANDS</h1>

      <br></br><br></br>

      
      
      <p className="p_class2">Fan control type : {fanControl} </p>

      

      <button className="buttonS1" onClick={changeControl}> CHANGE CONTROL TYPE </button>


      <br></br><br></br>


      <p className="p_class2">Car status : {carStatus} </p>


      <button className="buttonS1" onClick={moveCar}> CONTINUE MOVING </button>


      <br></br><br></br>


      <label htmlFor="speed-slider" className="label1">
        Speed: {sliderState} %
      </label>

      <br></br>

      <input
        id="angle-speed"
        type="range"
        min={0}
        max={100}
        step={1}
        value={sliderState}
        onChange={(e) => setSliderState(Number(e.target.value))}
        className="sliderClass"
      />

      <br></br>
      <button className="buttonS1" onClick={changeSpeed}> CHANGE SPEED </button> 


      <br></br><br></br>




      <p className="p_class">TEMPERATURE : {temp} C</p> 
      <p className="p_class">HUMIDITY : {hum} %</p> 
      <p className="p_class">FAN SPEED : {speed} </p> 
      <p className="p_class">STOP : #{stops} </p> 


      <br></br>


      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={recentTemp}
        className="chart_back">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={{ value: 'Time Step', position: 'insideBottomRight', offset: -5 }} />
          <YAxis domain={[0, 60]} label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#FF0000" />
        </LineChart>
      </ResponsiveContainer>

      <br></br><br></br>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={recentHum}
        className="chart_back">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={{ value: 'Time Step', position: 'insideBottomRight', offset: -5 }} />
          <YAxis domain={[0, 100]} label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="hum" stroke="#0000FF" />
        </LineChart>
      </ResponsiveContainer>

      <br></br><br></br>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={recentSpeed}
        className="chart_back">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={{ value: 'Time Step', position: 'insideBottomRight', offset: -5 }} />
          <YAxis domain={[0, 100]} label={{ value: 'Speed (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="speed" stroke="#000000" />
        </LineChart>
      </ResponsiveContainer>

      <br></br><br></br>


      

    </div>


    




  );
}

export default Command;