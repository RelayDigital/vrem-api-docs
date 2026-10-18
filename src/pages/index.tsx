import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Icon, {type IconName} from '../components/DocsHome/Icon';
import styles from './home.module.css';
import {AuroraGradient} from '../components/DocsHome/AuroraGradient';

const paths: {icon: IconName; title: string; body: string; href: string; action: string}[] = [
  {icon:'code',title:'API platform',body:'Connect your own tools to projects, customers, media, and invoicing.',href:'/api',action:'Explore the API'},
  {icon:'spark',title:'AI assistants',body:'Bring Vremly into your assistant with the MCP connector.',href:'/guides/mcp',action:'Connect an assistant'},
  {icon:'book',title:'Platform guides',body:'Learn the concepts and workflows behind your integration.',href:'/guides/',action:'Browse the guides'},
];
const topics: {icon: IconName; title: string; body: string; href: string}[] = [
  {icon:'project',title:'Projects & production',body:'Follow the lifecycle of a shoot.',href:'/guides/projects-workflow'},
  {icon:'media',title:'Media & delivery',body:'Upload files and work with project media.',href:'/guides/media-management'},
  {icon:'webhook',title:'Events & webhooks',body:'Build workflows around what happens next.',href:'/guides/webhooks'},
  {icon:'key',title:'Authentication & scopes',body:'Give your integration the access it needs.',href:'/guides/authentication'},
  {icon:'team',title:'Organization context',body:'Understand how each request is scoped.',href:'/guides/organization-context'},
  {icon:'help',title:'Errors & troubleshooting',body:'Find the cause and keep moving.',href:'/guides/troubleshooting'},
];

export default function DeveloperHome(): React.JSX.Element {
  return <Layout title="Vremly Developers" description="Build on Vremly with APIs, AI connectors, and integration guides for real estate media.">
    <main className={styles.home}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}><p className={styles.eyebrow}>VREMLY DEVELOPERS</p><h1>Build with <span>Vremly.</span></h1><p className={styles.heroDescription}>Your tools. Your workflows. Connected to the platform that handles your real estate media.</p><div className={styles.actions}><Link to="/api" className={styles.primary}>Start building <span aria-hidden="true">→</span></Link><Link to="/guides/getting-started" className={styles.textAction}>Make your first request <span aria-hidden="true">↗</span></Link></div></div>

      </header>
      <section className={styles.pathGrid} aria-label="Developer platforms">{paths.map(path => <Link key={path.title} to={path.href} className={styles.path}><Icon name={path.icon}/><div><h2>{path.title}</h2><p>{path.body}</p><span>{path.action} <span aria-hidden="true">→</span></span></div></Link>)}</section>
      <section className={styles.promos} aria-label="Build with Vremly">
        <div className={styles.promo}><div className={styles.promoCopy}><h2>Build your workflow.</h2><p>Connect your tools to projects, media, and delivery. Start with a request and build from there.</p><Link to="/guides/getting-started" className={styles.primary}>Explore the API <span aria-hidden="true">↗</span></Link></div><div className={styles.auroraVisual} aria-hidden="true"><AuroraGradient status="DELIVERED" seed="developer-api" detail highContrast/><img className={styles.visualMark} src="/img/vremly-mark-white.svg" alt=""/><span className={styles.visualLabel}>Build on Vremly</span><span className={styles.visualEndpoint}>GET /projects <span>200 OK</span></span></div></div>
        <div className={styles.promo}><div className={styles.promoCopy}><h2>Your assistant, connected.</h2><p>Bring Vremly into Claude, ChatGPT, Cursor, or your coding agent through the MCP connector.</p><Link to="/guides/mcp" className={styles.primary}>Connect an assistant <span aria-hidden="true">↗</span></Link></div><div className={`${styles.auroraVisual} ${styles.connectorVisual}`} aria-hidden="true"><AuroraGradient status="DELIVERED" seed="developer-mcp" detail highContrast/><div className={styles.connectionMarks}><img src="/img/brands/mcp.svg" alt=""/><span>→</span><img src="/img/vremly-mark-white.svg" alt=""/></div><span className={styles.visualLabel}>Connected to your workflow.</span><span className={styles.visualEndpoint}>Model Context Protocol</span></div></div>
      </section>
      <section className={styles.topicSection} aria-labelledby="explore-heading"><div className={styles.sectionHeading}><h2 id="explore-heading">Build around your workflow.</h2></div><div className={styles.topics}>{topics.map(topic => <Link key={topic.href} to={topic.href}><span className={styles.topicIcon}><Icon name={topic.icon}/></span><div><h3>{topic.title}</h3><p>{topic.body}</p></div><span aria-hidden="true">↗</span></Link>)}</div></section>
      <section className={styles.machineResources} aria-label="Machine-readable documentation"><div><img className={styles.openapiLogo} src="/img/brands/openapi.svg" alt="OpenAPI" width="56" height="40"/><h2>Documentation for your tools, too.</h2><p>Use the OpenAPI specification or pass the documentation index to your AI assistant.</p></div><div className={styles.actions}><a href="/openapi/openapi.json" className={styles.secondary}>OpenAPI <span aria-hidden="true">↗</span></a><a href="/llms.txt" className={styles.secondary}>llms.txt <span aria-hidden="true">↗</span></a></div></section>
      <nav className={styles.resources} aria-label="More developer resources">{[{icon:'book',title:'Training academy',body:'Get to know the Vremly platform.',href:'https://training.vremly.com'},{icon:'help',title:'Help center',body:'Find answers and get support.',href:'https://vremly.com/support'},{icon:'code',title:'API reference',body:'Look up an endpoint.',href:'/api-reference'},{icon:'project',title:'Changelog',body:'See what has changed.',href:'/guides/changelog'}].map(item => <Link to={item.href} key={item.title}><Icon name={item.icon as IconName}/><h3>{item.title}</h3><p>{item.body}</p></Link>)}</nav>
    </main>
  </Layout>;
}
