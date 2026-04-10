import { useState, useRef, useCallback, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import './App.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function useGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--glow-x', `${x}px`);
      el.style.setProperty('--glow-y', `${y}px`);

      // subtle 3D tilt
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateY = ((x - cx) / cx) * 4;
      const rotateX = ((cy - y) / cy) * 4;
      el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleLeave = () => {
      el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return glowRef;
}

function useDent(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--dent-x', `${x}px`);
      el.style.setProperty('--dent-y', `${y}px`);
      el.style.setProperty('--dent-opacity', '1');
    };

    const handleLeave = () => {
      el.style.setProperty('--dent-opacity', '0');
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [ref]);
}

function App() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [{ status, paidAmount }] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('status');
    const a = params.get('amount');
    if (s) window.history.replaceState({}, '', '/');
    return { status: s, paidAmount: a };
  });
  const [currentStatus, setStatus] = useState(status);

  const amountRef = useRef(
    Math.round((Math.random() * (100 - 3.5) + 3.5) * 100) / 100
  );

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountRef.current }),
    });
    const data = await res.json();
    return data.clientSecret;
  }, []);

  const cardRef = useGlow();
  const payBtnRef = useRef(null);
  useDent(payBtnRef);

  const handlePay = () => {
    setLoading(true);
    setShowCheckout(true);
  };

  if (currentStatus === 'success') {
    return (
      <div className="container">
        <div className="card">
          <div className="icon success">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1>Thank You!</h1>
          <p className="subtitle">
            感谢您向 Seimo 打款 <strong>¥{paidAmount || '?.??'}</strong> 元
          </p>
          <button className="btn" onClick={() => setStatus(null)}>
            再来一次？
          </button>
        </div>
      </div>
    );
  }

  if (currentStatus === 'cancel') {
    return (
      <div className="container">
        <div className="card">
          <div className="icon cancel">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <h1>Cancelled</h1>
          <p className="subtitle">Maybe next time</p>
          <button className="btn" onClick={() => setStatus(null)}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="container">
        <div className="checkout-wrapper">
          <button className="btn back" onClick={() => { setShowCheckout(false); setLoading(false); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            返回
          </button>
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card glow-card" ref={cardRef}>
        <h1>Give Me Money</h1>
        <p className="subtitle">How much? You'll find out after you click.</p>
        <button className="btn pay dent-btn" ref={payBtnRef} onClick={handlePay} disabled={loading}>
          {loading ? (
            <span className="spinner" />
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Pay Now
            </>
          )}
        </button>
        <p className="hint">Amount: ¥?.??</p>
        <a className="github-link" href="https://github.com/SeimoDev/GiveMeMoney" target="_blank" rel="noopener noreferrer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          Open Source
        </a>
      </div>
    </div>
  );
}

export default App;
