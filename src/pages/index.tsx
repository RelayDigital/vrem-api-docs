import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

/**
 * The documentation home page.
 *
 * Every literal on this page is copied from something verified against the
 * running server — the routes, the header names, the scope list, the webhook
 * event names, the three rate-limit windows. Nothing here is illustrative.
 * If the API changes, this page is wrong and must be changed with it; a
 * plausible-looking example that does not actually work costs a developer
 * their first hour, which is the hour they decide whether to keep going.
 *
 * There are deliberately no customer counts, logos, testimonials or
 * time-saved figures: Vremly is pre-launch, so any such claim would be
 * invented.
 */

/** A minimal syntax-coloured line. Hand-rolled rather than pulling a
 *  highlighter in — the hero shows nine lines of shell and JSON, and a
 *  runtime highlighter for that is weight the first paint does not need. */
function Ln({ children }: { children: React.ReactNode }) {
  return <span className={styles.ln}>{children}</span>;
}

function RequestPanel() {
  return (
    <div className={styles.panel} aria-label="Example request and the webhook it produces">
      <div className={styles.panelBar}>
        <span className={styles.panelDot} />
        <span className={styles.panelDot} />
        <span className={styles.panelDot} />
        <span className={styles.panelTitle}>subscribe</span>
      </div>

      <pre className={styles.code}>
        <code>
          {/* Broken after the method so the URL starts its own line: at the
              panel's width the single-line form ran past the right edge and
              the route — the most important thing here — was the part that
              got clipped. */}
          <Ln>
            <span className={styles.prompt}>$</span> curl -X POST \
          </Ln>
          <Ln>
            {'  '}https://api.vremly.com/webhooks/subscriptions \
          </Ln>
          <Ln>
            {'  '}-H <span className={styles.str}>"x-api-key: $VREMLY_API_KEY"</span> \
          </Ln>
          <Ln>
            {'  '}-d <span className={styles.str}>{"'{\"url\":\"https://example.com/hooks\","}</span>
          </Ln>
          <Ln>
            {'      '}
            <span className={styles.str}>{'"events":["DELIVERY_APPROVED"]}\''}</span>
          </Ln>
        </code>
      </pre>

      <div className={styles.panelSplit}>
        <span>then, when a client signs off</span>
      </div>

      <pre className={styles.code}>
        <code>
          <Ln>
            <span className={styles.punc}>{'{'}</span>
          </Ln>
          <Ln>
            {'  '}
            <span className={styles.key}>"event"</span>
            <span className={styles.punc}>: </span>
            <span className={styles.str}>"DELIVERY_APPROVED"</span>
            <span className={styles.punc}>,</span>
          </Ln>
          <Ln>
            {'  '}
            <span className={styles.key}>"data"</span>
            <span className={styles.punc}>: {'{'}</span>
          </Ln>
          <Ln>
            {'    '}
            <span className={styles.key}>"projectId"</span>
            <span className={styles.punc}>: </span>
            <span className={styles.str}>"proj_xyz789"</span>
            <span className={styles.punc}>,</span>
          </Ln>
          <Ln>
            {'    '}
            <span className={styles.key}>"approvedAt"</span>
            <span className={styles.punc}>: </span>
            <span className={styles.str}>"2026-09-05T12:00:00.000Z"</span>
          </Ln>
          <Ln>
            {'  '}
            <span className={styles.punc}>{'}'}</span>
          </Ln>
          <Ln>
            <span className={styles.punc}>{'}'}</span>
          </Ln>
        </code>
      </pre>
    </div>
  );
}

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.wrap}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Vremly API</p>
            <h1 className={styles.title}>
              Run a real-estate media business from your own tooling.
            </h1>
            <p className={styles.lede}>
              A REST API over shoots, customers, media delivery, invoicing and
              webhooks. Call it from GoHighLevel, n8n, a cron job or a single
              line of <code>curl</code> — an API key is all it takes.
            </p>
            <div className={styles.actions}>
              <Link className={styles.btnPrimary} to="/guides/getting-started">
                Make your first request
              </Link>
              <Link className={styles.btnGhost} to="/api-reference">
                API reference
              </Link>
            </div>
            <p className={styles.heroNote}>
              Authenticate with <code>x-api-key</code>. The organization comes
              from the key, so there is no tenant header to get wrong.
            </p>
          </div>

          <RequestPanel />
        </div>
      </div>
    </header>
  );
}

const routes = [
  {
    to: '/guides/getting-started',
    label: 'Getting started',
    body: 'Issue a key, send a first authenticated request, and read the response you get back.',
  },
  {
    to: '/api-reference',
    label: 'API reference',
    body: 'Every endpoint, generated from the backend’s own source rather than written by hand — 854 routes, with the request and response shapes the server really uses.',
  },
  {
    to: '/guides/webhooks',
    label: 'Webhooks',
    body: 'Subscribe to events, verify the signature over the raw body, and handle at-least-once delivery correctly.',
  },
];

