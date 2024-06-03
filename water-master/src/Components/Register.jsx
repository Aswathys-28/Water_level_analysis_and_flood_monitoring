import React, { useState } from 'react';
import './Reg.css'
import { useNavigate,Link } from 'react-router-dom'; // Import withRouter

import Axios from '../Axios2'
function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Handle form submission
    console.log(formData);
    // Reset form data
    setFormData({
      username: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: ''
    });
    Axios.post('/addBlinds',formData).then((response)=>{
          if(response){
            console.log(response)
          }else{
            console.log("error")
          }
    })
  };

  return (
    <div className='form-container'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input style={{marginTop: '5px'}} type="text" name="username" value={formData.username} onChange={handleChange} required placeholder='Username' />
        </div><br/>
        <div>
          <label>Email:</label>
          <input style={{marginTop: '5px'}} type="email" name="email" value={formData.email} onChange={handleChange} required placeholder='Email' />
        </div><br/>
        <div>
          <label>Mobile:</label>
          <input style={{marginTop: '5px'}} type="text" name="mobile" value={formData.mobile} onChange={handleChange} required  placeholder='Mobile'/>
        </div><br></br>
        <div>
          <label>Password:</label>
          <input style={{marginTop: '5px'}} type="password" name="password" value={formData.password} onChange={handleChange} required placeholder='Password' />
        </div><br/>
        <div>
          <label>Confirm Password:</label>
          <input style={{marginTop: '5px'}} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder='Confirm Password' />
        </div><br/>
        <button type="submit">Register</button><br/><br/>
         <span> <Link to={'/'}>Already have an account? Login</Link></span>
      </form>
    </div>
  );
}

export default Register;