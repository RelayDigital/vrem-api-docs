import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import type {Props} from '@theme/Logo';

/** Render one stable wordmark; Docusaurus's default logo renders two themed
 * images during SSR, which can briefly paint over each other on refresh. */
export default function Logo(props: Props): ReactNode {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();
  const {
    navbar: {title: navbarTitle, logo},
  } = useThemeConfig();

  const {imageClassName, titleClassName, ...linkProps} = props;
  const logoHref = useBaseUrl(logo?.href || '/');
  const logoSrc = useBaseUrl(logo?.src || '/');
  const fallbackAlt = navbarTitle ? '' : title;
  const alt = logo?.alt ?? fallbackAlt;

  return (
    <Link
      to={logoHref}
      {...linkProps}
      {...(logo?.target && {target: logo.target})}>
      {logo && (
        <div className={imageClassName}>
          <img
            className={logo.className}
            src={logoSrc}
            alt={alt}
            width={logo.width}
            height={logo.height}
            style={logo.style}
            loading="eager"
            fetchPriority="high"
            draggable={false}
          />
        </div>
      )}
      {navbarTitle != null && <b className={titleClassName}>{navbarTitle}</b>}
    </Link>
  );
}
