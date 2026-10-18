import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import Icon from './Icon';
import styles from '../../pages/index.module.css';

const groups = [
  {title:'Get started', items:[['Platform overview','/guides/'],['Quickstart','/guides/getting-started'],['Authentication','/guides/authentication'],['Organization context','/guides/organization-context']]},
  {title:'Build your workflow', items:[['Projects','/guides/projects-workflow'],['Media management','/guides/media-management'],['Webhooks','/guides/webhooks'],['AI assistants & MCP','/guides/mcp']]},
  {title:'Ship & operate', items:[['Rate limits','/guides/rate-limits'],['Error handling','/guides/error-handling'],['Troubleshooting','/guides/troubleshooting'],['Changelog','/guides/changelog']]},
];
const normalize = (path:string) => path.replace(/\/$/,'') || '/';
function DocumentationNavigation() {
  const {pathname} = useLocation();
  function item(label:string, href:string) {
    const active=normalize(pathname)===normalize(href);
    return <Link key={href} to={href} className={active ? styles.activeNav : undefined} aria-current={active ? 'page' : undefined}>{label}</Link>;
  }
  return <><div className={styles.sidebarInner}>{item('API overview','/api')}{groups.map(group=><nav key={group.title} aria-label={group.title}><h2>{group.title}</h2>{group.items.map(([label,href])=>item(label,href))}</nav>)}<Link to="/api-reference" className={styles.referenceLink}><Icon name="code"/>API reference<span aria-hidden="true">↗</span></Link><div className={styles.sidebarNote}><span className={styles.statusDot}/><span>API base URL<code>api.vremly.com</code></span></div></div></>;
}
export function SectionNavigation() {
  const {pathname} = useLocation();
  const path=normalize(pathname);
  const active=path==='/guides/mcp' ? '/guides/mcp' : path==='/api-reference' ? '/api-reference' : ['/guides/getting-started','/guides/authentication','/guides/organization-context'].includes(path) ? '/guides/getting-started' : '/api';
  return <nav className={styles.sectionNav} aria-label="Developer sections">{[['Overview','/api'],['Quickstart','/guides/getting-started'],['AI assistants','/guides/mcp'],['API reference','/api-reference']].map(([label,href])=><Link to={href} key={href} aria-current={active===href ? 'page' : undefined}>{label}</Link>)}</nav>;
}
export default function DocsShell({children}: {children:ReactNode}) {
  return <div className={styles.shell}><aside className={styles.sidebar} aria-label="Documentation navigation"><DocumentationNavigation/></aside><main className={styles.content}><details className="vremly-mobile-doc-nav"><summary>Browse API guides</summary><DocumentationNavigation/></details><SectionNavigation/>{children}</main></div>;
}
