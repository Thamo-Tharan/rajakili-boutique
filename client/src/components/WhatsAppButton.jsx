import { useEffect, useState } from 'react';
import config from '../config.js';
import { whatsappLink } from '../utils.js';

// In a real shop this opens WhatsApp with the order typed in.
// In the demo there is no real phone number, so it shows a preview instead of a broken WhatsApp page.
// onBeforeOpen: optional check; return false to stop (e.g. size not chosen yet)
export default function WhatsAppButton({ message, className = '', disabled = false, onBeforeOpen, children }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!config.demoStore) {
    return (
      <a
        className={`${className} ${disabled ? 'disabled' : ''}`}
        href={disabled ? undefined : whatsappLink(message)}
        target="_blank"
        rel="noreferrer"
        aria-disabled={disabled}
        onClick={(e) => {
          if (onBeforeOpen && onBeforeOpen() === false) e.preventDefault();
        }}
      >
        {children}
      </a>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        disabled={disabled}
        onClick={() => {
          if (onBeforeOpen && onBeforeOpen() === false) return;
          setOpen(true);
        }}
      >
        {children}
      </button>
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wa-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            <h2 id="wa-title">WhatsApp order preview</h2>
            <p className="muted">
              This is a demo store, so no message is sent. In a real shop, this button opens WhatsApp chat
              with the shop owner with this message already typed:
            </p>
            <div className="wa-bubble">{message}</div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setOpen(false)}>Got it</button>
              <button className="btn btn-ghost" onClick={copy}>{copied ? 'Copied ✓' : 'Copy message'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
