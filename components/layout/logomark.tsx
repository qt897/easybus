export function Logomark() {
  return (
    <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="3.5" r="2.1" fill="currentColor" />
        <line x1="9" y1="5.6" x2="9" y2="12.4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 12.4 L6.4 16 H11.6 Z" fill="currentColor" />
      </svg>
    </div>
  );
}
