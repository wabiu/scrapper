const Parser = require('rss-parser');

async function searchRss({ subjects = [], regions = [] }) {
  const parser = new Parser({
    customFields: {
      item: ['content:encoded', 'media:content']
    }
  });

  const feedUrls = [
    'https://www.dailytrust.com.ng/feed/',
    'https://humanglemedia.com/feed/'
  ];

  const allItems = [];

  for (const feedUrl of feedUrls) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const items = (feed.items || []).map((item) => {
        const text = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''}`;
        const region = pickRegion(text, regions);
        const subject = pickSubject(text, subjects);

        return {
          title: item.title || 'Untitled RSS item',
          source: feed.title || 'RSS Source',
          url: item.link || '',
          date: item.pubDate ? item.pubDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
          region,
          subject,
          rawText: text
        };
      });

      allItems.push(...items);
    } catch (error) {
      console.warn(`RSS feed failed: ${feedUrl}`, error.message);
    }
  }

  return allItems;
}

function pickRegion(text, requestedRegions) {
  const normalized = text.toLowerCase();
  const regionTerms = {
    'NE Region': ['borno', 'adamawa', 'yobe', 'northeast', 'north-east'],
    'NW Region': ['zamfara', 'katsina', 'sokoto', 'kebbi', 'kaduna', 'northwest', 'north-west'],
    'North Central': ['niger', 'plateau', 'benue', 'nasarawa', 'kogi', 'kwara', 'fct']
  };

  for (const region of requestedRegions) {
    if (region === 'National Overview') {
      continue;
    }

    const terms = regionTerms[region] || [region];
    if (terms.some((term) => normalized.includes(term))) {
      return region;
    }
  }

  return requestedRegions[0] || 'National Overview';
}

function pickSubject(text, requestedSubjects) {
  const normalized = text.toLowerCase();
  const subjectKeywords = [
    { subject: 'Food Security', terms: ['food security', 'hunger', 'famine', 'ipc'] },
    { subject: 'Nutrition', terms: ['nutrition', 'malnutrition', 'sam', 'mam'] },
    { subject: 'Health', terms: ['health', 'cholera', 'outbreak', 'disease', 'clinic'] },
    { subject: 'WASH', terms: ['wash', 'water', 'sanitation', 'hygiene'] },
    { subject: 'Security', terms: ['attack', 'abduction', 'kidnap', 'armed', 'conflict'] },
    { subject: 'Education', terms: ['school', 'education', 'learning'] },
    { subject: 'Shelter / NFI', terms: ['shelter', 'nfi', 'household items'] },
    { subject: 'Humanitarian Response', terms: ['humanitarian', 'response', 'assistance'] },
    { subject: 'Government Response', terms: ['government', 'authority', 'ministry'] }
  ];

  for (const candidate of subjectKeywords) {
    if (
      requestedSubjects.includes(candidate.subject) &&
      candidate.terms.some((term) => normalized.includes(term))
    ) {
      return candidate.subject;
    }
  }

  return requestedSubjects[0] || 'Security';
}

module.exports = {
  searchRss
};
