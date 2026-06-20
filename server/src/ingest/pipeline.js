const { normalizeArticle } = require('./normalizeArticle');
const { dedupeArticles } = require('./dedupeArticles');
const { scoreArticles } = require('./scoreArticles');
const { searchReliefWeb } = require('./sources/reliefweb');
const { searchRss } = require('./sources/rss');

async function ingestPipeline(payload = {}) {
  const {
    startDate,
    endDate,
    subjects = [],
    regions = [],
    enabledSources = ['ReliefWeb', 'RSS']
  } = payload;

  const sourceResults = [];

  if (enabledSources.includes('ReliefWeb')) {
    const reliefWebResults = await searchReliefWeb({
      startDate,
      endDate,
      subjects,
      regions
    });

    sourceResults.push(...reliefWebResults);
  }

  if (enabledSources.includes('RSS')) {
    const rssResults = await searchRss({
      subjects,
      regions
    });

    sourceResults.push(...rssResults);
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
