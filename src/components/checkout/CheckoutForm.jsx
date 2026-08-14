// Shared form primitives
export function Field({ label, name, type = 'text', value, onChange, placeholder, required = true, colSpan = 1 }) {
  return (
    <div className={colSpan === 2 ? 'sm:col-span-2' : ''}>
      <label className="block font-body text-[0.46rem] tracking-[0.22em] uppercase text-[#8b7d6b] mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="co-input"
      />
    </div>
  );
}

export function SelectField({ label, name, value, onChange, options, required = true }) {
  return (
    <div>
      <label className="block font-body text-[0.46rem] tracking-[0.22em] uppercase text-[#8b7d6b] mb-1.5">
        {label}
      </label>
      <select name={name} value={value} onChange={onChange} required={required} className="co-input">
        <option value="">Select</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function ContinueBtn({ label = 'Continue →' }) {
  return (
    <button type="submit" className="co-continue-btn">
      {label}
    </button>
  );
}

export function BackBtn({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="font-body text-[0.55rem] tracking-[0.18em] uppercase text-[#8b7d6b] hover:text-[#1a1612] transition-colors flex items-center gap-1.5">
      ← Back
    </button>
  );
}

export const formStyles = `
  .co-input {
    width:100%; border:1.5px solid #e8e2d8; border-radius:12px;
    padding:0.75rem 1rem; font-family:'Montserrat',sans-serif;
    font-size:0.78rem; color:#1a1612; background:#fff; outline:none;
    transition:border-color 0.3s ease, box-shadow 0.3s ease;
    appearance: none;
  }
  .co-input:focus { border-color:#c9a96e; box-shadow:0 0 0 3px rgba(201,169,110,0.08); }
  .co-input::placeholder { color:rgba(26,22,18,0.3); }
  .co-continue-btn {
    width:100%; background:#1a1612; color:#faf7f2; border:none;
    border-radius:999px; padding:1rem;
    font-family:'Montserrat',sans-serif; font-size:0.6rem;
    font-weight:600; letter-spacing:0.25em; text-transform:uppercase;
    cursor:pointer; transition:background 0.3s ease, transform 0.2s ease;
    margin-top:0.5rem;
  }
  .co-continue-btn:hover { background:#2d2520; transform:scale(1.005); }
  .co-step { animation: coFadeIn 0.45s cubic-bezier(.22,1,.36,1) both; }
  @keyframes coFadeIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

  /* Dark mode — scoped under .co-dark (added to step cards) */
  .co-dark .co-input { border-color:#2d2926; color:#faf7f2; background:#16140f; }
  .co-dark .co-input::placeholder { color:rgba(250,247,242,0.35); }
  .co-dark .co-continue-btn { background:#c9a96e; color:#1a1612; }
  .co-dark .co-continue-btn:hover { background:#e8d5b0; }
`;
