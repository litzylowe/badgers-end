// ════════════════════════════════════════════════════
// Badger's End — DM Toolkit
// ════════════════════════════════════════════════════

// ────────────────────────────────────────────────
// DATA TABLES
// ────────────────────────────────────────────────
const TABLES = {
  city: [
    "All quiet — an unusually peaceful day in the city",
    "Market day is in full swing; merchants crowd the square",
    "A body was found near the docks at dawn",
    "The city guard is conducting stop-and-search near the gates",
    "A noble's carriage was robbed on the main road",
    "Strange lights were seen over the harbor last night",
    "Tensions between dockworkers and the merchant guild are rising",
    "A traveling carnival has set up near the east wall",
    "Curfew has been imposed — the governor is nervous about something",
    "Rumors of a plague ship spotted offshore; the harbormaster is hiding it"
  ],
  faction: [
    "The Shield is quietly increasing patrols — something's coming",
    "The Coin is throwing a lavish banquet; invitations are power",
    "The Light has declared a holy day; the temple bells ring all morning",
    "The Quill sent a sealed letter to someone at the inn — unopened",
    "The Shadow's calling card was left on a merchant's door overnight",
    "The Masked have made a move — but no one knows exactly what"
  ],
  inn: [
    "Packed tonight — standing room only, Mr. H is slammed behind the bar",
    "A hooded stranger has been nursing a drink for six hours",
    "Mr. Hoots appeared silently beside a sleeping patron, staring",
    "Two factions' representatives are eating at separate tables, eyeing each other",
    "Someone left a locked box at the bar with no note",
    "A bard arrived and is starting a rather pointed ballad about someone present",
    "A fight broke out in the alley out back; someone stumbled in bleeding",
    "Three off-duty guards are deep in their cups and getting loud",
    "A message arrived by raven — addressed to the party",
    "Mr. H is humming something that sounds like a Fae melody — never done that before"
  ],
  weather: [
    "Clear and bright — good omen or suspiciously fine",
    "Dense morning fog off the sea; visibility is poor",
    "Rain all day — steady and cold, the streets are quiet",
    "A sudden storm rolled in from the sea; lightning over the harbor",
    "Unseasonal warmth — people are restless and outside",
    "Bitter wind from the hills; something smells faintly of smoke",
    "Overcast and grey — the oppressive kind",
    "A dry, strange wind blows eastward; it carries whispers"
  ],
  hook: [
    "A merchant offers double pay to find their stolen ledger — no questions asked",
    "A child tugs at a party member's sleeve: 'My da didn't come home last night'",
    "A letter slipped under someone's door: 'They know who you are. Leave now.'",
    "A city guard approaches, clearly nervous: 'The captain wants a word. Quietly.'",
    "A cloaked figure drops a coin pouch on the table and walks away without speaking",
    "The locked box at the bar begins to tick",
    "One of the anchor NPCs pulls the party aside with an unusual request",
    "A wanted poster with a familiar face — possibly someone the party has met",
    "A map fragment falls out of an unconscious drunk's coat",
    "Mr. Hoots lands on the table and stares toward the docks, unblinking"
  ],
  disposition: [
    "Friendly and open — will help if approached warmly",
    "Cautious — watches before they speak",
    "Distracted — clearly preoccupied with something else",
    "Suspicious of outsiders — takes convincing",
    "Greedy — everything has a price, and they'll name it",
    "Frightened — just saw something they won't describe",
    "Boisterous and loud — center of attention",
    "Cold and professional — business only",
    "Grieving — recently lost something or someone",
    "Drunk and loose-lipped — a risk and an opportunity"
  ]
};

const NAMES = {
  first: ["Aldric","Bessa","Carn","Dova","Elsin","Farek","Gwen","Harrow","Isla","Jorik",
          "Kessa","Lorn","Miri","Nael","Oryn","Pira","Quinn","Ruen","Syla","Tev",
          "Ulla","Vorn","Wren","Xael","Ysa","Zevran","Bram","Celia","Dorian","Elowen"],
  last:  ["Ashvale","Blackfen","Coldwater","Dunmore","Evenfall","Frostmere","Galeborn","Hartwick",
          "Ironside","Jael","Kestrel","Longmire","Mossfoot","Nighthollow","Osric","Pell",
          "Quickthorn","Ravenscroft","Saltwater","Thorne","Underbridge","Vale","Whitlock","Yarrow"]
};

