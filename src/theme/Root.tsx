import React from 'react';
import Head from '@docusaurus/Head';
import inter from '@site/static/fonts/inter-latin-variable.woff2';
import plex from '@site/static/fonts/ibm-plex-sans-latin-variable.woff2';

// Use the same asset URLs as webpack's CSS loader, so each font transfers once.
export default function Root({children}: {children: React.ReactNode}) {
  return <><Head>
    <link rel="preload" href={inter} as="font" type="font/woff2" crossOrigin="anonymous"/>
    <link rel="preload" href={plex} as="font" type="font/woff2" crossOrigin="anonymous"/>
  </Head>{children}</>;
}
