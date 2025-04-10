

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Please enter both email and password.');

    try {
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) navigate('/main');
      else {
        alert(`❌ ${data.error}`);
        if (data.error.includes('User does not exist')) {
          setTimeout(() => navigate('/signup'), 1000);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#c2e9e3] to-[#fdfcfb] flex items-start justify-center min-h-screen px-4 pt-20">
      <div className="w-[240px] bg-white/40 backdrop-blur-md p-4 rounded-2xl shadow-lg animate-fade-in flex flex-col items-center">
        {/* Logo */}
        <div className="relative w-8 h-8 animate-float mb-2">
          <img
            src="/logo.gif"
            alt="Logo"
            className="w-full h-full object-cover rounded-full border border-teal-400 shadow-md animate-pulse"
          />
          <div className="absolute inset-0 rounded-full bg-teal-300 opacity-20 blur-sm z-[-1]" />
        </div>

        <h2 className="text-base font-semibold text-teal-600 text-center mb-3">🌸 ManahSthiti</h2>

        <form onSubmit={handleSignIn} className="space-y-3 w-full">
          <div>
            <label className="block text-xs mb-1 text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-full px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-xs mb-1 text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full border border-gray-300 rounded-full px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <span
              className="absolute right-3 top-6 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </span>
          </div>

          <button
            type="submit"
            className="mt-3 w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-full text-xs font-medium transition duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="text-[10px] text-center mt-3 text-gray-600">
          <Link to="/forgot-password" className="text-teal-500 hover:underline">Forgot Password?</Link>
        </div>

        <div className="text-[10px] text-center mt-1 text-gray-600">
          Don’t have an account? <Link to="/signup" className="text-teal-500 hover:underline">Sign Up</Link>
        </div>

        <p className="text-center text-[9px] mt-4 italic text-gray-500">
          “Your mental health is a priority.”
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