const RACES = ["Human","Human","Human","Human","Elf","Half-Elf","Dwarf","Halfling","Gnome","Tiefling","Dragonborn","Half-Orc"];

const PERSONALITIES = [
  "Gruff but loyal — all bark, solid as stone",
  "Warm and curious — asks too many questions, always listening",
  "Paranoid — glances at the door every few minutes",
  "Silver-tongued — every sentence is a negotiation",
  "Melancholy — clearly haunted by something from their past",
  "Cheerfully oblivious — somehow always fine",
  "Sharp and calculating — three steps ahead",
  "Deeply religious — works their faith into everything",
  "Recklessly brave — finds caution offensive",
  "Cautious and measured — never acts without thinking twice",
  "Bitter — the world has not been kind",
  "Mischievous — can't help themselves"
];

const PURPOSES = [
  "Dock worker looking for a lost crate",
  "Traveling merchant passing through for the night",
  "Off-duty city guard unwinding after a long shift",
  "Spy maintaining cover as a regular patron",
  "Local craftsperson celebrating a good week",
  "Courier waiting for a handoff that hasn't come",
  "Scholar researching local history",
  "Fugitive laying low and hoping no one notices",
  "Hired muscle between contracts",
  "Noble in disguise, slumming it for thrills",
  "Grieving widow looking for answers",
  "Adventurer between jobs, spending their last coin"
];

const FACTION_HINTS = {
  shield: "Subtly watches the room for trouble; old guard habit",
  light:  "Has a small temple symbol worked into their jewelry",
  coin:   "Always mentally pricing things; fingers the coins in their pocket",
  quill:  "Moves fingers slightly when thinking — old cantrip reflex",
  shadow: "Sits with their back to a wall, face toward the door",
  masked: "Nothing. They're completely ordinary. Too ordinary.",
  none:   "No obvious faction ties — unaffiliated, or very good at hiding it"
};

// ────────────────────────────────────────────────
// STATE
// ────────────────────────────────────────────────
const STATE_KEY = 'badgers-end-state';
const FACTIONS = ["shield","coin","light","quill","shadow","masked"];
const FACTION_NAMES = {
  shield: "The Shield",
  coin:   "The Coin",
  light:  "The Light",
  quill:  "The Quill",
  shadow: "The Shadow",
  masked: "The Masked"
};

let state = {
  threads: [],
  npcLog: [],
  players: [],
  worldLog: [],
  sessions: []
};

function loadState() {
  try {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) state = { ...state, ...JSON.parse(saved) };
  } catch(e) {}
  renderWorldState();
}

function saveState() {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

// ────────────────────────────────────────────────
// UTILITY
// ────────────────────────────────────────────────
function roll(n) { return Math.floor(Math.random() * n); }
function pick(arr) { return arr[roll(arr.length)]; }
function timestamp() {
  const d = new Date();
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) +
         ' · ' + d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
}

// ────────────────────────────────────────────────
// TABS
// ────────────────────────────────────────────────
function showTab(name, btn) {
  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active');
    s.setAttribute('hidden', '');
  });
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  const panel = document.getElementById('tab-' + name);
  panel.classList.add('active');
  panel.removeAttribute('hidden');
  const tabBtn = btn || document.getElementById('tab-btn-' + name);
  tabBtn.classList.add('active');
  tabBtn.setAttribute('aria-selected', 'true');
}

// ────────────────────────────────────────────────
// SESSION RANDOMIZER
// ────────────────────────────────────────────────
let lastRoll = null;

function animateDie(id, finalVal) {
  const el    = document.getElementById(id);
  const valEl = document.getElementById(id + '-val');
  el.classList.add('rolling');
  let ticks = 0;
  const interval = setInterval(() => {
    valEl.textContent = String(roll(12) + 1).padStart(2, '0');
    ticks++;
    if (ticks > 8) {
      clearInterval(interval);
      valEl.textContent = finalVal;
      el.classList.remove('rolling');
    }
  }, 60);
}

