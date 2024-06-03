import React, { useEffect, useState } from 'react';
import './cards.css';
import './level.css'
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { GiWindsock } from "react-icons/gi";
import { dataRef } from '../firebase';
import { TiWeatherCloudy } from "react-icons/ti";
import { GiLevelEndFlag } from "react-icons/gi";
import { FaWater } from "react-icons/fa";
import Axios from '../Axios';
import Axios2 from '../Axios2'
import Level from './Level';
import alertSound from '../alert.wav';

function Cards() {
  const [temp, setTemp] = useState('');
  const [hum, setHum] = useState('');
  const [lvl, setLvl] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [prediction, setPrediction] = useState({});
  const [wind, setWind] = useState(null);
  const [rainfall, setRainfall] = useState(null); // New state for rainfall prediction
  const API_KEY = '076465d2e663be277c6d13a3991ca3b6';
  const [lelAlert,setLevlalert] = useState(false)
  const [showP,setP] = useState(false)
  const [rainfallP,seRainFallp] = useState(false)
  const [playAlertSound, setPlayAlertSound] = useState(false);
  const [email,setEmail] = useState(null)
  
  useEffect(() => {
    let userData = localStorage.getItem('userData');
    console.log(userData, "from card");

    let jsonData = JSON.parse(userData);
    console.log(jsonData[0].email,"json----------------------------------------");
    setEmail(jsonData[0].email)

    const fetchDataInterval = setInterval(() => {
    
    
      Axios.get('weather?lat=9.9647781&lon=76.2940493&appid=9221cbdf8aaa131c1efc371f8403fca0')
        .then((response) => {
          console.log(response.data,"air")
          setPrediction(response.data.main)
          setWind(response.data.wind)
          if(response.data.main.humidity<75){
            seRainFallp(true)
          }else{
            seRainFallp(false)

          }

        })
        .catch((error) => {
          console.error("Error fetching air pollution data:", error);
        });
    }, 1000);
    return () => clearInterval(fetchDataInterval);
  }, []);

  useEffect(() => {
    if (email !== null) {
      const fetchData = async () => {
        dataRef.ref().child('test').on('value', (data) => {
          const getData = Object.values(data.val());
          console.log(getData, "---------");
          setTemp(getData[0]);
          setHum(getData[1]);
          setLvl(getData[2]);
          if(getData[2]>250){
            setLevlalert(true);
            console.log(email,"------to be sent");
            let data = {
              email
            };
            Axios2.post('/emailAlert', data).then((response)=>{
              console.log(response.data,"done it");
            });
          } else {
            setLevlalert(false);
          }
        });
      };

      fetchData();
      // Check water level every second
      const interval = setInterval(() => {
        fetchData();
      }, 1000);
    }
  }, [email]);

  useEffect(() => {
    if (lelAlert && !playAlertSound) {
      setPlayAlertSound(true);
    }
  }, [lelAlert, playAlertSound]);

  useEffect(() => {
    if (playAlertSound) {
      const audio = new Audio(alertSound);
      audio.play().then(() => {
        setPlayAlertSound(false);
      }).catch((error) => {
        console.error('Error playing alert sound:', error);
        setPlayAlertSound(false);
      });
    }
  }, [playAlertSound]);

  const showPrediction  = () => {
    console.log(showP,"before")
    setP(true)
    console.log(showP,"after")
  }

  return (
    <>
      {lelAlert ?
        <div className="Alerts">
          <h2><i>HIGH WATER LEVEL DETECTED</i></h2>
        </div> :
        ""
      }
      {
        rainfallP ? 
        <>
          <div className="Alerts">
            <h2><i>⚠️Expected Rainfall !!!</i></h2>
          </div>
        </> :
        ""
      }
   
      <div className='cards'>
        <div className='card'><p>HUMIDITY</p>
          <WiHumidity style={{fontSize:"70px"}} />
          <h2>{temp}%</h2>
        </div>
        <div className='card'><p>TEMPERATURE</p> 
          <FaTemperatureHigh style={{fontSize:"50px"}}/>
          <h2>{hum}°C </h2>
        </div>
        <div className='card'><p>WATER LEVEL</p>
          <FaWater  style={{fontSize:"70px"}}/>
          <h2>{lvl} m</h2>
        </div>
      </div>
      <div className='Buttons'>
        <button className='PrdtBtn' onClick={showPrediction}>PREDICT</button>
      </div>
      {showP ?
        <>
          <h1 className='PREDICTION_HEADING'>PREDICTION RESULT</h1>
          <div className='Prediction'>
            <>
              <div className='pressure'> <h4 style={{color:'black'}}><span> Max Temparature </span>: <b>{prediction.temp_max  -273.15} °C</b></h4> </div>
              <div className='pressure'> <h4 style={{color:'black'}}><span> Min Temparature </span>: <b>{prediction.temp_min  -273.15} °C</b></h4> </div>
              <div className='pressure'> <h4 style={{color:'black'}}><span>Pressure </span>: <b>{prediction.pressure} Pa</b></h4> </div>
              {
                wind ?
                <>
                  <div className='pressure'> <h4 style={{color:'black'}}><span>Wind speed </span>: <b>{wind.speed} km/h </b> </h4> </div>
                  <div className='pressure'> <h4 style={{color:'black'}}><span>Degree </span>: <b>{wind.deg} °</b></h4> </div>
                  <div className='pressure'> <h4 style={{color:'black'}}><span>Clear Sky </span>: <b>{prediction.humidity}<span></span></b></h4> </div>
                </>
                : ""
              }  
            </>
          </div>
        </> :
        ''
      }
    </>
  );
}

export default Cards;