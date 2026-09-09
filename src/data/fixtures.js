/**
 * Bundled sample dataset — same shape as Reddit's public JSON API.
 *
 * Why: Reddit's "network security" edge now hard-blocks unauthenticated
 * `.json` access from this network (HTTP 403 "log in or use your developer
 * token", confirmed from browser AND server contexts, including proxy
 * services). The app still tries the live API first — see postsAPI.js —
 * and falls back to this dataset so every feature (search, filters,
 * detail view, comments, error states) remains demonstrable offline.
 *
 * `created_utc` values are generated relative to load time so the
 * relative timestamps always look sane.
 */

const NOW = Math.floor(Date.now() / 1000);
const h = (hours) => NOW - Math.floor(hours * 3600);
const slug = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40);

/** Post factory — mirrors the fields the app consumes from reddit's t1 data. */
function P(sub, id, title, score, num_comments, author, ageHours, extra = {}) {
  const permalink = `/r/${sub}/comments/${id}/${slug(title)}/`;
  return {
    id,
    title,
    score,
    num_comments,
    author,
    subreddit: sub,
    subreddit_name_prefixed: `r/${sub}`,
    created_utc: h(ageHours),
    permalink,
    url: '',
    selftext: '',
    over_18: false,
    is_video: false,
    ...extra,
  };
}

const img = (seed) => ({
  preview: { images: [{ source: { url: `https://picsum.photos/seed/${seed}/640/360` } }] },
  post_hint: 'image',
});

