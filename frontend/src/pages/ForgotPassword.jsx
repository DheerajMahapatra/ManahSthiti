

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return alert('Please enter your email.');
    alert(`🔐 Password reset link sent to ${email}`);
    setEmail('');
  };

  return (
    <div className="bg-gradient-to-br from-[#c2e9e3] to-[#fdfcfb] flex items-start justify-center min-h-screen px-4 pt-20">
      <div className="w-[240px] bg-white/40 backdrop-blur-md p-4 rounded-2xl shadow-lg animate-fade-in flex flex-col items-center">
        {/* Logo */}
        <div className="relative w-8 h-8 animate-float mb-2">
          <img
            src="/fp.gif"
            alt="Logo"
            className="w-full h-full object-cover rounded-full border border-teal-400 shadow-md animate-pulse"
          />
          <div className="absolute inset-0 rounded-full bg-teal-300 opacity-20 blur-sm z-[-1]" />
        </div>

        <h2 className="text-base font-semibold text-teal-600 text-center mb-3">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-3 w-full">
          <div>
            <label className="block text-xs mb-1">Enter your email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 rounded-full px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <button
            type="submit"
            className="mt-3 w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-full text-xs font-medium transition duration-200"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-[10px] text-center mt-3 text-gray-600">
          <Link to="/signin" className="text-amber-600 hover:underline">
            Back to Sign In
          </Link>
        </div>

        <p className="text-center text-[9px] mt-4 italic text-gray-500">
          “Your journey to healing starts with one step.”
        </p>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