function rollSession() {
  const cityIdx    = roll(TABLES.city.length);
  const factionIdx = roll(TABLES.faction.length);
  const innIdx     = roll(TABLES.inn.length);
  const weatherIdx = roll(TABLES.weather.length);
  const hookIdx    = roll(TABLES.hook.length);

  animateDie('die-city',    String(cityIdx    + 1).padStart(2, '0'));
  animateDie('die-faction', String(factionIdx + 1).padStart(2, '0'));
  animateDie('die-inn',     String(innIdx     + 1).padStart(2, '0'));
  animateDie('die-weather', String(weatherIdx + 1).padStart(2, '0'));

  lastRoll = {
    city:    TABLES.city[cityIdx],
    faction: TABLES.faction[factionIdx],
    inn:     TABLES.inn[innIdx],
    weather: TABLES.weather[weatherIdx],
    hook:    TABLES.hook[hookIdx]
  };

  setTimeout(() => {
    document.getElementById('roll-content').innerHTML = `
      <div class="result-grid">
        <div class="result-item">
          <div class="result-label">City Event</div>
          <div class="result-value">${lastRoll.city}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Faction Activity</div>
          <div class="result-value gold">${lastRoll.faction}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Inn Tonight</div>
          <div class="result-value">${lastRoll.inn}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Weather</div>
          <div class="result-value">${lastRoll.weather}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="result-item">
        <div class="result-label">&#9875; Opening Hook</div>
        <div class="result-value gold" style="font-size:15px;line-height:1.5;">${lastRoll.hook}</div>
      </div>
    `;
  }, 600);
}

function saveSessionToLog() {
  const dm    = document.getElementById('session-dm').value.trim() || 'Unknown DM';
  const notes = document.getElementById('session-notes').value.trim();

  const entry = {
    id:        Date.now(),
    dm,
    notes,
    roll:      lastRoll,
    timestamp: timestamp(),
    players:   state.players.length
  };

  state.sessions.unshift(entry);
  saveState();
  renderSessionLog();

  document.getElementById('session-dm').value    = '';
  document.getElementById('session-notes').value = '';
  alert('Session saved to log!');
}

// ────────────────────────────────────────────────
// NPC GENERATOR
// ────────────────────────────────────────────────
let currentNPC = null;

function generateNPC() {
  const raceFilter    = document.getElementById('npc-race-filter').value;
  const factionFilter = document.getElementById('npc-faction-filter').value;

  const firstName  = pick(NAMES.first);
  const lastName   = pick(NAMES.last);
  const race       = raceFilter || pick(RACES);
  const personality = pick(PERSONALITIES);
  const purpose    = pick(PURPOSES);
  const factionKey = factionFilter || pick([...FACTIONS, 'none', 'none', 'none']);
  const factionHint = FACTION_HINTS[factionKey] || FACTION_HINTS.none;
  const disposition = pick(TABLES.disposition);

  currentNPC = { name: `${firstName} ${lastName}`, race, personality, purpose, factionKey, factionHint, disposition };

  document.getElementById('gen-name').textContent        = currentNPC.name;
  document.getElementById('gen-race').textContent        = race;
  document.getElementById('gen-personality').textContent = personality;
  document.getElementById('gen-purpose').textContent     = purpose;
  document.getElementById('gen-disposition').textContent = disposition;

  const factionEl = document.getElementById('gen-faction');
  factionEl.innerHTML = factionKey !== 'none'
    ? `<span class="faction-tag ${factionKey}">${FACTION_NAMES[factionKey] || factionKey}</span>
       <br><span style="font-size:13px;color:var(--text-muted);margin-top:4px;display:block;">${factionHint}</span>`
    : `<span class="faction-tag none">Unknown</span>
       <br><span style="font-size:13px;color:var(--text-muted);margin-top:4px;display:block;">${factionHint}</span>`;

  document.getElementById('npc-generated').style.display = 'block';
  document.getElementById('gen-notes').value = '';
}

function logGeneratedNPC() {
  if (!currentNPC) return;
  const notes = document.getElementById('gen-notes').value.trim();
  const entry = { ...currentNPC, notes, timestamp: timestamp() };
  state.npcLog.unshift(entry);
  saveState();
  renderNPCLog();
  alert(`${currentNPC.name} logged to World State.`);
}

// ────────────────────────────────────────────────
// WORLD STATE
// ────────────────────────────────────────────────
function addThread() {
  const title = document.getElementById('new-thread').value.trim();
  if (!title) return;
  const status = document.getElementById('new-thread-status').value;
  state.threads.unshift({ id: Date.now(), title, status, timestamp: timestamp() });
  document.getElementById('new-thread').value = '';
  saveState();
  renderThreads();
}

