import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Globe, Volume2, Menu, X, Settings } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { AccountSettings } from '../components/AccountSettings';
import { useAuth } from '../context/AuthContext';

const FAQS = [
  { question: 'Which plan is best for communicating with elderly family members?', answer: 'The Family Plan ($29.99/month) is perfect for families. It includes 2 Pacific languages and voice translation so elderly family members can hear translations in a familiar voice.' },
  { question: 'What Pacific languages are supported?', answer: 'We support 17 Pacific Island languages including Tongan, Samoan, Hawaiian, Maori, Fijian, Bislama, Solomon Islands Pijin, Tok Pisin, Chamorro, Marshallese, Palauan, Kiribati, Niuean, Tuvaluan, Cook Islands Maori, Tokelauan and Hiri Motu.' },
  { question: 'Are authentic Pacific voices available?', answer: 'Yes! Tri Tides Talk uses real authentic Pacific voices — not robotic text-to-speech. We are currently using an authentic Pacific-Australian voice while our dialect recordings are completed.' },
  { question: 'How do the 15 free translations work?', answer: 'All new users get 15 free translations to try the service. No credit card required. Once you\'ve used your 15 free translations, you can subscribe to continue.' },
  { question: 'Can I cancel anytime?', answer: 'Yes — no lock-in contracts. Cancel your subscription at any time from account settings. Your access continues until end of billing period.' },
  { question: 'Is my data private?', answer: 'Yes. Built in Australia with privacy in mind. Your conversations are never stored or shared. We comply with Australian Privacy Principles.' },
];

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('signup');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) { navigate('/translator'); }
    else { setAuthTab('signup'); setShowAuthModal(true); }
  };

  return (
    <div className="landing-page">
      <nav className="lp-nav">
        <a href="/" className="lp-nav-logo">
          <Globe size={18} strokeWidth={1.5} />
          <span>Tri Tides <em>Talk</em></span>
        </a>
        <div className="lp-nav-links desktop">
          <a href="#features" className="lp-nav-link">Features</a>
          <a href="#pricing" className="lp-nav-link">Pricing</a>
          {isAuthenticated ? (
            <>
              <a href="/translator" className="lp-nav-link active">Translator</a>
              <button onClick={() => setShowAccountSettings(true)} className="lp-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Settings size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />Account
              </button>
              <button onClick={logout} className="lp-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Sign Out</button>
            </>
          ) : (
            <button onClick={handleGetStarted} className="lp-btn-primary">Try Free</button>
          )}
        </div>
        <button className="lp-mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="lp-mobile-menu">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          {isAuthenticated ? (
            <><a href="/translator">Translator</a><a href="#" onClick={logout}>Sign Out</a></>
          ) : (
            <a href="#" onClick={handleGetStarted}>Try Free</a>
          )}
        </div>
      )}

      <section className="lp-hero">
        <div className="lp-hero-tag">Pacific Voice Translator</div>
        <h1>Your voice. <em>Their language.</em> Real connection.</h1>
        <p>Breaking language barriers across 17 Pacific Island languages. From families to aged care — everyone deserves to be understood.</p>
        <div className="lp-hero-buttons">
          <button onClick={handleGetStarted} className="lp-btn-primary">Sign Up Free</button>
          <a href="#pricing" className="lp-btn-outline">View Pricing</a>
        </div>
        <p className="lp-hero-note">No app download needed. Works on any phone, tablet or computer.</p>
      </section>

      <div className="lp-trust-strip">
        <p>Why organisations trust Tri Tides Talk</p>
        <div className="lp-trust-items">
          <div className="lp-trust-item"><span className="lp-trust-number">17</span><span className="lp-trust-label">Pacific Island Languages</span></div>
          <div className="lp-trust-item"><span className="lp-trust-number">24/7</span><span className="lp-trust-label">Always Available</span></div>
          <div className="lp-trust-item"><span className="lp-trust-number">15</span><span className="lp-trust-label">Free Translations to Start</span></div>
          <div className="lp-trust-item"><span className="lp-trust-number">60x</span><span className="lp-trust-label">Cheaper Than a Human Interpreter</span></div>
          <div className="lp-trust-item"><span className="lp-trust-number">AU</span><span className="lp-trust-label">Built in Australia for Pacific Communities</span></div>
        </div>
      </div>

      <section className="lp-how-section" id="features">
        <div className="lp-section-tag">How it works</div>
        <h2 className="lp-section-title">Three steps. <em>That's it.</em></h2>
        <p className="lp-section-sub">No downloads. No setup. Just open, speak, and connect.</p>
        <div className="lp-how-grid">
          <div className="lp-how-step">
            <div className="lp-how-circle"><Mic size={32} strokeWidth={1.5} /></div>
            <div className="lp-how-number">01</div>
            <h3 className="lp-how-name">Speak</h3>
            <p className="lp-how-desc">Tap the microphone and speak in English. Or type your message — whatever feels natural.</p>
          </div>
          <div className="lp-how-arrow">→</div>
          <div className="lp-how-step">
            <div className="lp-how-circle translate">
              <Globe size={28} strokeWidth={1.5} />
              <div className="lp-translate-text">Hello → Mālō</div>
            </div>
            <div className="lp-how-number">02</div>
            <h3 className="lp-how-name">Translate</h3>
            <p className="lp-how-desc">AI instantly translates your words into any of 17 Pacific Island languages with cultural nuance.</p>
          </div>
          <div className="lp-how-arrow">→</div>
          <div className="lp-how-step">
            <div className="lp-how-circle"><Volume2 size={32} strokeWidth={1.5} /></div>
            <div className="lp-how-number">03</div>
            <h3 className="lp-how-name">Listen</h3>
            <p className="lp-how-desc">Hear the translation spoken aloud in a warm, authentic Pacific voice. Just like hearing family.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={handleGetStarted} className="lp-btn-primary">Try It Now — It's Free</button>
        </div>
      </section>

      <section className="lp-features-section">
        <div className="lp-features-header">
          <h2>Built for <em>real people</em> in real situations</h2>
          <p>From family dinners to aged care facilities — Tri Tides Talk speaks the languages that matter most.</p>
        </div>
        <div className="lp-features-grid">
          <div className="lp-feature-card dark"><div className="icon">🗣️</div><h3>Voice Translation</h3><p>Speak in English and hear the translation in a familiar Pacific voice. Designed for elderly users who struggle with screens.</p></div>
          <div className="lp-feature-card"><div className="icon">🌺</div><h3>17 Pacific Languages</h3><p>Tongan, Samoan, Hawaiian, Maori, Fijian, Bislama and 11 more Pacific Island languages — all in one app.</p></div>
          <div className="lp-feature-card"><div className="icon">🏥</div><h3>Healthcare Ready</h3><p>Medical phrase library built in. Nurses and community health workers can communicate clearly with Pacific patients.</p></div>
          <div className="lp-feature-card dark"><div className="icon">🎙️</div><h3>Real Pacific Voices</h3><p>Translations spoken in authentic recorded voices — not robotic text-to-speech. Hear a voice that feels like home.</p></div>
          <div className="lp-feature-card"><div className="icon">📱</div><h3>Works on Any Device</h3><p>No app download needed. Works in any browser on any phone, tablet or computer.</p></div>
          <div className="lp-feature-card"><div className="icon">🔒</div><h3>Private & Secure</h3><p>Built in Australia with privacy in mind. Your conversations are never stored or shared.</p></div>
        </div>
      </section>

      <section className="lp-story-section">
        <div className="lp-story-card">
          <div className="lp-story-quote">"</div>
          <p className="lp-story-text">This app was built for two people. <strong>Leone</strong> — my grandfather — who sits in hospital rooms not understanding a word his nurses say to him, confused and alone in a language that isn't his. And <strong>Malia</strong> — my mum — who lives with Parkinson's and struggles to see the screen, but needs to hear a voice she trusts.<br /><br />They inspired every decision made in building Tri Tides Talk. No Pacific family should ever feel lost in conversation — and no healthcare worker should ever be without the tools to truly communicate with their patients.</p>
          <p className="lp-story-sig">— Built for Leone & Malia 🌺</p>
        </div>
      </section>

      <section className="lp-pricing-section" id="pricing">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="lp-section-tag">Simple, honest pricing</div>
          <h2 className="lp-section-title">Communication that <em>connects</em> families</h2>
          <p className="lp-section-sub">From individual families to aged care facilities. Start with 15 free translations.</p>
        </div>
        <div className="lp-pricing-grid">
          <div className="lp-plan-card">
            <div className="lp-plan-icon">👨‍👩‍👧</div>
            <div className="lp-plan-name">Family Plan</div>
            <div className="lp-plan-subtitle">Families</div>
            <div className="lp-price-row"><span className="lp-price-currency">$</span><span className="lp-price-amount">29.99</span></div>
            <div className="lp-price-period">per month</div>
            <p className="lp-plan-desc">Family members helping parents/grandparents</p>
            <ul className="lp-feature-list"><li className="lp-feature-item">2 devices</li><li className="lp-feature-item">2 languages</li></ul>
            <button onClick={handleGetStarted} className="lp-plan-btn outline">Get Started</button>
          </div>
          <div className="lp-plan-card featured">
            <div className="lp-featured-badge">Most Popular</div>
            <div className="lp-plan-icon">👥</div>
            <div className="lp-plan-name">Community Plan</div>
            <div className="lp-plan-subtitle">Groups</div>
            <div className="lp-price-row"><span className="lp-price-currency">$</span><span className="lp-price-amount">79</span></div>
            <div className="lp-price-period">per month</div>
            <p className="lp-plan-desc">Churches and community groups</p>
            <ul className="lp-feature-list"><li className="lp-feature-item">5 devices</li><li className="lp-feature-item">6 languages</li></ul>
            <button onClick={handleGetStarted} className="lp-plan-btn solid">Get Started</button>
          </div>
          <div className="lp-plan-card">
            <div className="lp-plan-icon">🏠</div>
            <div className="lp-plan-name">Care Home Plan</div>
            <div className="lp-plan-subtitle">Aged Care</div>
            <div className="lp-price-row"><span className="lp-price-currency">$</span><span className="lp-price-amount">199</span></div>
            <div className="lp-price-period">per month</div>
            <p className="lp-plan-desc">Aged care homes and disability care</p>
            <ul className="lp-feature-list"><li className="lp-feature-item">10 devices</li><li className="lp-feature-item">12 languages</li></ul>
            <button onClick={handleGetStarted} className="lp-plan-btn outline">Get Started</button>
          </div>
          <div className="lp-plan-card enterprise-card">
            <div className="lp-plan-icon">🏥</div>
            <div className="lp-plan-name">Hospital Plan</div>
            <div className="lp-plan-subtitle">Hospitals</div>
            <div className="lp-price-row"><span className="lp-price-amount" style={{ fontSize: '32px' }}>Custom</span></div>
            <div className="lp-price-period">$500+/mo</div>
            <p className="lp-plan-desc">Hospitals needing many devices and full support</p>
            <ul className="lp-feature-list"><li className="lp-feature-item">Unlimited devices</li><li className="lp-feature-item">All languages</li></ul>
            <a href="mailto:team@tritides.com.au?subject=Hospital Plan Inquiry" className="lp-plan-btn enterprise">Contact Us</a>
          </div>
        </div>
      </section>

      <section className="lp-faq-section">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="lp-section-title">Common <em>questions</em></h2>
        </div>
        {FAQS.map((faq, idx) => (
          <div key={idx} className={`lp-faq-item ${openFaq === idx ? 'open' : ''}`}>
            <div className="lp-faq-q" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
              <span>{faq.question}</span><span className="lp-faq-icon">+</span>
            </div>
            <div className="lp-faq-a">{faq.answer}</div>
          </div>
        ))}
      </section>

      <section className="lp-cta-section">
        <h2>Start <em>speaking</em> their language today</h2>
        <p>15 free translations. No credit card required.</p>
        <button onClick={handleGetStarted} className="lp-btn-white">Try Tri Tides Talk Free</button>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-logo">Tri Tides <em>Talk</em></div>
        <div className="lp-footer-links">
          <a href="https://tritides.com.au">tritides.com.au</a>
          <a href="mailto:team@tritides.com.au">team@tritides.com.au</a>
        </div>
        <p className="lp-footer-copy">Pacific Voice Translator · Built in Australia for Pacific families 🇦🇺 · © {new Date().getFullYear()} Tri Tides Talk</p>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab={authTab} />
      <AccountSettings isOpen={showAccountSettings} onClose={() => setShowAccountSettings(false)} />
    </div>
  );
};

export default LandingPage;