const POSTS = {
  javascript: [
    P('javascript', 'js001', 'The 2026 JavaScript ecosystem is finally boring — and that\'s a feature', 8421, 512, 'boring_is_good', 3, { selftext: 'After years of build-tool churn, the stack has consolidated. Vite for dev, esbuild/Rollup under the hood, native ESM in Node 24, and baseline-wide browser support for the things we transpiled for a decade.\n\nWhat are you still transpiling in 2026?' }),
    P('javascript', 'js002', 'TIL `structuredClone()` has been baseline for years and I was still writing my own deep-copy helper', 5210, 204, 'today_i_learned', 8),
    P('javascript', 'js003', 'V8 just shipped faster `Promise.allSettled` — benchmarks inside', 3344, 141, 'bench_bot', 12, img('js003bench')),
    P('javascript', 'js004', 'Why you should reach for `AbortController` before you reach for a state flag', 2988, 176, 'cancel_culture', 16, { selftext: 'Every "cancel my fetch when the component unmounts" tutorial used to teach a `let cancelled = true` flag. AbortController does it natively, cancels the actual network request, and cleans up in one line.' }),
    P('javascript', 'js005', 'Show r/javascript: I wrote a 3KB spreadsheet engine in vanilla JS', 4102, 263, 'kb_hacker', 20, img('js005sheet')),
    P('javascript', 'js006', 'Temporal is in! Date is officially on borrowed time', 6890, 447, 'time_traveler', 30, { selftext: 'The Temporal proposal reached baseline this cycle. Plain dates, zoned times, durations that actually do math. Migration guides are already popping up.' }),
    P('javascript', 'js007', 'Mastering JS iterators: a visual guide to `yield*` and generator delegation', 1877, 88, 'visual_guide', 40, img('js007iter')),
    P('javascript', 'js008', 'PSA: `Array.prototype.group` exists now — stop reducing into an object', 2450, 130, 'group_therapist', 48),
  ],
  reactjs: [
    P('reactjs', 'rc001', 'React 19.x is out: Actions are stable and the compiler is on by default', 12040, 891, 'react_release', 2, { selftext: 'The biggest change since hooks. Memoization is now a compiler concern — manual useMemo/useCallback are legacy patterns in new codebases.\n\nMigration notes in the comments.' }),
    P('reactjs', 'rc002', 'My React app went from 180KB to 90KB by deleting 3 dependencies', 7653, 402, 'dep_killer', 6, { selftext: 'Replaced a date library with Temporal, a markdown renderer with 40 lines of native code, and an icon package with 6 inline SVGs.' }),
    P('reactjs', 'rc003', 'useEffect is not a lifecycle hook — a 2026 refresher on synchronizing with external systems', 5320, 355, 'effect_truther', 10),
    P('reactjs', 'rc004', 'Built a real-time dashboard with React + Redux Toolkit + websockets — architecture diagram inside', 4188, 210, 'dash_architect', 14, img('rc004dash')),
    P('reactjs', 'rc005', 'RSC in practice: what actually ships to the client vs what stays on the server', 6011, 388, 'server_side_sam', 22, { selftext: 'A component-by-component breakdown of a production RSC app. The bundle math surprises people: our client JS went from 240KB to 51KB.' }),
    P('reactjs', 'rc006', 'Stop cloning elements — composition patterns for 90% of your prop-drilling problems', 2877, 154, 'compose_master', 28),
    P('reactjs', 'rc007', 'React Compiler saved us 14,000 lines of manual memoization', 4990, 301, 'memo_free', 36, img('rc007compile')),
    P('reactjs', 'rc008', 'From CRA to Vite: migrating a 400-component app in one afternoon', 3555, 187, 'vite_convert', 44),
  ],
  webdev: [
    P('webdev', 'wd001', 'CSS in 2026: container queries everywhere, :has() everywhere, and nobody noticed', 6740, 320, 'css_watcher', 4),
    P('webdev', 'wd002', 'I audited my Lighthouse score down to 100 by removing one analytics script', 5290, 268, 'perf_purist', 9, { selftext: 'The script was 4KB gzipped but blocked the main thread for 900ms on mid-tier Android. Async/defer wasn\'t enough — it had to go.' }),
    P('webdev', 'wd003', 'View transitions are the new page transitions — 15 lines, zero libraries', 4610, 195, 'smooth_operator', 15, img('wd003vt')),
    P('webdev', 'wd004', 'Stop building your own design system tokens — CSS custom properties ARE the design system', 3822, 240, 'token_dad', 26),
    P('webdev', 'wd005', 'The accessibility checklist I run before every deploy (12 items, 10 minutes)', 4408, 176, 'a11y_auditor', 33),
    P('webdev', 'wd006', 'Hot take: your marketing site does not need JavaScript', 7120, 623, 'html_purist', 50, { selftext: 'HTML + CSS can do an embarrassing amount of what people ship SPAs for. Sincerely, someone who ships SPAs for a living.' }),
  ],
  programming: [
    P('programming', 'pg001', 'The best code is no code, the second best is code you deleted on purpose', 9210, 488, 'less_code', 5, { selftext: 'A eulogy for the 12,000 lines we removed last quarter and the 3 incidents that never happened afterwards.' }),
    P('programming', 'pg002', 'Why sqlite doesn\'t need a server and why that keeps blowing minds', 5830, 344, 'sqlite_fan', 11, img('pg002sql')),
    P('programming', 'pg003', 'AI pair programming in 2026: what actually changed about my day-to-day', 7440, 812, 'pair_pilot', 18, { selftext: 'The honest version: 30% faster on boilerplate, 0% faster on architecture, one new skill — writing specs so precise a machine can\'t misread them.' }),
    P('programming', 'pg004', 'Naming things: the two hard problems, visualized as a decision tree', 3610, 158, 'name_wrestler', 29),
    P('programming', 'pg005', 'The git commit that saved my weekend (and the alias that made it muscle memory)', 2980, 201, 'git_guru', 41),
    P('programming', 'pg006', 'Every big company is rebuilding the same internal platform — an industry-wide case of NIH', 4150, 377, 'platform_skeptic', 55),
  ],
  technology: [
    P('technology', 'tc001', 'The death of the password has been massively overdramatized', 6120, 540, 'passphrase_pete', 3),
    P('technology', 'tc002', 'USB-C everything is finally here — my desk cable audit (photos)', 4870, 233, 'cable_guy', 7, img('tc002desk')),
    P('technology', 'tc003', 'Local-first apps are quietly winning the sync war', 5440, 310, 'local_first', 13, { selftext: 'CRDTs matured, storage APIs stabilized, and users noticed that apps that work offline feel faster even online.' }),
    P('technology', 'tc004', 'My smart home detour into local LLMs — latency numbers included', 3910, 198, 'home_lab', 21, img('tc004homelab')),
    P('technology', 'tc005', 'The right to repair scoreboard for 2026: 3 wins, 1 loss', 4530, 265, 'repair_ready', 35),
    P('technology', 'tc006', 'Why your grandma\'s 2009 laptop runs faster than your work-issued 2024 one (bloat, it\'s bloat)', 7020, 489, 'bloat_hunter', 60),
  ],
  science: [
    P('science', 'sc001', 'CRISPR trial reports durable results after 5 years — peer-reviewed follow-up published', 8210, 296, 'gene_reader', 6),
    P('science', 'sc002', 'The room-temperature superconductor saga: what the replication attempts actually taught us', 6110, 445, 'replication_crisis', 14, { selftext: 'Four years and 200 papers later, the scientific process worked — slowly, loudly, and in public. A retrospective.' }),
    P('science', 'sc003', 'JWST spots atmosphere chemistry on a sub-Neptune that "shouldn\'t be there"', 7630, 388, 'scope_fan', 19, img('sc003jwst')),
    P('science', 'sc004', 'Antibiotic resistance map: the good news buried in the bad news', 4720, 176, 'micro_watch', 31),
    P('science', 'sc005', 'Your gut microbiome is not a second brain, but it is a very chatty endocrine organ', 5540, 402, 'gut_feeling', 45),
    P('science', 'sc006', 'Fusion milestone updated: net energy gain replicated at scale by second lab', 8890, 615, 'star_in_jar', 58, img('sc006fusion')),
  ],
  space: [
    P('space', 'sp001', 'Starship\'s eighth flight nails the booster catch AND the ship relight', 11020, 744, 'catch_the_booster', 2, img('sp001catch')),
    P('space', 'sp002', 'Artemis III landing site candidates narrowed to three — all at the lunar south pole', 6210, 310, 'moon_mapper', 8),
    P('space', 'sp003', 'Europa Clipper\'s first science pass: the ice shell rings like a bell', 5840, 245, 'clipper_crew', 17, { selftext: 'Radar sounding suggests the shell is thinner at the equator than models predicted. Ocean world people are thrilled.' }),
    P('space', 'sp004', 'The space debris cascade we keep almost starting — a tracker\'s diary', 4390, 188, 'debris_diary', 25),
    P('space', 'sp005', 'Voyager 1 is still transmitting. It just doesn\'t know what year it is.', 9120, 530, 'golden_record', 49),
    P('space', 'sp006', 'Black hole image 3.0: polarized light movie shows the ring wobbling over a week', 7450, 401, 'ring_watcher', 62, img('sp006bh')),
  ],
  gaming: [
    P('gaming', 'gm001', 'Indie darling of the month is a 4-hour game about repairing lighthouses', 6820, 355, 'cozy_gamer', 4, img('gm001lighthouse')),
    P('gaming', 'gm002', 'The 60fps patch for a 2015 classic just dropped and it\'s free', 5110, 287, 'fps_respector', 12),
    P('gaming', 'gm003', 'Speedrunners broke this game in ways the devs called "technically canon"', 4230, 198, 'frame_perfect', 20, { selftext: 'The exploit lets you skip the entire third act by clipping through a cutscene. The devs tweeted a shrug and patched in a trophy for it.' }),
    P('gaming', 'gm004', 'Handheld PC roundup: the 2026 tier list (battery life is king)', 5960, 442, 'handheld_hero', 34, img('gm004handhelds')),
    P('gaming', 'gm005', 'Retro corner: the FPS that invented the modern radar minimap was not the one you think', 3390, 156, 'retro_corner', 52),
    P('gaming', 'gm006', 'My grandma hit Diamond in a ranked ladder and her strat guide is unhinged genius', 8740, 512, 'grandma_gg', 70),
  ],
  music: [
    P('music', 'mu001', 'The vinyl revival peaked, but cassettes are having a very weird second life', 4320, 214, 'tape_hiss', 7),
    P('music', 'mu002', 'Live from the studio: bands are releasing takes with zero overdubs and audiences love it', 3810, 176, 'one_take', 16, img('mu002studio')),
    P('music', 'mu003', 'Music theory YouTuber debunks the "perfect pitch is genetic" myth with 40 studies', 5210, 388, 'theory_nerd', 27, { selftext: 'Tl;dr: it\'s trainable far later than commonly believed, but the training window matters. The citations are in the pinned comment.' }),
    P('music', 'mu004', 'The synth that defined 80s pop is back as a $99 plugin and it\'s uncanny', 4670, 203, 'synth_surgeon', 38, img('mu004synth')),
    P('music', 'mu005', 'Festival season survival data: which genres have the kindest mosh pits (it\'s science)', 6180, 340, 'pit_analyst', 66),
    P('music', 'mu006', 'I transcribed a famous untranscribable solo by ear and my ear was wrong in 11 places', 3340, 158, 'ear_training', 90),
  ],
  movies: [
    P('movies', 'mv001', 'The 2026 awards season frontrunner is a 95-minute movie shot on one street', 5440, 402, 'award_watcher', 5),
    P('movies', 'mv002', 'Practical effects renaissance: the miniatures department that Hollywood forgot (then remembered)', 4980, 231, 'miniature_fan', 13, img('mv002mini')),
    P('movies', 'mv003', 'The best screenplay of the year was written in 1997 and sat in a drawer', 4110, 187, 'script_drawer', 24),
    P('movies', 'mv004', 'Interstellar rerelease beats three new openers at the box office', 6720, 519, 'box_office_bob', 43),
    P('movies', 'mv005', 'Color grading masterclass hidden in a horror movie\'s "day for night" scenes', 3760, 142, 'colorist_eye', 58, img('mv005grade')),
    P('movies', 'mv006', 'Ratatouille is 19 years old and the critic monologue still eats (healthy perspective on criticism)', 5880, 364, 'anyone_can_cook', 75),
  ],
  funny: [
    P('funny', 'fn001', 'My cat has learned that the robot vacuum runs at 9am and plans accordingly', 9210, 320, 'vacuum_chaos', 3, img('fn001cat')),
    P('funny', 'fn002', 'IOF (index of funny): asked my dad to describe his job for a school project — his answer went viral at the school', 7340, 288, 'dad_joke_deluxe', 9),
    P('funny', 'fn003', 'The gym at 6am is a completely different documentary than the gym at 6pm', 6810, 455, 'gym_anthropologist', 18, img('fn003gym')),
    P('funny', 'fn004', 'Told my niece the wifi password is a riddle. She solved it in 40 seconds. She is five.', 8560, 512, 'wifi_riddle', 30),
    P('funny', 'fn005', 'Corporate wants you to find the difference between these two meetings (there is none)', 5230, 176, 'meeting_survivor', 47),
    P('funny', 'fn006', 'Trying to end a phone call like a normal person: a 12-act play', 6010, 401, 'bye_bye', 72),
  ],
};

