import React from 'react';
import type {Props} from '@theme/DocRoot/Layout';
import DocsShell from '../../../components/DocsHome/DocsShell';

export default function DocRootLayout({children}: Props) {
  return <DocsShell><div className="vremly-guide-body">{children}</div></DocsShell>;
}