function Routes() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.cards}>
          {routes.map((r) => (
            <Link key={r.to} to={r.to} className={styles.card}>
              <h2 className={styles.cardTitle}>{r.label}</h2>
              <p className={styles.cardBody}>{r.body}</p>
              <span className={styles.cardGo} aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* The real enum, in the order the guide lists it. A developer scanning for
   "is the thing I need to react to in here?" is the whole purpose of this
   block, so it shows the actual names rather than a prose summary. */
const events = [
  'PROJECT_CREATED',
  'PROJECT_ASSIGNED',
  'PROJECT_STATUS_CHANGED',
  'PROJECT_DELIVERED',
  'DELIVERY_APPROVED',
  'INVOICE_CREATED',
  'INVOICE_SENT',
  'INVOICE_PAID',
  'INVOICE_VOIDED',
  'CUSTOMER_CREATED',
  'CUSTOMER_UPDATED',
];

function Events() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.split}>
          <div className={styles.splitCopy}>
            <h2 className={styles.h2}>Eleven events, no polling</h2>
            <p className={styles.body}>
              Register a URL and Vremly posts to it. Each request carries{' '}
              <code>X-Webhook-Signature</code> as{' '}
              <code>t=&lt;unix&gt;,v1=&lt;hmac&gt;</code> — an HMAC-SHA256 over
              the timestamp, a dot, and the raw body.
            </p>
            <p className={styles.body}>
              <strong>
                <code>PROJECT_DELIVERED</code> and <code>DELIVERY_APPROVED</code>{' '}
                are different moments.
              </strong>{' '}
              The first fires when the company sends the work; the second when
              the client accepts it. A sent delivery can still come back as a
              revision request, so a pipeline stage that means “fulfilled”
              wants approval.
            </p>
            <Link className={styles.textLink} to="/guides/webhooks">
              Payloads, retries and verification →
            </Link>
          </div>
          <ul className={styles.chips}>
            {events.map((e) => (
              <li key={e} className={styles.chip}>
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const scopes = [
  ['READ', 'GET, HEAD, OPTIONS'],
  ['WRITE', 'Everything READ allows, plus POST, PUT, PATCH, DELETE'],
  ['ADMIN', 'Everything'],
  ['BULK_IMPORT', 'The bulk import endpoints, and nothing else'],
  ['WEBHOOKS', 'Managing webhook subscriptions'],
];

function Scopes() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Scopes are enforced on every request</h2>
        <p className={styles.bodyWide}>
          A key carries scopes and the server checks them per route, not per
          controller. Grant the least an integration needs — a workflow that
          only reads delivery status should hold <code>READ</code>, so a mistake
          in that workflow cannot change anything.
        </p>
        <dl className={styles.scopeList}>
          {scopes.map(([name, grants]) => (
            <div key={name} className={styles.scopeRow}>
              <dt className={styles.scopeName}>{name}</dt>
              <dd className={styles.scopeGrants}>{grants}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.bodyWide}>
          A request whose key lacks the scope returns <code>403</code> naming
          what was needed and what the key holds. Rate limits are three
          simultaneous windows — 3 per second, 20 per 10 seconds, 100 per minute
          — bucketed per key, so platforms that share egress IPs do not compete
          for one allowance.
        </p>
        <div className={styles.actions}>
          <Link className={styles.btnGhost} to="/guides/authentication">
            Authentication
          </Link>
          <Link className={styles.btnGhost} to="/guides/rate-limits">
            Rate limits
          </Link>
        </div>
      </div>
    </section>
  );
}

function Agents() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.agentCard}>
          <h2 className={styles.h2}>Built to be read by machines too</h2>
          <p className={styles.body}>
            The reference is generated from the backend’s own source, and an{' '}
            <a href="pathname:///llms.txt">llms.txt</a> index sits at the site root for
            coding agents. Point a model at the specification rather than at
            prose — it is the authority whenever the two disagree.
          </p>
          <div className={styles.actions}>
            <a className={styles.btnGhost} href="pathname:///llms.txt">
              llms.txt
            </a>
            <a
              className={styles.btnGhost}
              href="pathname:///openapi/openapi.json"
            >
              OpenAPI document
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="Vremly API"
      description="REST API for real-estate media production — shoots, customers, media delivery, invoicing and webhooks. Call it from GoHighLevel, n8n, or curl."
    >
      <Hero />
      <Routes />
      <Events />
      <Scopes />
      <Agents />
    </Layout>
  );
}
