function scoreArticles(articles, filters = {}) {
  const { subjects = [], regions = [] } = filters;

  return articles.map((article) => {
    const subjectMatch = subjects.includes(article.subject) ? 1 : 0;
    const regionMatch = regions.includes(article.region) || regions.includes('National Overview') ? 1 : 0;

    const score = subjectMatch + regionMatch;

    return {
      ...article,
      score,
      confidence: score >= 2 ? 'High' : article.confidence || 'Medium'
    };
  }).sort((a, b) => b.score - a.score);
}

module.exports = {
  scoreArticles
};
