
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('🎉 Sign Up Successful! Please login now.');
        navigate('/');
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      alert('Server error. Please try again later.');
      console.error('Signup error:', error);
    }
  };

  const checkStrength = (pass) => {
    if (pass.length < 6) return 'Weak';
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && pass.length >= 8) return 'Strong';
    return 'Medium';
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);
    setStrength(checkStrength(pass));
  };

  return (
    <div className="bg-gradient-to-br from-[#c2e9e3] to-[#fdfcfb] flex items-start justify-center min-h-screen px-4 pt-20">
      <div className="w-[240px] bg-white/40 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-lg animate-fade-in flex flex-col items-center">
        {/* Logo */}
        <div className="relative w-8 h-8 animate-float mb-2">
          <img
            src="/signup.gif"
            alt="Logo"
            className="w-full h-full object-cover rounded-full border border-teal-400 shadow-md animate-pulse"
          />
          <div className="absolute inset-0 rounded-full bg-teal-300 opacity-20 blur-sm z-[-1]" />
        </div>

        <h2 className="text-base font-semibold text-teal-600 text-center mb-3">🌼 Create Account</h2>

        <form onSubmit={handleSignUp} className="space-y-3 w-full">
          <div>
            <label className="block text-xs mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-full px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Email</label>
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
            <label className="block text-xs mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`w-full border border-gray-300 rounded-full px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-400 transition-opacity duration-300 ${
                showPassword ? 'opacity-100' : 'opacity-90'
              }`}
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              required
            />
            <span
              className="absolute right-3 top-6 cursor-pointer text-gray-400"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
            >
              <Eye size={14} />
            </span>
            {password && (
              <div
                className={`text-[10px] mt-1 ${
                  strength === 'Weak'
                    ? 'text-red-500'
                    : strength === 'Medium'
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}
              >
                Strength: {strength}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-3 w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-full text-xs font-medium transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <div className="text-[10px] text-center mt-3 text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-teal-500 hover:underline">
            Sign In
          </Link>
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
