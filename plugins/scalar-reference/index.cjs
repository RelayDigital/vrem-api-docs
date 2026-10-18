const scalarPlugin = require('@scalar/docusaurus').default;

// Preserve Scalar's configuration serialization and route contract. Only the
// script's global injection and the route's loading lifecycle change.
module.exports = async function routeScopedScalar(context, options) {
  const plugin = await scalarPlugin(context, options);
  return {
    ...plugin,
    injectHtmlTags() { return {}; },
    contentLoaded(args) {
      return plugin.contentLoaded({
        ...args,
        actions: {
          ...args.actions,
          addRoute(route) {
            args.actions.addRoute({
              ...route,
              component: require.resolve('./ReferencePage.tsx'),
              scalarScript: options.cdn,
            });
          },
        },
      });
    },
  };
};
