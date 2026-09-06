import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guidesSidebar: [
    'overview',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started',
        'authentication',
        'organization-context',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'projects-workflow',
        'media-management',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'webhooks',
        'mcp',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'error-handling',
        'rate-limits',
      ],
    },
    'troubleshooting',
    'changelog',
  ],
};

export default sidebars;
