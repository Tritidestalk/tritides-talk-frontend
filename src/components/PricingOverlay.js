import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PLANS = [
  {
    id: 'family',
    name: 'Family Plan',
    audience: 'Families',
    priceDisplay: '$29.99',
    period: '/mo',
    features: ['2 devices', '2 languages'],
    description: 'Family members helping parents/grandparents',
    paypalPlanId: 'P-5A683013Y8495031FNG7GVNY',
  },
  {
    id: 'community',
    name: 'Community Plan',
    audience: 'Groups',
    priceDisplay: '$79',
    period: '/mo',
    features: ['5 devices', '6 languages'],
    description: 'Churches and community groups',
    popular: true,
    paypalPlanId: 'P-6NV62558A6080772CNG7GYQY',
  },
  {
    id: 'care_home',
    name: 'Care Home Plan',
    audience: 'Aged Care',
    priceDisplay: '$199',
    period: '/mo',
    features: ['10 devices', '12 languages'],
    description: 'Aged care homes and disability care',
    paypalPlanId: 'P-3FG30368MT495545PNG7G3EQ',
  },
  {
    id: 'hospital',
    name: 'Hospital Plan',
    audience: 'Hospitals',
    priceDisplay: 'Custom',
    period: ' $500+/mo',
    features: ['Unlimited devices', 'All languages'],
    description: 'Hospitals needing many devices and full support',
    contact: true,
  },
];

const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'test';

export const PricingOverlay = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const { token, refreshUser } = useAuth();

  if (!isOpen) return null;

  const handleSelectPlan = (plan) => {
    if (plan.contact) {
      window.location.href = 'mailto:team@tritides.com.au?subject=Hospital Plan Inquiry';
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
    setPaymentError('');
  };

  const handlePaymentSuccess = async (details) => {
    try {
      await axios.post(`${API}/subscription/create`,
        { plan: selectedPlan.id, selected_languages: [], paypal_subscription_id: details.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentSuccess(true);
      await refreshUser();
      setTimeout(() => { onClose(); window.location.reload(); }, 2000);
    } catch (error) {
      setPaymentError('Failed to activate subscription. Please contact team@tritides.com.au');
    }
  };

  if (paymentSuccess) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
        <div style={{ background: '#fff', maxWidth: '400px', width: '100%', margin: '0 16px', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '28px' }}>✓</div>
          <h2 style={{ fontFamily: 'serif', fontSize: '28px', fontWeight: 400, margin: '0 0 12px' }}>Payment Successful!</h2>
          <p style={{ color: '#666' }}>Your {selectedPlan?.name} is now active.</p>
        </div>
      </div>
    );
  }

  if (showPayment && selectedPlan) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', overflowY: 'auto', padding: '32px 0' }}>
        <div style={{ background: '#fff', maxWidth: '440px', width: '100%', margin: '0 16px', borderRadius: '12px', padding: '40px', position: 'relative' }}>
          <button onClick={() => { setShowPayment(false); setSelectedPlan(null); }} style={{ position: 'absolute', top: '16px', left: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '13px' }}>← Back</button>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}>✕</button>

          <div style={{ textAlign: 'center', margin: '24px 0 32px' }}>
            <h2 style={{ fontFamily: 'serif', fontSize: '24px', fontWeight: 400, margin: '0 0 8px' }}>Complete Your Purchase</h2>
            <p style={{ color: '#666' }}>{selectedPlan.name} — {selectedPlan.priceDisplay}/month</p>
          </div>

          {paymentError && <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '13px', marginBottom: '16px' }}>{paymentError}</div>}

          <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '24px' }}>
            <p style={{ fontWeight: 500, margin: '0 0 8px', fontSize: '14px' }}>Plan includes:</p>
            {selectedPlan.features.map((f, i) => <p key={i} style={{ margin: '4px 0', fontSize: '13px', color: '#555' }}>✓ {f}</p>)}
          </div>

          <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "AUD", intent: "subscription", vault: true }}>
            <PayPalButtons
              style={{ layout: "vertical", color: "black", shape: "pill", label: "subscribe" }}
              createSubscription={(data, actions) => actions.subscription.create({ plan_id: selectedPlan.paypalPlanId })}
              onApprove={(data) => handlePaymentSuccess({ id: data.subscriptionID })}
              onError={() => setPaymentError('Payment failed. Please try again or contact support.')}
            />
          </PayPalScriptProvider>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '16px' }}>Secure payment powered by PayPal. Cancel anytime.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', overflowY: 'auto', padding: '32px 0' }}>
      <div style={{ background: '#fff', maxWidth: '900px', width: '100%', margin: '0 16px', borderRadius: '16px', border: '2px solid #000', padding: '48px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'serif', fontSize: '36px', fontWeight: 400, margin: '0 0 12px' }}>Choose Your Plan</h2>
          <p style={{ color: '#666', fontSize: '16px' }}>You've used your 15 free translations. Subscribe to continue.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{ border: plan.popular ? '2px solid #000' : '1px solid #eee', borderRadius: '12px', padding: '24px', position: 'relative', background: plan.popular ? '#000' : '#fff', color: plan.popular ? '#fff' : '#000' }}>
              {plan.popular && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#000', fontSize: '10px', fontWeight: 600, padding: '4px 12px', borderRadius: '50px', whiteSpace: 'nowrap' }}>Most Popular</div>}
              <h3 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 400, margin: '0 0 4px' }}>{plan.name}</h3>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6, margin: '0 0 16px' }}>{plan.audience}</p>
              <div style={{ fontSize: '36px', fontFamily: 'serif', margin: '0 0 4px' }}>{plan.priceDisplay}</div>
              <p style={{ opacity: 0.6, fontSize: '12px', margin: '0 0 16px' }}>{plan.period}</p>
              {plan.features.map((f, i) => <p key={i} style={{ margin: '4px 0', fontSize: '13px', opacity: 0.8 }}>— {f}</p>)}
              <p style={{ fontSize: '12px', opacity: 0.7, margin: '12px 0 20px' }}>{plan.description}</p>
              <button onClick={() => handleSelectPlan(plan)} style={{ width: '100%', padding: '12px', background: plan.popular ? '#fff' : '#000', color: plan.popular ? '#000' : '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                {plan.contact ? 'Contact Us' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '14px' }}>Maybe Later</button>
        </div>
      </div>
    </div>
  );
};
