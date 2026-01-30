import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guidesSidebar: [
    'overview',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'guides/getting-started',
        'guides/authentication',
        'guides/organization-context',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'guides/projects-workflow',
        'guides/media-management',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'guides/webhooks',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'guides/error-handling',
        'guides/rate-limits',
      ],
    },
  ],
};

export default sidebars;
