'use client';
import React, { useState } from 'react';
import Login from './login';
import Register from './register';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isSwapping, setIsSwapping] = useState(false);

  const toggleForm = () => {
    setIsSwapping(true);
    setTimeout(() => { 
      setIsLogin((prev) => !prev);
      setIsSwapping(false);
    }, 300);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div
          className={`transition-transform duration-300 ease-in-out ${
            isSwapping ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}
        >
          {isLogin ? <Login /> : <Register />}
        </div>
        <div className={`transition-all duration-300 ease-in-out ${isSwapping ? 'opacity-0' : 'opacity-100'}`}>
          <button
            onClick={toggleForm}
            className="text-blue-400 hover:text-blue-600 transition mt-6 bg-black hover:bg-white px-4 py-2 rounded-xl"
          >
            {isLogin ? 'Create an account' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
