const Tour = require('../models/Tour');
const Faq = require('../models/Faq');
const { tokenize } = require('../utils/nlpHelper');

// Levenshtein distance for fuzzy string comparison
function getLevenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Fallback Fuzzy Matcher that mimics Fuse.js
class CustomFuzzyMatcher {
  constructor(list, options = {}) {
    this.list = list;
    this.keys = options.keys || [];
    this.threshold = options.threshold || 0.6;
  }

  search(query) {
    if (!query) {
      return this.list.map((item, index) => ({ item, score: 0, refIndex: index }));
    }

    const queryTokens = tokenize(query);
    const results = [];

    this.list.forEach((item, index) => {
      let bestScore = 1.0; // 0.0 is perfect match, 1.0 is no match

      this.keys.forEach(keyConfig => {
        const key = typeof keyConfig === 'string' ? keyConfig : keyConfig.name;
        const weight = typeof keyConfig === 'string' ? 1.0 : (keyConfig.weight || 1.0);

        // Get key value from item
        let value = item[key];
        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
          value.forEach(val => {
            const score = this._scoreField(queryTokens, query, val.toString());
            bestScore = Math.min(bestScore, score * (2.0 - weight));
          });
        } else {
          const score = this._scoreField(queryTokens, query, value.toString());
          bestScore = Math.min(bestScore, score * (2.0 - weight));
        }
      });

      if (bestScore <= this.threshold) {
        results.push({
          item,
          score: bestScore,
          refIndex: index
        });
      }
    });

    return results.sort((a, b) => a.score - b.score);
  }

  _scoreField(queryTokens, queryStr, fieldText) {
    const textLower = fieldText.toLowerCase();
    const queryLower = queryStr.toLowerCase();

    // 1. Exact or substring match (best score)
    if (textLower === queryLower) return 0.0;
    if (textLower.includes(queryLower)) return 0.1;

    // 2. Token overlap and edit distance
    const fieldTokens = tokenize(fieldText);
    if (fieldTokens.length === 0) return 1.0;

    let matchCount = 0;
    let editDistanceSum = 0;

    queryTokens.forEach(qToken => {
      let matched = false;
      let minDistance = 1.0;

      fieldTokens.forEach(fToken => {
        if (fToken === qToken) {
          matched = true;
          minDistance = 0.0;
        } else if (fToken.startsWith(qToken) || qToken.startsWith(fToken)) {
          matched = true;
          minDistance = Math.min(minDistance, 0.25);
        } else {
          const distance = getLevenshteinDistance(qToken, fToken);
          const maxLen = Math.max(qToken.length, fToken.length);
          const normalizedDistance = distance / maxLen;
          if (normalizedDistance <= 0.45) { // Threshold for word spelling mistake
            matched = true;
            minDistance = Math.min(minDistance, normalizedDistance * 0.5);
          }
        }
      });

      if (matched) {
        matchCount++;
        editDistanceSum += minDistance;
      } else {
        editDistanceSum += 0.5; // penalty for unmatched query token
      }
    });

    const overlapRatio = matchCount / queryTokens.length;
    if (overlapRatio === 0) return 1.0;

    const tokenScore = (1.0 - overlapRatio) * 0.7 + (editDistanceSum / queryTokens.length) * 0.3;
    return Math.min(1.0, Math.max(0.0, tokenScore));
  }
}

// Load Fuse.js or fall back to CustomFuzzyMatcher
let FuzzySearchLibrary;
try {
  FuzzySearchLibrary = require('fuse.js');
} catch (e) {
  FuzzySearchLibrary = CustomFuzzyMatcher;
}

/**
 * Searches tours with filters and fuzzy matching
 */
async function searchTours(query, language, filters = {}) {
  // Query by language
  const mongoQuery = { language };

  // Expand Egyptian cities to include parent country 'egypt'
  let queryDestinations = filters.destinations ? [...filters.destinations] : [];
  const EGYPTIAN_CITIES = ['luxor', 'cairo', 'aswan', 'alexandria', 'sharm', 'hurghada'];
  const hasCity = queryDestinations.some(d => EGYPTIAN_CITIES.includes(d));
  if (hasCity && !queryDestinations.includes('egypt')) {
    queryDestinations.push('egypt');
  }

  // Apply filters from query analysis
  if (queryDestinations.length > 0) {
    mongoQuery.destination = { $in: queryDestinations };
  }
  
  if (filters.maxPrice) {
    mongoQuery.price = { $lte: filters.maxPrice };
  }

  // Check category filters
  const categoryFilters = ['familyFriendly', 'honeymoon', 'adventure', 'luxury', 'cultural'];
  categoryFilters.forEach(cat => {
    if (filters[cat]) {
      mongoQuery[cat] = true;
    }
  });

  const tours = await Tour.find(mongoQuery);
  if (!query || query.trim() === '') {
    return tours; // Return filtered tours directly
  }

  // Perform fuzzy search over results
  const options = {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'overview', weight: 0.2 },
      { name: 'destination', weight: 0.3 }
    ],
    threshold: 0.65
  };

  const matcher = new FuzzySearchLibrary(tours, options);
  const searchResults = matcher.search(query);
  return searchResults.map(res => res.item);
}

/**
 * Searches FAQs using fuzzy matching
 */
async function searchFaqs(query, language) {
  const faqs = await Faq.find({ language });
  if (!query || query.trim() === '') {
    return faqs;
  }

  const options = {
    keys: [
      { name: 'question', weight: 0.8 },
      { name: 'answer', weight: 0.2 }
    ],
    threshold: 0.55
  };

  const matcher = new FuzzySearchLibrary(faqs, options);
  const searchResults = matcher.search(query);
  return searchResults.map(res => res.item);
}

module.exports = {
  searchTours,
  searchFaqs,
  CustomFuzzyMatcher
};
