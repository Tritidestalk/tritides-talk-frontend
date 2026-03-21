import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AccountSettings = ({ isOpen, onClose }) => {
  const { user, token, logout } = useAuth();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/subscription/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setMessage({ type: 'success', text: 'Subscription cancelled. You retain access until end of billing period.' });
      setShowCancelConfirm(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to cancel. Please contact support.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') { setMessage({ type: 'error', text: 'Please type DELETE to confirm.' }); return; }
    setLoading(true);
    try {
      await axios.delete(`${API}/account/delete`, { headers: { Authorization: `Bearer ${token}` } });
      logout();
      onClose();
      window.location.href = '/';
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to delete. Please contact support.' });
      setLoading(false);
    }
  };

  const planNames = { family: 'Family Plan', community: 'Community Plan', care_home: 'Care Home Plan', hospital: 'Hospital Plan' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', overflowY: 'auto', padding: '32px 0' }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '500px', margin: '0 16px', borderRadius: '12px', padding: '40px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}>✕</button>

        <h2 style={{ fontFamily: 'serif', fontSize: '24px', fontWeight: 400, margin: '0 0 8px' }}>Account Settings</h2>
        <p style={{ color: '#666', margin: '0 0 32px' }}>Manage your account and subscription</p>

        {message.text && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`, color: message.type === 'success' ? '#166534' : '#991b1b', fontSize: '13px' }}>
            {message.text}
          </div>
        )}

        <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '24px' }}>
          <p style={{ fontWeight: 500, margin: '0 0 4px' }}>{user?.email}</p>
          <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
            {user?.subscription_plan ? `${planNames[user.subscription_plan]} - Active` : 'Free Account'}
          </p>
        </div>

        {user?.subscription_plan && user?.subscription_status === 'active' && (
          <div style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '15px' }}>Cancel Subscription</h3>
            <p style={{ color: '#666', fontSize: '13px', margin: '0 0 16px' }}>You'll keep access until end of current billing period.</p>
            {!showCancelConfirm ? (
              <button onClick={() => setShowCancelConfirm(true)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Cancel Subscription</button>
            ) : (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '16px' }}>
                <p style={{ fontWeight: 500, margin: '0 0 8px', fontSize: '14px' }}>Are you sure?</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleCancelSubscription} disabled={loading} style={{ padding: '10px 16px', background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>{loading ? 'Cancelling...' : 'Yes, Cancel'}</button>
                  <button onClick={() => setShowCancelConfirm(false)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Keep Subscription</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ padding: '16px', border: '1px solid #fecaca', borderRadius: '8px', background: 'rgba(254,242,242,0.3)' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '15px', color: '#991b1b' }}>Delete Account</h3>
          <p style={{ color: '#b91c1c', fontSize: '13px', margin: '0 0 16px' }}>Permanently delete your account and all data. This cannot be undone.</p>
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#b91c1c' }}>Delete My Account</button>
          ) : (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '16px' }}>
              <p style={{ fontWeight: 500, margin: '0 0 8px', color: '#991b1b' }}>Type DELETE to confirm:</p>
              <input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} placeholder="Type DELETE" style={{ width: '100%', padding: '10px', border: '1px solid #fca5a5', borderRadius: '6px', marginBottom: '12px', fontFamily: 'monospace', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleDeleteAccount} disabled={loading || deleteConfirmText !== 'DELETE'} style={{ padding: '10px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', opacity: deleteConfirmText !== 'DELETE' ? 0.5 : 1 }}>{loading ? 'Deleting...' : 'Delete Account'}</button>
                <button onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '24px' }}>
          Data handled per Australian Privacy Principles · <a href="mailto:team@tritides.com.au" style={{ color: '#666' }}>team@tritides.com.au</a>
        </p>
      </div>
    </div>
  );
};
