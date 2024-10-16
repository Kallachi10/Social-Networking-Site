import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';  // Import AuthContext
import './LoginPage.css'; // Import CSS for styling

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [buttonMessage, setButtonMessage] = useState('');
  const [buttonColor, setButtonColor] = useState(''); // State for button color
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);  // Use AuthContext to store token

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseURL = 'http://localhost:5000'; // Make sure this is your Flask backend's URL
    const url = isLogin ? `${baseURL}/login` : `${baseURL}/register`;

    try {
      const response = await axios.post(url, { email, password });
      console.log('Response received:', response.data);

      if (isLogin) {
        // Handle login logic
        if (response.status === 200) {
          const token = response.data.token;
          setToken(token); // Store token using AuthContext
          console.log('Login successful, token:', token);
          navigate('/home'); // Redirect to home page after successful login
        }
      } else {
        // Handle sign-up logic
        if (response.status === 201) {
          console.log('Sign-up successful, redirecting to login page...');
          setButtonMessage("Account Created! Click the button below");
          setButtonColor("green");
          setTimeout(() => {
            navigate('/'); // Redirect to login page after successful sign-up
          }, 100); 
        }
      }
    } catch (error) {
      console.error('Error during API call:', error);
      if (!isLogin && error.response && error.response.status === 400) {
        // If user already exists
        setButtonMessage("Account already exists, click the button above");
        setButtonColor("lightcoral"); // Change button to light red
      } else if (isLogin && error.response && error.response.status === 401) {
        // If login fails due to non-existent account
        setButtonMessage("Account doesn't exist, please click the button above");
        setButtonColor("lightcoral"); // Change button to light red
      } else {
        // General error case
        setButtonMessage("An unexpected error occurred, please try again.");
        setButtonColor("lightcoral");
      }
    }
  };

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setButtonMessage(''); // Clear the message when switching
    setButtonColor(''); // Reset button color to default when switching
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="submit-button" 
            style={{ backgroundColor: buttonColor }}
            disabled={buttonColor === 'green'} // Disable if account created
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <button onClick={handleSwitch} className="switch-button">
          {isLogin ? 'Create an Account' : 'Already have an account? Login'}
        </button>
        
        {/* Display button message */}
        {buttonMessage && <p>{buttonMessage}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
