import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, Globe, Send, RefreshCw, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PricingOverlay } from '../components/PricingOverlay';
import { AccountSettings } from '../components/AccountSettings';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LANGUAGE_OPTIONS = [
  { code: 'ton', name: 'Tongan', group: 'Polynesian' },
  { code: 'smo', name: 'Samoan', group: 'Polynesian' },
  { code: 'haw', name: 'Hawaiian', group: 'Polynesian' },
  { code: 'mri', name: 'Maori (New Zealand)', group: 'Polynesian' },
  { code: 'rar', name: 'Cook Islands Maori', group: 'Polynesian' },
  { code: 'niu', name: 'Niuean', group: 'Polynesian' },
  { code: 'tkl', name: 'Tokelauan', group: 'Polynesian' },
  { code: 'tvl', name: 'Tuvaluan', group: 'Polynesian' },
  { code: 'fij', name: 'Fijian', group: 'Melanesian' },
  { code: 'bis', name: 'Bislama (Vanuatu)', group: 'Melanesian' },
  { code: 'pis', name: 'Solomon Islands Pijin', group: 'Melanesian' },
  { code: 'tpi', name: 'Tok Pisin', group: 'Melanesian' },
  { code: 'hmo', name: 'Hiri Motu', group: 'Melanesian' },
  { code: 'cha', name: 'Chamorro (Guam)', group: 'Micronesian' },
  { code: 'pau', name: 'Palauan', group: 'Micronesian' },
  { code: 'mah', name: 'Marshallese', group: 'Micronesian' },
  { code: 'gil', name: 'Kiribati', group: 'Micronesian' },
];

const TranslatorPage = () => {
  const navigate = useNavigate();
  const { user, token, refreshUser, isAuthenticated } = useAuth();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState('ton');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [translationsRemaining, setTranslationsRemaining] = useState(15);
  const [showPricing, setShowPricing] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [direction, setDirection] = useState('en');
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    fetchTranslationsRemaining();
  }, [isAuthenticated, navigate]);

  const fetchTranslationsRemaining = async () => {
    try {
      const response = await axios.get(`${API}/translations/remaining`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.unlimited) { setTranslationsRemaining(-1); }
      else { setTranslationsRemaining(response.data.remaining); }
    } catch (err) { console.error('Failed to fetch translations:', err); }
  };

  const getSelectedLanguage = () => {
    const lang = LANGUAGE_OPTIONS.find(l => l.code === targetLanguage);
    return lang ? `${lang.name} (${lang.group})` : 'Select Language';
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported. Please use Chrome.'); return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
      setInputText(transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    if (translationsRemaining === 0) { setShowPricing(true); return; }
    setIsTranslating(true);
    try {
      const response = await axios.post(`${API}/translate`,
        { text: inputText, source_language: 'en', target_language: targetLanguage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const timeStr = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
      const newMessage = {
        id: Date.now(),
        originalText: inputText,
        translatedText: response.data.translated_text,
        audioData: response.data.audio_base64,
        time: timeStr,
        language: getSelectedLanguage().split(' (')[0],
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      if (response.data.translations_remaining >= 0) setTranslationsRemaining(response.data.translations_remaining);
      await refreshUser();
      if (response.data.audio_base64) playAudio(response.data.audio_base64);
      if (response.data.translations_remaining === 0) setTimeout(() => setShowPricing(true), 1000);
    } catch (err) {
      if (err.response?.status === 403) setShowPricing(true);
    } finally {
      setIsTranslating(false);
    }
  };

  const playAudio = (base64Audio) => {
    if (!base64Audio) return;
    try {
      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
      audioRef.current = audio;
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    } catch (err) { console.error('Failed to play audio:', err); }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="translator-page">
      <nav className="lp-nav">
        <a href="/" className="lp-nav-logo">
          <Globe size={18} strokeWidth={1.5} />
          <span>Tri Tides <em>Talk</em></span>
        </a>
        <div className="lp-nav-links desktop">
          <a href="/" className="lp-nav-link">Home</a>
          <a href="/translator" className="lp-nav-link active">Translator</a>
          <a href="/#pricing" className="lp-nav-link">Pricing</a>
          {translationsRemaining >= 0 && <span style={{ fontSize: '12px', color: '#999' }}>{translationsRemaining} translations left</span>}
          <button onClick={() => setShowAccountSettings(true)} className="lp-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Settings size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />Account
          </button>
        </div>
      </nav>

      <main style={{ padding: '80px 24px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="tr-card">
          <div className="tr-card-label"><Globe size={16} strokeWidth={1.5} />Select Pacific Language</div>
          <div className="tr-select-wrapper">
            <select className="tr-select" value={targetLanguage} onChange={e => setTargetLanguage(e.target.value)}>
              {LANGUAGE_OPTIONS.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name} ({lang.group})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="tr-card">
          <div className="tr-card-label"><Volume2 size={16} strokeWidth={1.5} />Select Voice</div>
          <div className="tr-select-wrapper">
            <select className="tr-select">
              <option>Your Voice</option>
              <option>Default Pacific Voice</option>
            </select>
          </div>
          <p className="tr-voice-note">English speaker (your cloned voice)</p>
        </div>

        <div className="tr-conversation">
          {messages.length === 0 ? (
            <div className="tr-empty-state">
              <Globe size={40} strokeWidth={1} />
              <h3>Start a conversation</h3>
              <p>Translate between English and {getSelectedLanguage().split(' (')[0]}</p>
              <p style={{ fontSize: '12px', color: '#aaa' }}>Translations are spoken aloud automatically</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="tr-message">
                <div className="tr-message-header">
                  <div className="tr-message-user"><User size={14} />You</div>
                  <span className="tr-message-time">{msg.time}</span>
                </div>
                <div className="tr-message-lang">ENGLISH</div>
                <p className="tr-message-text">{msg.originalText}</p>
                <div className="tr-message-lang" style={{ marginTop: '12px' }}>{msg.language.toUpperCase()}</div>
                <p className="tr-message-text translation">{msg.translatedText}</p>
                {msg.audioData && (
                  <button className="tr-replay-btn" onClick={() => playAudio(msg.audioData)}>
                    <Volume2 size={14} />Replay
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="tr-input-area">
          <div className="tr-direction-toggle">
            <button className="tr-direction-btn"><RefreshCw size={16} /></button>
            <button className={`tr-lang-toggle ${direction === 'en' ? 'active' : ''}`} onClick={() => setDirection('en')}>You (English)</button>
            <button className={`tr-lang-toggle ${direction === 'pacific' ? 'active' : ''}`} onClick={() => setDirection('pacific')}>Them ({getSelectedLanguage().split(' (')[0]})</button>
          </div>
          <div className="tr-input-row">
            <button className={`tr-mic-btn ${isRecording ? 'recording' : ''}`} onClick={isRecording ? stopRecording : startRecording}>
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input type="text" className="tr-text-input" placeholder="Type or speak in English..." value={inputText} onChange={e => setInputText(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleTranslate()} />
            <button className="tr-send-btn" onClick={handleTranslate} disabled={isTranslating || !inputText.trim()}>
              <Send size={18} />
            </button>
          </div>
          <p className="tr-input-note">Press mic to speak · Translations are spoken aloud automatically</p>
        </div>
      </main>

      <PricingOverlay isOpen={showPricing} onClose={() => setShowPricing(false)} />
      <AccountSettings isOpen={showAccountSettings} onClose={() => setShowAccountSettings(false)} />
    </div>
  );
};

export default TranslatorPage;
