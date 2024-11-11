'use client';
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend } from 'react-icons/fi';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_ENDPOINT);

function formatDate(date) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  return `${month} ${day}, ${formattedHours}:${minutes} ${ampm}`;
}

function ChatApp({ userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.emit('joinRoom', userId);

    socket.on('loadMessages', (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socket.off('loadMessages');
      socket.off('message');
    };
  }, [userId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      userId,
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit('message', message);
    setNewMessage('');
    scrollToBottom();
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-[80vh] max-w-md mx-auto bg-gray-900 rounded-lg shadow-lg md:max-w-lg">
      <div className="bg-gray-800 text-white p-4 text-center font-semibold rounded-t-lg">
        Chat with Admin
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`${
                message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'
              } max-w-xs p-3 rounded-lg text-white`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs text-gray-300 block mt-1">
                {formatDate(new Date(message.timestamp))}
              </span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center p-4 bg-gray-800 rounded-b-lg">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 text-white p-2 rounded-lg outline-none mr-2"
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatApp;
