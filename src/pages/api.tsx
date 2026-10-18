import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {AuroraGradient} from '../components/DocsHome/AuroraGradient';
import Quickstart from '../components/DocsHome/Quickstart';
import Icon, {type IconName} from '../components/DocsHome/Icon';
import styles from './index.module.css';
import DocsShell from '../components/DocsHome/DocsShell';

const workflows: {icon: IconName; title: string; description: string; href: string}[] = [
  {icon:'project',title:'Work with projects',description:'Follow a shoot from booking through production and delivery.',href:'/guides/projects-workflow'},
  {icon:'media',title:'Upload and deliver media',description:'Move photos, video, and floor plans through your workflow.',href:'/guides/media-management'},
  {icon:'webhook',title:'React to events',description:'Subscribe to updates and verify incoming webhook signatures.',href:'/guides/webhooks'},
  {icon:'key',title:'Manage API access',description:'Choose credentials and scopes for your integration.',href:'/guides/authentication'},
  {icon:'team',title:'Connect an organization',description:'Understand how tenant context follows each request.',href:'/guides/organization-context'},
  {icon:'help',title:'Handle errors',description:'Understand response codes and recover from failed requests.',href:'/guides/error-handling'},
];

export default function Home(): React.JSX.Element {
  return <Layout title="API platform" description="Build with the Vremly API and MCP connector. Quickstarts, workflow guides, and API reference for real estate media.">
    <DocsShell>
        <header className={styles.heading}><p className={styles.smallLabel}>VREMLY DEVELOPERS</p><h1>API platform</h1><p>Bring your tools, your team, and your AI assistants into Vremly.</p></header>
        <Quickstart />
        <section className={styles.connector} aria-label="Connect an AI assistant"><div className={styles.connectorIcon}><img src="/img/brands/mcp.svg" alt="" width="22" height="22"/></div><div><h2>Vremly, in your AI assistant.</h2><p>Connect through MCP and work with projects, customers, and invoices.</p></div><Link className={styles.secondary} to="/guides/mcp">Connect an assistant <span aria-hidden="true">↗</span></Link></section>
        <section className={styles.section} aria-labelledby="build-paths"><div className={styles.sectionHeading}><h2 id="build-paths">Choose how you build</h2><Link to="/guides/">Explore the guides <span aria-hidden="true">→</span></Link></div>
          <div className={styles.buildPaths}>
            <Link to="/guides/getting-started" className={styles.pathCard}><div className={`${styles.pathArt} ${styles.apiArt}`}><AuroraGradient status="DELIVERED" seed="developer-api" detail highContrast/><span className={styles.artLabel}><Icon name="code"/>REST API</span></div><div className={styles.pathCopy}><h3>Build your own integration</h3><p>Connect your apps to projects, customers, media, and invoicing through the REST API.</p><span>Start with the API <span aria-hidden="true">↗</span></span></div></Link>
            <Link to="/guides/mcp" className={styles.pathCard}><div className={`${styles.pathArt} ${styles.assistantArt}`}><AuroraGradient status="DELIVERED" seed="developer-mcp" detail highContrast/><span className={styles.artLabel}><Icon name="spark"/>MCP CONNECTOR</span></div><div className={styles.pathCopy}><h3>Work through an AI assistant</h3><p>Connect your assistant to Vremly. Your credentials determine what it can access.</p><span>Set up the connector <span aria-hidden="true">↗</span></span></div></Link>
          </div>
        </section>
        <section className={styles.section} aria-labelledby="workflow-guides"><div className={styles.sectionHeading}><h2 id="workflow-guides">What do you want to build?</h2></div><div className={styles.workflowGrid}>{workflows.map(item => <Link key={item.href} to={item.href} className={styles.workflowLink}><span className={styles.iconTile}><Icon name={item.icon}/></span><div><h3>{item.title}</h3><p>{item.description}</p></div><span className={styles.linkArrow} aria-hidden="true">↗</span></Link>)}</div></section>
        <section className={styles.section} aria-labelledby="production"><div className={styles.sectionHeading}><h2 id="production">Take it to production</h2></div><div className={styles.productionLinks}>{[['01','Know your limits','Rate limits and request windows.','/guides/rate-limits'],['02','Plan for failures','Error responses and recovery.','/guides/error-handling'],['03','Find the answer','Troubleshooting common issues.','/guides/troubleshooting']].map(([number,title,description,href]) => <Link to={href} key={href}><span>{number}</span><h3>{title}</h3><p>{description}</p><span aria-hidden="true">↗</span></Link>)}</div></section>
        <nav className={styles.resources} aria-label="Developer resources">{[{icon:'book',label:'Training',body:'Learn the platform.',href:'https://training.vremly.com'},{icon:'help',label:'Help center',body:'Get help from Vremly.',href:'https://vremly.com/support'},{icon:'code',label:'OpenAPI',body:'Download the specification.',href:'pathname:///openapi/openapi.json'},{icon:'spark',label:'For AI tools',body:'Read the documentation index.',href:'pathname:///llms.txt'}].map(item => <Link key={item.label} to={item.href}><Icon name={item.icon as IconName}/><h3>{item.label}</h3><p>{item.body}</p></Link>)}</nav>
    </DocsShell>
  </Layout>;
}
