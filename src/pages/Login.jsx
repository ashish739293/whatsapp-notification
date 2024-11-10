import { useState } from 'react';
import './LoginStyle.css';
// import axios from 'axios';
//import {useNavigate,Link} from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // alert(JSON.stringify(user)); 
    // Display user data correctly in the alert
    console.log(user);
    try {
      // const params = new URLSearchParams(
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          user
        ),
});

      const result = await response.json();
      console.log(result);
    }catch (error) {
      console.error('Error fetching data:', error);
    }

  };

  return (
    <div className="flex-container">
      <form className="log" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={user.email}
          onChange={handleInput}
        /><br/><br/>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={user.password}
          onChange={handleInput}
        /><br/><br/>
        <button className="btn" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
