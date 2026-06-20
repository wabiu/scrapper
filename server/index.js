const express = require('express');
const { ingestPipeline } = require('./src/ingest/pipeline');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'scraper-server' });
});

app.post('/ingest', async (req, res) => {
  try {
    const result = await ingestPipeline(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown ingestion error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Scraper server listening on http://localhost:${PORT}`);
});
