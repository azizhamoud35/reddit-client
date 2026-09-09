/** Format a unix timestamp (or ms) as a short relative time, e.g. "5h ago". */
export function timeAgo(unixTimestamp) {
  const seconds = Math.floor(Date.now() / 1000) - unixTimestamp;
  if (!Number.isFinite(seconds) || seconds < 0) return 'just now';
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [name, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value}${name[0]} ago`;
  }
  return 'just now';
}

/** Reddit escapes & in preview URLs — unescape before use in <img src>. */
export function decodeRedditUrl(url) {
  return (url || '').replace(/&amp;/g, '&');
}
