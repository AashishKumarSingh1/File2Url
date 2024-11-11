'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Router, { useRouter } from 'next/navigation';
const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router=useRouter();
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/auth/send-otp`, { email });
      toast.success(response.data.message || 'OTP sent to your email.');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/auth/verify-otp`, { email, otp });
      toast.success(response.data.message || 'OTP verified. Proceeding with registration.');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/auth/register`, {
        email,
        username,
        password,
      });
      toast.success(response.data.message || "Registration successful! Redirecting...");
      window.location.reload();
      // router.push('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg space-y-6">
      <h2 className="text-4xl text-white font-semibold text-center mb-6">Register</h2>
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 text-white font-semibold flex justify-center items-center"
          >
            {loading ? <span className="loader mr-2"></span> : 'Send OTP'}
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-4 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 text-white font-semibold flex justify-center items-center"
          >
            {loading ? <span className="loader mr-2"></span> : 'Verify OTP'}
          </button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-4 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 text-white font-semibold flex justify-center items-center"
          >
            {loading ? <span className="loader mr-2"></span> : 'Register'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
