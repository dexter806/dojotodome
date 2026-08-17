/* ============================================
   CURRENT CHAMPIONS
   wonOn = ISO date the reign started; days-held is computed live.
   Placeholder reigns — swap in real title history as it's tracked.
   ============================================ */
const CHAMPIONS = [
  { title: "IWGP World Heavyweight", name: "Zack Sabre Jr.", wonOn: "2026-06-15" },
  { title: "IWGP Global Heavyweight", name: "SANADA", wonOn: "2026-04-06" },
  { title: "NEVER Openweight", name: "Gabe Kidd", wonOn: "2026-06-15" },
  { title: "IWGP Tag Team", name: "Great-O-Khan & Aaron Wolf", wonOn: "2026-05-04" },
];

function daysHeld(isoDate){
  const start = new Date(isoDate + "T00:00:00Z");
  const now = new Date();
  const ms = now - start;
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function renderChampions(){
  const list = document.getElementById("champList");
  if (!list) return;
  list.innerHTML = CHAMPIONS.map(c => `
    <li class="champ-row">
      <div>
        <span class="champ-title">${c.title}</span>
        <span class="champ-name">${c.name}</span>
      </div>
      <div class="champ-days">${daysHeld(c.wonOn)}<span>days held</span></div>
    </li>
  `).join("");
}

renderChampions();

/* ============================================
   LATEST NEWS
   Pulled from /api/news (server-side RSS fetch —
   see api/news.js). Headline + link only, credited
   to the source, never the article body. Falls back
   to the placeholder markup already in the page if
   the endpoint isn't available (e.g. static preview,
   or the feed request fails).
   ============================================ */
async function renderNews(){
  const list = document.getElementById("newsList");
  if (!list) return;
  try {
    const res = await fetch("/api/news");
    if (!res.ok) return;
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) return;

    list.innerHTML = items.map(item => `
      <a class="news-item" href="${item.link}" target="_blank" rel="noopener">
        <span class="news-source">${item.source}</span>
        <span class="news-headline">${item.title}</span>
        <span class="news-link">Read on ${item.source} ↗</span>
      </a>
    `).join("");
  } catch (err) {
    // leave the placeholder cards in place
  }
}

renderNews();
