import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('status');
    if (s) window.history.replaceState({}, '', '/');
    return s;
  });
  const [paidAmount] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('amount');
  });

  const amountRef = useRef(
    Math.round((Math.random() * (100 - 3.5) + 3.5) * 100) / 100
  );

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountRef.current }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  if (status === 'success') {
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

  if (status === 'cancel') {
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

  return (
    <div className="container">
      <div className="card">
        <h1>Give Me Money</h1>
        <p className="subtitle">How much? You'll find out after you click.</p>
        <button className="btn pay" onClick={handlePay} disabled={loading}>
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
      </div>
    </div>
  );
}

export default App;
