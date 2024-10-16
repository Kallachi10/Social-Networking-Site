import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Import AuthContext
import './HomePage.css'; // Import CSS for styling
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function HomePage() {
  const { token, setToken } = useContext(AuthContext); // Get the token from context
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState('');
  const navigate = useNavigate(); // Define navigate for redirecting

  useEffect(() => {
    // Check if token exists and is valid
    if (!token) {
      console.error('Token not found');
      return;
    }
    
    console.log('Token:', token);  // Log the token to ensure it is valid
    
    // Fetch existing tweets from the database on component mount
    const fetchTweets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tweets', {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the Authorization header
          }
        });
        setTweets(response.data);
      } catch (error) {
        console.error('Error fetching tweets:', error.response ? error.response.data : error.message);
      }
    };

    fetchTweets();
  }, [token]);

  const postTweet = async () => {
    try {
      const response = await axios.post('http://localhost:5000/tweets', { content: newTweet }, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      console.log('Tweet posted:', response.data);
      setTweets([...tweets, response.data]); // Add the new tweet to the list
      setNewTweet(''); // Clear the input field
    } catch (error) {
      console.error('Error posting tweet:', error.response ? error.response.data : error.message);
    }
  };

  const likeTweet = async (tweetId) => {
    try {
      const response = await axios.post(`http://localhost:5000/tweets/${tweetId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      console.log('Tweet liked/unliked:', response.data);
      setTweets(tweets.map(tweet => tweet._id === tweetId ? response.data : tweet)); // Update the tweet's likes
    } catch (error) {
      console.error('Error liking tweet:', error.response ? error.response.data : error.message);
    }
  };

  const logout = () => {
    setToken(null); // Clear the token from context
    navigate('/'); // Redirect to login page
  };

  return (
    <div style={{ backgroundColor: '#e0f7fa', padding: '20px', height: '100vh', position: 'relative' }}>
      <button 
        onClick={logout} 
        style={{ 
          backgroundColor: 'red', 
          color: 'white', 
          padding: '10px', 
          width: '100px', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer', 
          position: 'absolute', 
          top: '10px', 
          right: '10px' 
        }}
      >
        Logout
      </button>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Welcome to Home Page</h1>
        <input
          type="text"
          placeholder="What's happening?"
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
        />
        <button onClick={postTweet}>Post Tweet</button>
        <div style={{ marginTop: '20px' }}>
          {tweets.map((tweet) => (
            <div key={tweet._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <p>{tweet.content}</p>
              <p>{tweet.likes} Likes</p>
              <button onClick={() => likeTweet(tweet._id)}>
                {tweet.userHasLiked ? 'Unlike' : 'Like'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
