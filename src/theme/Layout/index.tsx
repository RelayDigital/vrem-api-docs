import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import {useLocation} from '@docusaurus/router';
import type {Props} from '@theme/Layout';
import {SectionNavigation} from '../../components/DocsHome/DocsShell';

export default function Layout({children,...props}: Props) {
  const {pathname}=useLocation();
  const reference=pathname.replace(/\/$/,'')==='/api-reference';
  return <OriginalLayout {...props}>{reference ? <div className="vremly-reference-shell"><div className="vremly-reference-tabs"><SectionNavigation/></div>{children}</div> : children}</OriginalLayout>;
}
