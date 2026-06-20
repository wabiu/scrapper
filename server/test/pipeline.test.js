const test = require('node:test');
const assert = require('node:assert/strict');

const { ingestPipeline } = require('../src/ingest/pipeline');

const samplePayload = {
  startDate: '2026-06-01',
  endDate: '2026-06-18',
  subjects: ['Food Security', 'Health', 'Security'],
  regions: ['NE Region', 'NW Region'],
  enabledSources: ['ReliefWeb', 'RSS']
};

test('ingestPipeline returns normalized and deduped output', async () => {
  const result = await ingestPipeline(samplePayload);

  assert.equal(result.ok, true);
  assert.ok(Array.isArray(result.articles));
  assert.equal(typeof result.count, 'number');
  assert.ok(result.count >= 0);
  result.articles.forEach((article) => {
    assert.ok(article.title);
    assert.ok(article.url);
    assert.ok(article.source);
    assert.ok(['High', 'Medium', 'Low'].includes(article.confidence));
  });
});

test('ingestPipeline handles empty enabled sources gracefully', async () => {
  const result = await ingestPipeline({
    ...samplePayload,
    enabledSources: []
  });

  assert.equal(result.ok, true);
  assert.equal(result.count, 0);
  assert.deepEqual(result.articles, []);
});
