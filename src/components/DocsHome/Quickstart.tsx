import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import LanguageSelect from './LanguageSelect';
import styles from '../../pages/index.module.css';

const examples = {
  JavaScript: {language: 'javascript', code: `const response = await fetch(
  "https://api.vremly.com/projects",
  {
    headers: {
      "x-api-key": process.env.VREMLY_API_KEY,
    },
  },
);

const projects = await response.json();
console.log(projects);`},
  Python: {language: 'python', code: `import json
import os
from urllib.request import Request, urlopen

request = Request(
    "https://api.vremly.com/projects",
    headers={"x-api-key": os.environ["VREMLY_API_KEY"]},
)

with urlopen(request) as response:
    print(json.load(response))`},
  cURL: {language: 'bash', code: `curl https://api.vremly.com/projects \\
  -H "x-api-key: $VREMLY_API_KEY"`},
};

export default function Quickstart() {
  const [language, setLanguage] = useState<keyof typeof examples>('JavaScript');
  const example = examples[language];
  return <section className={styles.quickstart} aria-labelledby="quickstart-title">
    <div className={styles.quickstartCopy}>
      <span className={styles.smallLabel}>START HERE</span>
      <h2 id="quickstart-title">Your first API request.</h2>
      <p>Create a key, connect your organization, and read your projects. Start small, then build your workflow.</p>
      <div className={styles.actions}>
        <Link className={styles.primary} to="/guides/getting-started">Get started <span aria-hidden="true">→</span></Link>
        <a className={styles.secondary} href="https://app.vremly.com/settings/developers/api-keys">Create API key</a>
      </div>
    </div>
    <div className={styles.codePanel}>
      <div className={styles.codeToolbar}><span>GET <span className={styles.codePath}>/projects</span></span><LanguageSelect value={language} onChange={value => setLanguage(value as keyof typeof examples)} options={Object.keys(examples)} /></div>
      <CodeBlock language={example.language}>{example.code}</CodeBlock>
    </div>
  </section>;
}
