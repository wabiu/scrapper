const { normalizeArticle } = require('./normalizeArticle');
const { dedupeArticles } = require('./dedupeArticles');
const { scoreArticles } = require('./scoreArticles');
const { searchReliefWeb } = require('./sources/reliefweb');
const { searchRss } = require('./sources/rss');

const SOURCE_EXECUTORS = {
  ReliefWeb: (params) => searchReliefWeb(params),
  RSS: (params) => searchRss(params),
  'Daily Trust': (params) => searchRss(params),
  HumAngle: (params) => searchRss(params)
};

async function ingestPipeline(payload = {}) {
  const {
    startDate,
    endDate,
    subjects = [],
    regions = [],
    enabledSources = ['ReliefWeb', 'RSS']
  } = payload;

  const sourceResults = [];

  for (const sourceName of enabledSources) {
    const executor = SOURCE_EXECUTORS[sourceName];

    if (!executor) {
      continue;
    }

    const sourcePayload = {
      startDate,
      endDate,
      subjects,
      regions
    };

    const sourceArticles = await executor(sourcePayload);
    sourceResults.push(...sourceArticles);
  }

  const normalized = sourceResults
    .map((article) => normalizeArticle(article))
    .filter(Boolean);

  const deduped = dedupeArticles(normalized);
  const scored = scoreArticles(deduped, { subjects, regions });

  return {
    ok: true,
    count: scored.length,
    articles: scored
  };
}

module.exports = {
  ingestPipeline
};
