/**
 * Data access layer for Reddit.
 *
 * Strategy (in order):
 *   1. LIVE — Reddit's public JSON API (no key needed when reachable).
 *   2. DEMO — bundled sample dataset (src/data/fixtures.js), same shape.
 *
 * Why the fallback exists: Reddit's network-security edge began
 * hard-blocking unauthenticated `.json` requests from many networks
 * (HTTP 403, "log in or use your developer token"). When that happens
 * the app degrades gracefully to the bundled dataset instead of a dead
 * feed — every feature (search, filters, detail view, comments) still works.
 *
 * Rate limiting (HTTP 429) is a DIFFERENT condition: Reddit is reachable
 * but asking us to slow down, so it propagates to power the auto-retry UX.
 *
 * Optional live-data upgrade (roadmap): OAuth "developer token" support via
 * env vars — Reddit's authenticated API — see README.
 */

import { getFixturePosts, getFixtureComments } from '../../data/fixtures';

const REDDIT_BASE = 'https://www.reddit.com';

export class RateLimitError extends Error {
  constructor(retryAfterSeconds = 3) {
    super('Reddit is rate-limiting requests. Retrying shortly…');
    this.name = 'RateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message || `Reddit API error (HTTP ${status})`);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function fetchReddit(path) {
  const res = await fetch(`${REDDIT_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  });

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get('retry-after')) || 3;
    throw new RateLimitError(retryAfter);
  }
  if (!res.ok) {
    throw new ApiError(res.status);
  }
  return res.json();
}

function fixtureFor(path) {
  const postMatch = path.match(/^\/r\/([^/]+)\/\.json/);
  if (postMatch) return getFixturePosts(postMatch[1]);

  const commentMatch = path.match(/^(\/r\/[^/]+\/comments\/[^/]+\/[^/]*)\/?\.json/);
  if (commentMatch) return getFixtureComments(commentMatch[1]);

  return null;
}

/**
 * Try live first; on non-rate-limit failure, fall back to the bundled
 * dataset. Returns { json, demo } where demo=true means sample data.
 */
export async function getListing(path) {
  try {
    const json = await fetchReddit(path);
    return { json, demo: false };
  } catch (err) {
    if (err instanceof RateLimitError) throw err;
    const fixture = fixtureFor(path);
    if (fixture) return { json: fixture, demo: true };
    throw err;
  }
}
