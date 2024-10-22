// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation SignIn($password: String!, $phoneNumber: String!) {
    signIn(password: $password, phoneNumber: $phoneNumber) {
      data {
        id
        email
      }
      tokens {
        access_token
        refresh_token
      }
    }
  }
`;

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Using useMutation to get the signIn function
  const [signIn, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.signIn) {
        const { access_token, refresh_token } = data.signIn.tokens;

        // Set tokens in local storage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // Set phone and password in local storage (Not recommended for password)
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userPassword', password); // Avoid doing this in production!

        navigate('/dashboard');
      }
    },
    onError: (err) => {
      setError('Invalid phone number or password. Please try again.');
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // Call the mutation function
    signIn({ variables: { phoneNumber: phone, password } });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Section */}
      <div className="w-2/3 bg-gradient-to-r from-blue-700 to-blue-500 flex flex-col justify-center p-8">
        <div className="text-white">
          <div className="text-white flex items-center">
            <img
              src="image.png"
              alt="Logo"
              className="w-16 h-16 mr-4"
            />
            <div className="flex flex-col">
              <p className="text-xl">ሰራተኛ</p>
              <p className="text-xl">ቀጣሪ</p>
              <p className="text-xl">ውሳኔ ሰጪ</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold">Ethiopia Labor Market</h1>
          <h2 className="text-4xl font-bold">Information System</h2>
        </div>
      </div>

      <div className="w-1/3 flex flex-col justify-center items-center bg-white p-8">
        <div className="bg-white rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <i className="fas fa-phone-alt text-gray-400 pl-3"></i>
              <input
                type="text"
                placeholder="Phone number"
                className="w-full p-3 border border-gray-300 rounded-full h-12 focus:outline-none focus:ring focus:ring-blue-300"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <i className="fas fa-lock text-gray-400 pl-3"></i>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-full h-12 focus:outline-none focus:ring focus:ring-blue-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-full h-12 hover:bg-blue-700 transition duration-300"
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            <p className="text-center text-blue-600 cursor-pointer hover:underline">
              Forgot Password
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
