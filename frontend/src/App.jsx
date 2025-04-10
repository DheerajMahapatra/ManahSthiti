
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FaMicrophone, FaSmile } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#c2e9e3] to-[#fdfcfb] font-sans">
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/main" element={<MainApp />} />
        </Routes>
      </Router>
    </div>
  );
}

function MainApp() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [journalEntry, setJournalEntry] = useState('');
  const [savedJournals, setSavedJournals] = useState([]);
  const [mood, setMood] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setSavedJournals(saved);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const userMessage = { type: 'user', text: message };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);

    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    const botMessage = { type: 'bot', text: data.reply };
    setChatHistory([...updatedHistory, botMessage]);
    speak(data.reply);
    setMessage('');
    setLoading(false);
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const saveJournal = () => {
    const newEntry = {
      text: journalEntry,
      timestamp: new Date().toLocaleString(),
    };
    const updatedEntries = [newEntry, ...savedJournals];
    setSavedJournals(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    setJournalEntry('');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#c2e9e3] to-[#fdfcfb] font-sans">
      <header className="bg-teal-500 text-white text-center py-4 shadow-md">
        <h1 className="text-2xl font-bold">🌸 ManahSthiti - Your Safe Space 🌸</h1>
        <div className="mt-2">
          <button onClick={() => setActiveTab('chat')} className={`px-4 py-1 mx-2 rounded ${activeTab === 'chat' ? 'bg-white text-teal-500' : 'text-white border'}`}>
            Chat
          </button>
          <button onClick={() => setActiveTab('journal')} className={`px-4 py-1 mx-2 rounded ${activeTab === 'journal' ? 'bg-white text-teal-500' : 'text-white border'}`}>
            Journal
          </button>
        </div>
      </header>

      {activeTab === 'chat' && (
        <main className="flex-1 flex overflow-hidden p-4 justify-center items-center gap-4">
          <div className="hidden md:flex w-1/5 justify-center items-center">
            <img src="/doctor-girl.png" alt="Doctor Girl" className="h-200 object-contain" />
          </div>

          <div className="w-full md:w-2/5 flex flex-col h-full">
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-1">Mood today:</label>
              <div className="flex gap-2 text-2xl">
                {['😊', '😐', '😞', '😡', '😴'].map((m, idx) => (
                  <button
                    key={idx}
                    className={`transition transform hover:scale-125 ${mood === m ? 'ring-2 ring-teal-400 rounded-full' : ''}`}
                    onClick={() => {
                      setMood(m);
                      setMessage((prev) => prev + ' ' + m);
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* ChatGPT-style scrollable chat area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pl-2 py-4 custom-scrollbar max-h-[60vh]">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl text-sm whitespace-pre-wrap shadow-md max-w-[80%] ${
                    msg.type === 'user' ? 'ml-auto bg-[#d1fae5] text-right' : 'mr-auto bg-white'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && <div className="text-center text-gray-500">Typing...</div>}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="hidden md:flex w-1/5 justify-center items-start">
            <img src="/doctor-boy.png" alt="Doctor Boy" className="h-200 object-contain" />
          </div>
        </main>
      )}

      {activeTab === 'journal' && (
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-teal-700 mb-4">📝 Write your thoughts</h2>
            <textarea className="w-full border rounded-lg p-3 h-60 shadow-inner resize-none" placeholder="Dear Journal..." value={journalEntry} onChange={(e) => setJournalEntry(e.target.value)}></textarea>
            <div className="flex justify-end mt-3">
              <button onClick={saveJournal} className="bg-teal-500 text-white px-4 py-2 rounded shadow hover:bg-teal-600">
                Save Entry
              </button>
            </div>
            {savedJournals.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-600 mb-1">Previous Entries:</h3>
                {savedJournals.map((entry, index) => (
                  <div key={index} className="bg-gray-100 p-3 rounded-lg whitespace-pre-wrap mb-3">
                    <div className="text-xs text-gray-500 mb-1">{entry.timestamp}</div>
                    {entry.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      <footer className="p-3 border-t flex gap-2 items-center justify-center bg-white relative">
        {activeTab === 'chat' && (
          <>
            <button onClick={handleVoiceInput} className="text-xl text-teal-600">
              <FaMicrophone />
            </button>
            <input
              className="flex-1 border rounded-xl p-2 shadow-inner outline-none max-w-2xl"
              type="text"
              placeholder="Type your thoughts..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl shadow">
              Send
            </button>
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <FaSmile className="text-2xl text-yellow-500" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-16 right-4 z-50">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    const selectedEmoji = emojiData.emoji;
                    setMood(selectedEmoji);
                    setMessage((prev) => prev + selectedEmoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}
          </>
        )}
      </footer>
    </div>
  );
}