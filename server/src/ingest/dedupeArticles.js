function dedupeArticles(articles) {
  const seen = new Set();

  return articles.filter((article) => {
    const key = `${article.url}::${article.title}`.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

module.exports = {
  dedupeArticles
};
