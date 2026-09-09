import { describe, it, expect, vi, afterEach } from 'vitest';
import { getListing, RateLimitError } from './postsAPI';

describe('getListing fallback', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns live json when Reddit is reachable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: { children: [{ kind: 't3', data: { id: 'live1' } }] } }),
      })
    );
    const { json, demo } = await getListing('/r/reactjs/.json?limit=25');
    expect(demo).toBe(false);
    expect(json.data.children[0].data.id).toBe('live1');
  });

  it('falls back to the bundled dataset when the network is blocked', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const { json, demo } = await getListing('/r/reactjs/.json?limit=25');
    expect(demo).toBe(true);
    const posts = json.data.children.map((c) => c.data);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].subreddit).toBe('reactjs');
  });

  it('falls back on HTTP 403 (the network-security block page)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({}) })
    );
    const { demo } = await getListing('/r/space/.json?limit=25');
    expect(demo).toBe(true);
  });

  it('propagates rate-limit errors so the retry UI can handle them', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        headers: new Map([['retry-after', '7']]),
      })
    );
    await expect(getListing('/r/popular/.json?limit=25')).rejects.toBeInstanceOf(RateLimitError);
  });

  it('serves fixture comments for a known permalink', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const { json, demo } = await getListing(
      '/r/reactjs/comments/rc001/react_19x_is_out/.json?limit=50'
    );
    expect(demo).toBe(true);
    const comments = json[1].data.children;
    expect(comments.length).toBeGreaterThan(0);
    expect(comments[0].data.replies.data.children[0].data.author).toBeDefined();
  });
});
