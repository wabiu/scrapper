function normalizeArticle(article) {
  if (!article || !article.url || !article.title) {
    return null;
  }

  return {
    title: article.title,
    source: article.source || 'Unknown',
    url: article.url,
    date: article.date || new Date().toISOString().slice(0, 10),
    region: article.region || 'National Overview',
    subject: article.subject || 'Security',
    confidence: article.confidence || 'Medium',
    rawText: article.rawText || ''
  };
}

module.exports = {
  normalizeArticle
};
