import React, {useEffect, useId, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import '@scalar/docusaurus/dist/theme.css';

interface ScalarInstance { destroy: () => void }
interface ScalarElement extends HTMLDivElement { reference?: ScalarInstance }
interface ScalarWindow extends Window { Scalar?: unknown }
let scriptReady: Promise<void> | undefined;

function loadScalar(src: string) {
  if ((window as ScalarWindow).Scalar) return Promise.resolve();
  if (!scriptReady) {
    scriptReady = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        scriptReady = undefined;
        reject(new Error('The API reference could not load.'));
      };
      document.head.appendChild(script);
    });
  }
  return scriptReady;
}

export default function ReferencePage({route}: {route: {configuration: string; scalarScript: string}}) {
  const mount = useRef<ScalarElement>(null);
  const id = useId();
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const element = mount.current;
    let init: HTMLScriptElement | undefined;
    setError(false);
    loadScalar(route.scalarScript).then(() => {
      if (cancelled || !element) return;
      // Same trusted, build-time serialized configuration as the upstream
      // plugin. A real script preserves optional function-valued hooks.
      init = document.createElement('script');
      init.textContent = `document.getElementById(${JSON.stringify(id)}).reference = window.Scalar.createApiReference(document.getElementById(${JSON.stringify(id)}), ${route.configuration});`;
      document.body.appendChild(init);
    }).catch(() => { if (!cancelled) setError(true); });
    return () => {
      cancelled = true;
      element?.reference?.destroy();
      init?.remove();
    };
  }, [id, route.configuration, route.scalarScript, attempt]);

  return <Layout>
    <div className="vremly-reference-mount" id={id} ref={mount} hidden={error}/>
    {error && <div role="alert" className="vremly-reference-error">
      <p>The API reference could not load.</p>
      <button type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button>
      {' '}<a href="/openapi/openapi.json">Download the OpenAPI document</a>
    </div>}
  </Layout>;
}