function resolveThread(id) {
  const t = state.threads.find(x => x.id === id);
  if (t) { t.status = 'resolved'; saveState(); renderThreads(); }
}

function deleteThread(id) {
  state.threads = state.threads.filter(x => x.id !== id);
  saveState();
  renderThreads();
}

function addPlayer() {
  const name = document.getElementById('new-player-name').value.trim();
  if (!name) return;
  const renown = {};
  FACTIONS.forEach(f => renown[f] = 0);
  state.players.push({ id: Date.now(), name, renown });
  document.getElementById('new-player-name').value = '';
  saveState();
  renderPlayers();
}

function adjustRenown(playerId, faction, delta) {
  const p = state.players.find(x => x.id === playerId);
  if (!p) return;
  p.renown[faction] = Math.max(0, Math.min(20, (p.renown[faction] || 0) + delta));
  saveState();
  renderPlayers();
}

function removePlayer(id) {
  if (!confirm('Remove this player?')) return;
  state.players = state.players.filter(x => x.id !== id);
  saveState();
  renderPlayers();
}

function addLogEntry() {
  const txt = document.getElementById('new-log-entry').value.trim();
  if (!txt) return;
  state.worldLog.unshift({ text: txt, timestamp: timestamp() });
  document.getElementById('new-log-entry').value = '';
  saveState();
  renderWorldLog();
}

// ────────────────────────────────────────────────
// RENDER FUNCTIONS
// ────────────────────────────────────────────────
function renderWorldState() {
  renderThreads();
  renderPlayers();
  renderWorldLog();
  renderNPCLog();
  renderSessionLog();
}

