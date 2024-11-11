'use client'
import React, { useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { UserContext } from '@/app/(root)/context/user.context';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [loading,setLoading]=useState(false)
  const [authenticated,setAuthenticated]=useContext(UserContext)
  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/auth/login`, {
        username,
        password,
        rememberMe,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        Cookies.set('tokenx', token, { expires: rememberMe ? 7 : undefined });
        await setAuthenticated({
          user:response.data.user,
          token:response.data.token,
        });
        toast.success("Login successful!");

        setShouldRedirect(true);
        router.push("/");
        window.location.reload(); 
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || 'Login failed');
      toast.error("Login failed: " + (error.response?.data?.message || "Unknown error"));
    }finally{
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-white text-2xl mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 text-white bg-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 text-white bg-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={handleRememberMeChange}
          className="mr-2"
        />
        <span className="text-white">Remember me</span>
      </label>
      {/* <button type="submit" className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
      {loading ? <span className="loader mr-2"></span> : 'Login'}
      </button> */}
      <button
            type="submit"
            className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 text-white font-semibold flex justify-center items-center"
          >
            {loading ? <span className="loader mr-2"></span> : 'Log In'}
          </button>
      
    </form>
  );
};

export default Login;
