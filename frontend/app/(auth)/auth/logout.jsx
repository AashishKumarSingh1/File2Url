"use client";
import React from "react";

const LogoutModal = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg flex items-center justify-center z-50">
    <div className="bg-white backdrop-blur-lg rounded-lg p-6 w-full max-w-sm mx-4 text-center shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Are you sure you want to log out?</h2>
      <div className="flex justify-between">
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Log Out
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default LogoutModal;