function renderThreads() {
  const el = document.getElementById('threads-list');
  if (!state.threads.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">&#128220;</div>No active threads — add one above</div>';
    return;
  }
  el.innerHTML = state.threads.map(t => {
    const badgeClass = t.status === 'active'  ? 'badge-active'
                     : t.status === 'urgent'  ? 'badge-urgent'
                     : t.status === 'mystery' ? 'badge-mystery'
                     : 'badge-resolved';
    return `<div style="padding:10px 0;border-bottom:1px solid var(--border-card);display:flex;align-items:center;gap:10px;">
      <div style="flex:1;">
        <div style="font-size:14px;color:${t.status === 'resolved' ? 'var(--text-dim)' : 'var(--text-white)'};">${t.title}</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:2px;"><time>${t.timestamp}</time></div>
      </div>
      <span class="badge ${badgeClass}" aria-label="Status: ${t.status}">${t.status}</span>
      ${t.status !== 'resolved'
        ? `<button class="btn btn-success" onclick="resolveThread(${t.id})" aria-label="Mark '${t.title}' as resolved">&#10003;</button>`
        : ''}
      <button class="btn btn-danger" onclick="deleteThread(${t.id})" aria-label="Delete thread '${t.title}'">&#10005;</button>
    </div>`;
  }).join('');
}

function renderPlayers() {
  const el = document.getElementById('players-list');
  if (!state.players.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">&#9876;</div>Add players to track renown</div>';
    return;
  }
  el.innerHTML = state.players.map(p => {
    const rows = FACTIONS.map(f => {
      const val = p.renown[f] || 0;
      const pct = (val / 20 * 100).toFixed(0);
      return `<div class="faction-row faction-${f}">
        <span class="faction-label" aria-hidden="true">${FACTION_NAMES[f]}</span>
        <div style="flex:1;">
          <div class="renown-bar-bg" role="progressbar"
            aria-valuemin="0" aria-valuemax="20" aria-valuenow="${val}"
            aria-label="${FACTION_NAMES[f]} renown for ${p.name}: ${val} of 20">
            <div class="renown-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>
        <span class="faction-renown-num" aria-hidden="true">${val}</span>
        <div class="renown-controls">
          <button class="renown-btn" onclick="adjustRenown(${p.id},'${f}',-1)"
            aria-label="Decrease ${FACTION_NAMES[f]} renown for ${p.name}">&#8722;</button>
          <button class="renown-btn" onclick="adjustRenown(${p.id},'${f}',1)"
            aria-label="Increase ${FACTION_NAMES[f]} renown for ${p.name}">+</button>
        </div>
      </div>`;
    }).join('');
    return `<div class="player-card">
      <div class="player-name">
        <span>${p.name}</span>
        <button class="btn btn-danger" onclick="removePlayer(${p.id})" aria-label="Remove player ${p.name}">Remove</button>
      </div>
      ${rows}
    </div>`;
  }).join('');
}

function renderWorldLog() {
  const el = document.getElementById('world-log-list');
  if (!state.worldLog.length) {
    el.innerHTML = '<div class="empty-state" style="padding:20px;"><div class="empty-icon">&#128214;</div>World events will appear here</div>';
    return;
  }
  el.innerHTML = state.worldLog.slice(0, 30).map(e =>
    `<div class="log-entry">
      <div class="log-timestamp">${e.timestamp}</div>
      <div>${e.text}</div>
    </div>`
  ).join('');
}

function renderNPCLog() {
  const el = document.getElementById('npc-log-list');
  if (!state.npcLog.length) {
    el.innerHTML = '<div class="empty-state">No NPCs logged yet this session</div>';
    return;
  }
  el.innerHTML = state.npcLog.slice(0, 20).map(n =>
    `<div class="log-entry">
      <div class="log-timestamp">${n.timestamp}</div>
      <div style="font-weight:700;color:var(--gold);font-family:'Cinzel',serif;font-size:14px;">${n.name}</div>
      <div style="color:var(--text-muted);font-size:13px;">${n.race} &middot; ${n.purpose}</div>
      ${n.notes ? `<div style="font-style:italic;font-size:13px;color:var(--text-dim);margin-top:4px;">${n.notes}</div>` : ''}
    </div>`
  ).join('');
}

function renderSessionLog() {
  const el        = document.getElementById('session-log-list');
  const summaryEl = document.getElementById('campaign-summary');

  if (!state.sessions.length) {
    el.innerHTML = '<div class="empty-state" style="padding:40px;"><div class="empty-icon">&#128218;</div>No sessions logged yet</div>';
    summaryEl.innerHTML = '<div class="empty-state" style="padding:20px;">Campaign stats will appear here after sessions are logged</div>';
    return;
  }

  el.innerHTML = state.sessions.map(s => {
    const rollHTML = s.roll ? `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;color:var(--text-muted);">
        <div>
          <span style="color:var(--gold-dim);font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;display:block;">City</span>
          ${s.roll.city}
        </div>
        <div>
          <span style="color:var(--gold-dim);font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;display:block;">Weather</span>
          ${s.roll.weather}
        </div>
        <div style="grid-column:1/-1;">
          <span style="color:var(--gold-dim);font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;display:block;">Hook</span>
          ${s.roll.hook}
        </div>
      </div>` : '';
    return `<div class="session-log-item">
      <div class="session-log-header">
        <div class="session-log-title">Session &#8212; ${s.dm}</div>
        <div class="session-log-date">${s.timestamp}</div>
      </div>
      ${rollHTML}
      ${s.notes ? `<div style="margin-top:10px;font-size:14px;color:var(--text-muted);font-style:italic;border-top:1px solid var(--border-card);padding-top:10px;">${s.notes}</div>` : ''}
    </div>`;
  }).join('');

  summaryEl.innerHTML = `
    <div class="result-item" style="margin-bottom:16px;">
      <div class="result-label">Total Sessions Logged</div>
      <div class="result-value gold" style="font-size:28px;">${state.sessions.length}</div>
    </div>
    <div class="result-item" style="margin-bottom:16px;">
      <div class="result-label">Active Players</div>
      <div class="result-value">${state.players.length}</div>
    </div>
    <div class="result-item" style="margin-bottom:16px;">
      <div class="result-label">Active Threads</div>
      <div class="result-value">${state.threads.filter(t => t.status !== 'resolved').length}</div>
    </div>
    <div class="result-item">
      <div class="result-label">NPCs Encountered</div>
      <div class="result-value">${state.npcLog.length}</div>
    </div>
  `;
}

// ────────────────────────────────────────────────
// IMPORT / EXPORT
// ────────────────────────────────────────────────
function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'badgers-end-world-state.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importState() {
  document.getElementById('import-file').click();
}

function loadImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (confirm('Import world state? This will merge with your current data.')) {
        state = { ...state, ...imported };
        saveState();
        renderWorldState();
        alert('World state imported successfully!');
      }
    } catch(err) {
      alert('Invalid JSON file.');
    }
  };
  reader.readAsText(file);
}

// ────────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────────
loadState();
