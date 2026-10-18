const assert = require('node:assert/strict');
const createPlugin = require('../plugins/scalar-reference/index.cjs');

(async () => {
  const plugin = await createPlugin({siteConfig: {baseUrl: '/', themeConfig: {navbar: {items: []}}}}, {
    route: '/api-reference', showNavLink: false,
    cdn: '/vendor/scalar-api-reference-1.67.0.js',
    configuration: {url: '/openapi/openapi.json', onLoaded: () => 'preserved'},
  });
  assert.deepEqual(plugin.injectHtmlTags(), {});
  const routes = [];
  await plugin.contentLoaded({content: await plugin.loadContent(), actions: {addRoute: route => routes.push(route)}});
  assert.equal(routes.length, 1);
  assert.equal(routes[0].path, '/api-reference');
  assert.equal(routes[0].scalarScript, '/vendor/scalar-api-reference-1.67.0.js');
  assert.match(routes[0].component, /ReferencePage\.tsx$/);
  assert.match(routes[0].configuration, /preserved/);
  assert.match(routes[0].configuration, /openapi\/openapi\.json/);
  console.log('Passed: route-only Scalar loading preserves configuration and function hooks.');
})().catch(error => { console.error(error); process.exitCode = 1; });
