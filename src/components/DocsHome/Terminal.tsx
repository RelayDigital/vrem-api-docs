import React, {type ReactNode} from 'react';

/** Read-only terminal output, distinct from commands readers should copy. */
export default function Terminal({children, title = 'Terminal output'}: {children: ReactNode; title?: string}) {
  return <section className="vremly-terminal" aria-label={title}><div className="vremly-terminal-header"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 6 6 6-6 6m9 0h7"/></svg><span>{title}</span></div>{children}</section>;
}