/** "popular" = cross-section of the other communities, sorted by score. */
function homePosts() {
  const mixed = Object.values(POSTS)
    .flat()
    .sort((a, b) => b.score - a.score)
    .slice(0, 25);
  return mixed;
}

export function getFixturePosts(subreddit) {
  const posts = subreddit === 'Home' || subreddit === 'popular'
    ? homePosts()
    : POSTS[subreddit] || [];
  return { data: { children: posts.map((p) => ({ kind: 't3', data: p })) } };
}

/** Comment factory — shape matches reddit's t1 data incl. nested replies. */
function C(id, author, score, ageHours, body, replies = []) {
  return {
    id,
    author,
    score,
    created_utc: h(ageHours),
    body,
    replies: replies.length
      ? { data: { children: replies.map((r) => ({ kind: 't1', data: r })) } }
      : undefined,
  };
}

const COMMENTS = {
  'rc001': [
    C('c001', 'migration_mike', 820, 1.5, 'Migrated a 200k-line app last sprint. The compiler caught two genuine re-render bugs we\'d been chasing for months. Do read the “rules of React” doc first though — the compiler is strict about purity.', [
      C('c002', 'strict_mode_stan', 340, 1.2, 'The purity strictness is the best thing that ever happened to our codebase. It forced us to delete every side-effect-in-render hack from 2019.'),
    ]),
    C('c003', 'bundle_skeptic', 455, 2, 'Hot take: Actions are great but the Form validation story still needs a library. zod + Actions is the pragmatic stack.'),
    C('c004', 'legacy_larry', 210, 2.6, 'Our app is still on class components. Every one of these threads is a tiny existential crisis.'),
    C('c005', 'bench_betty', 188, 1.9, 'Ran the bench suite pre/post compiler on our dashboard app: 31% fewer re-renders, same bundle size. It\'s real.'),
  ],
  'js001': [
    C('c011', 'deno_danny', 640, 2, '“Boring” is doing a lot of work here but I agree with the sentiment. The tooling stopped fighting itself and started compounding.', [
      C('c012', 'node_nancy', 290, 1.7, 'Native ESM in Node without flags was the quiet win of the decade. Zero-config just works now.'),
      C('c013', 'holdout_hank', 120, 1.4, 'I still transpile one thing: optional chaining for the smart TV browser. Pray for me.'),
    ]),
    C('c014', 'frontend_fred', 410, 2.5, 'The real MVP is the browser baseline initiative. “Baseline” did more for stability than any framework ever did.'),
  ],
  'js006': [
    C('c021', 'timezone_tina', 590, 20, 'ZonedDateTime ended a three-year war in our monorepo. The war memorial is a 4,000-line file we deleted.', [
      C('c022', 'dst_dave', 240, 19, 'DST transitions finally round-trip correctly. I have the before/after test suite framed on my wall.'),
    ]),
    C('c023', 'calendar_carl', 175, 18, 'Non-Gregorian calendar support out of the box is quietly huge for our localization team.'),
  ],
  'sp001': [
    C('c031', 'launch_lurker', 710, 1, 'The relight footage is absurd. You can see the engine chill vent freeze mid-frame while the booster holds attitude.', [
      C('c032', 'rud_analyst', 380, 0.8, 'Held ~2° through the burn per the telemetry overlay. The control authority at that mass fraction is unprecedented.'),
    ]),
    C('c033', 'old_space_ollie', 290, 1.3, 'I spent 30 years in aerospace. Full reusability was always “20 years away.” Watching it become routine is still surreal.'),
    C('c034', 'nasa_fan_nina', 150, 0.9, 'Artemis is quietly the biggest beneficiary here. Landers need cheap propellant launches.'),
  ],
  'wd001': [
    C('c041', 'css_carrie', 520, 3, 'Container queries killed our last “JS resize observer” wrapper. The card component went from 90 lines to 25.', [
      C('c042', 'grid_gary', 210, 2.7, ':has() + container queries together finally let you build real design-system primitives without a framework.'),
    ]),
    C('c043', 'sass_sam', 160, 2.4, 'Nobody noticed because we were all busy shipping. That\'s what winning looks like in CSS-land.'),
  ],
  'tc003': [
    C('c051', 'offline_olga', 440, 10, 'Moved our notes app local-first last year. Support tickets about “sync lost my note” went to zero. ZERO.', [
      C('c052', 'crdt_craig', 260, 9.5, 'CRDTs are genuinely magic once they click. The mental model shift: sync is a background concern, not a feature.'),
    ]),
    C('c053', 'cloud_clara', 180, 9, 'The offline-feels-faster point is underrated. Optimistic UI IS local-first with extra steps.'),
  ],
  'sc006': [
    C('c061', 'plasma_pete', 610, 50, 'Replication by a second lab with a different confinement approach is the actual news here. The first result was a fireworks show; this is a physics result.', [
      C('c062', 'skeptical_sara', 330, 49, 'Engineering Q still trails physics Q by a wide margin, but the trend line stopped being flat. That\'s the milestone.'),
    ]),
    C('c063', 'energy_econ_ed', 240, 48, 'Grid impact even in the rosiest timeline is 2040s. Buy-fission-and-hold for now.'),
  ],
  'fn004': [
    C('c071', 'aunt_andy', 880, 25, 'The riddle was “what does a cow say at a wedding”. The password was “moo-trimony”. She is FIVE.', [
      C('c072', 'punny_pam', 420, 24, 'And now she changes the wifi password as a hobby. You created a monster.'),
      C('c073', 'toddler_tech', 260, 23, 'Five-year-olds are at that perfect intersection of can-read and cannot-be-fooled.'),
    ]),
    C('c074', 'it_guy_ivan', 190, 22, 'This is genuinely better security awareness training than the module my company makes me do.'),
  ],
  'wd002': [
    C('c081', 'perf_pat', 350, 7, 'The main-thread block is the part everyone sleeps on. 4KB of sync JS costs more than 400KB of images.', [
      C('c082', 'metrics_max', 180, 6.5, 'INP made this visible in the numbers. TTI used to hide it.'),
    ]),
    C('c083', 'analytics_anne', 140, 6, 'The vendor script I removed to hit 100 was ALSO the one double-firing page views. No regrets.'),
  ],
  'sp005': [
    C('c091', 'deep_space_deb', 470, 44, 'It\'s sending science data with a memory issue that would brick a modern satellite, from 24 light-hours away, on 1977 hardware. Absurd machine.', [
      C('c092', 'radio_rick', 250, 43, 'The DSN folks essentially performed brain surgery over a 46-billion-km serial link. With a latency budget of a day round trip.'),
    ]),
    C('c093', 'telemetry_tim', 160, 42, '“It doesn\'t know what year it is” describes half my servers too, to be fair.'),
  ],
};

export function getFixtureComments(permalink) {
  // Comments are keyed by post id (the path segment after /comments/) —
  // robust against slug truncation differences.
  const idMatch = permalink.match(/^\/r\/[^/]+\/comments\/([^/]+)/);
  const comments = (idMatch && COMMENTS[idMatch[1]]) || [];
  // Shape matches reddit's [ postListing, commentsListing ] response.
  return [
    { data: { children: [] } },
    { data: { children: comments.map((c) => ({ kind: 't1', data: c })) } },
  ];
}

export const FIXTURE_SUBREDDITS = Object.keys(POSTS);
