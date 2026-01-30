import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

const features = [
  {
    title: 'Guides',
    description: 'Step-by-step guides covering authentication, organization context, project workflows, and more.',
    link: '/guides',
    linkText: 'Read the Guides',
  },
  {
    title: 'API Reference',
    description: 'Complete endpoint documentation generated from the OpenAPI specification with request and response schemas.',
    link: '/api-reference',
    linkText: 'Explore the API',
  },
  {
    title: 'Webhooks',
    description: 'Subscribe to real-time events like project updates, delivery notifications, and message activity.',
    link: '/guides/guides/webhooks',
    linkText: 'Learn about Webhooks',
  },
];

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">VREM API Documentation</h1>
        <p className="hero__subtitle">
          Build integrations with the VX Real Estate Media platform.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/guides/guides/getting-started"
          >
            Get Started
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/api-reference"
            style={{ marginLeft: '1rem', color: '#fff', borderColor: '#fff' }}
          >
            API Reference
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({ title, description, link, linkText }: {
  title: string;
  description: string;
  link: string;
  linkText: string;
}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <h3>{title}</h3>
        <p>{description}</p>
        <Link to={link}>{linkText} &rarr;</Link>
      </div>
    </div>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Layout title="Home" description="VREM API Documentation — Build integrations with the VX Real Estate Media platform.">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
