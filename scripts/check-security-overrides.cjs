// Exercise the APIs used by Docusaurus when upgrading transitive dependencies
// beyond its declared ranges. The normal build does not enable its worker pool.
const assert = require('node:assert/strict');
const {mkdtemp, writeFile, unlink, rmdir} = require('node:fs/promises');
const {tmpdir} = require('node:os');
const {join} = require('node:path');
const {createRequire} = require('node:module');

async function main() {
  const serialize = require('serialize-javascript');
  assert.deepEqual(JSON.parse(serialize({route: '/api', nested: [1, true]}, {isJSON: true})),
    {route: '/api', nested: [1, true]});
  assert.ok(serialize(/docs/gi).includes('RegExp'));
  const parser = require('postcss-selector-parser');
  for (const selector of ['.docs > :last-child', ':is(td,th) > *', '[data-theme="dark"] .scalar-app']) {
    assert.equal(parser().processSync(selector), selector);
  }
  const sockjsRequire = createRequire(require.resolve('sockjs'));
  assert.match(sockjsRequire('uuid').v4(), /^[0-9a-f-]{36}$/);
  require('sockjs');

  const {default: Tinypool} = await import('tinypool');
  const directory = await mkdtemp(join(tmpdir(), 'vremly-pool-compat-'));
  const filename = join(directory, 'worker.mjs');
  let pool;
  try {
    await writeFile(filename, 'export default task => ({...task, marker: process.__tinypool_state__.workerData.marker});\n');
    pool = new Tinypool({filename, minThreads: 2, maxThreads: 2,
      concurrentTasksPerWorker: 1, runtime: 'worker_threads', isolateWorkers: false,
      workerData: {marker: 'docs'}, maxMemoryLimitBeforeRecycle: 1000000000,
      resourceLimits: {}});
    assert.deepEqual(await pool.run({pathnames: ['/api']}),
      {pathnames: ['/api'], marker: 'docs'});
  } finally {
    if (pool) await pool.destroy();
    await unlink(filename);
    await rmdir(directory);
  }
  console.log('Passed: serializer, selector parser, SockJS UUID and Docusaurus worker-pool APIs.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
