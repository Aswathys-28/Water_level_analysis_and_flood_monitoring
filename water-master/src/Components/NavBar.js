import React, { useState, useEffect } from 'react';
import './nav.css';
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
function NavBar() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [userData, setUserData] = useState(null); 
  const navigate = useNavigate();
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          fetchLocationName(position.coords.latitude, position.coords.longitude);
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser');
    }
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData) {
      setUserData(storedUserData[0]);
      console.log(storedUserData,"--;;;;;;;;;;;;")
    }
  }, []);

  const fetchLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
      const data = await response.json();
      if (data.display_name) {
        setLocationName(data.address);
        console.log(data)
      } else {
        setLocationName('Location name not found');
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocationName('Error fetching location name');
    }
  };
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userData');
    // Navigate to login route
    navigate('/');
  };
  return (
    <div className='main'>
      <div className='navBar'>
        <h1><b>FLOOD MONITORING SYSTEM</b></h1>
      </div>

      <div className='Location'>
        <CiLocationOn style={{ color: 'black', fontSize: '20px', }} />
        {currentLocation && (
          <span style={{ color: 'black', marginLeft: '5px' }}>
            {locationName.suburb}
          </span>
        )}
      </div>
      <div className="user-container" style={{ right: '5%' }}>
        <p style={{ color: 'red', marginRight: '30px' }}>{userData && userData.username}</p>
        {userData && (
          <p style={{ color: 'red' }} onClick={handleLogout}>Logout</p>
        )}
</div>


    </div>
  );
}

export default NavBar;
