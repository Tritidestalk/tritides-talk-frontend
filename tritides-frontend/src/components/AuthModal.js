import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose, defaultTab = 'signup' }) => {
  const [tab, setTab] = useState(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'signup') {
        if (password !== confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        await signup(email, password);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '440px', margin: '0 16px', borderRadius: '12px', border: '2px solid #000', padding: '40px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}>✕</button>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'serif', fontSize: '28px', fontWeight: 400, margin: '0 0 8px' }}>
            {tab === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: '#666', margin: 0 }}>
            {tab === 'signup' ? 'Sign up to get 15 free translations' : 'Sign in to continue translating'}
          </p>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '24px' }}>
          <button onClick={() => { setTab('signup'); setError(''); }} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 500, borderBottom: tab === 'signup' ? '2px solid #000' : 'none', color: tab === 'signup' ? '#000' : '#999' }}>Sign Up</button>
          <button onClick={() => { setTab('login'); setError(''); }} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 500, borderBottom: tab === 'login' ? '2px solid #000' : 'none', color: tab === 'login' ? '#000' : '#999' }}>Sign In</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={{ padding: '12px 16px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#333' }}>{error}</div>}
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          {tab === 'signup' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', marginTop: '8px' }}>
            {loading ? 'Please wait...' : (tab === 'signup' ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '20px' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
