import React, {useEffect, useRef, useState, type ReactNode} from 'react';

/** Shared single-value copy control for URLs and connector addresses. */
export default function CopyField({value, children}: {value: string; children?: ReactNode}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch { setCopied(false); }
  }
  return <div className={`vremly-copy-field${children ? " vremly-copy-field-multiline" : ""}`}><div className="vremly-copy-content">{children ?? <code>{value}</code>}</div><button type="button" onClick={copy} aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'} title={copied ? 'Copied' : 'Copy'}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{copied ? <path d="m5 12 4 4L19 6"/> : <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/></>}</svg></button><span className="sr-only" role="status">{copied ? 'Copied to clipboard' : ''}</span></div>;
}
