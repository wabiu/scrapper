/* eslint-disable @typescript-eslint/no-var-requires */
const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { app } = require('../index');

test('POST /embeddings-classify returns 400 when no article is provided', async () => {
  const response = await request(app).post('/embeddings-classify').send({});
  assert.equal(response.status, 400);
  assert.equal(response.body.ok, false);
});

test('POST /llm-summarize returns 400 when no article is provided', async () => {
  const response = await request(app).post('/llm-summarize').send({});
  assert.equal(response.status, 400);
  assert.equal(response.body.ok, false);
});

if (process.env.OPENAI_API_KEY) {
  test('POST /embeddings-classify returns an OpenAI classification', async () => {
    const response = await request(app)
      .post('/embeddings-classify')
      .send({
        title: 'Security access issue in Maiduguri',
        extractedSummary: 'A convoy was blocked by armed actors near the market.',
        subject: 'Security'
      })
      .set('Accept', 'application/json');

    assert.equal(response.status, 200);
    assert.equal(response.body.ok, true);
    assert.ok(typeof response.body.section === 'string');
  });

  test('POST /llm-summarize returns an OpenAI summary', async () => {
    const response = await request(app)
      .post('/llm-summarize')
      .send({
        title: 'Health cluster mobilizes vaccination campaign',
        rawText: 'The health cluster is launching a measles vaccination campaign across Maiduguri and surrounding camps.'
      })
      .set('Accept', 'application/json');

    assert.equal(response.status, 200);
    assert.equal(response.body.ok, true);
    assert.ok(typeof response.body.summary === 'string');
  });
}
