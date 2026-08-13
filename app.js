const STORAGE_KEY = 'badgers-end-project-plan-v2';

  function taskId(taskEl) {
    // Stable id: phase index + position within phase
    const phase = taskEl.closest('.task-list').getAttribute('data-phase');
    const siblings = Array.from(taskEl.parentNode.children);
    return 'p' + phase + '-t' + siblings.indexOf(taskEl);
  }

  function saveState() {
    const state = {};
    document.querySelectorAll('.task').forEach(t => {
      state[taskId(t)] = t.getAttribute('data-done') === 'true';
    });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const state = JSON.parse(raw);
      document.querySelectorAll('.task').forEach(t => {
        // Never un-done the "Already Built" foundation items
        if (t.closest('.task-list').getAttribute('data-phase') === '0') return;
        const done = !!state[taskId(t)];
        setDone(t, done);
      });
    } catch(e) {}
  }

  function setDone(taskEl, done) {
    taskEl.setAttribute('data-done', done ? 'true' : 'false');
    taskEl.classList.toggle('done', done);
    const badge = taskEl.querySelector('.task-badge');
    if (badge) {
      // Preserve original badge class in a data attribute
      if (!taskEl.hasAttribute('data-orig-badge')) {
        taskEl.setAttribute('data-orig-badge', badge.className);
      }
      if (done) {
        badge.className = 'task-badge badge-done';
        badge.textContent = 'Done';
      } else {
        badge.className = taskEl.getAttribute('data-orig-badge');
        const p = taskEl.getAttribute('data-priority');
        badge.textContent = p === 'high' ? 'High' : p === 'med' ? 'Medium' : p === 'low' ? 'Low' : 'Done';
      }
    }
  }

  function refreshProgress() {
    const all  = document.querySelectorAll('.task');
    const done = document.querySelectorAll('.task[data-done="true"]');
    document.getElementById('done-count').textContent  = done.length;
    document.getElementById('total-count').textContent = all.length;
    const pct = all.length ? (done.length / all.length * 100).toFixed(0) : 0;
    document.getElementById('progress-fill').style.width = pct + '%';

    // Per-phase progress
    document.querySelectorAll('.phase').forEach(phase => {
      const tasks = phase.querySelectorAll('.task');
      const doneTasks = phase.querySelectorAll('.task[data-done="true"]');
      const label = phase.querySelector('.phase-progress');
      if (label) label.textContent = doneTasks.length + ' / ' + tasks.length;
    });
  }

  function toggleTask(taskEl) {
    const done = taskEl.getAttribute('data-done') === 'true';
    setDone(taskEl, !done);
    saveState();
    refreshProgress();
  }

  function exportPlan() {
    const state = {};
    document.querySelectorAll('.task').forEach(t => {
      state[taskId(t)] = t.getAttribute('data-done') === 'true';
    });
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'badgers-end-plan-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importPlan() {
    document.getElementById('import-file').click();
  }

  function loadImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target.result);
        document.querySelectorAll('.task').forEach(t => {
          if (t.closest('.task-list').getAttribute('data-phase') === '0') return;
          const done = !!imported[taskId(t)];
          setDone(t, done);
        });
        saveState();
        refreshProgress();
      } catch(err) {
        // silent — no alerts to avoid modal issues
      }
    };
    reader.readAsText(file);
  }

  function resetPlan() {
    if (!confirm('Reset all progress? Foundation items stay marked done.')) return;
    document.querySelectorAll('.task').forEach(t => {
      if (t.closest('.task-list').getAttribute('data-phase') === '0') return;
      setDone(t, false);
    });
    saveState();
    refreshProgress();
  }

  // Wire up
  document.querySelectorAll('.task').forEach(t => {
    // Initial done items — properly set badge/class via setDone
    if (t.getAttribute('data-done') === 'true') {
      setDone(t, true);
    }
    // Click handler on the whole task
    t.addEventListener('click', ev => {
      if (ev.target.tagName === 'A' || ev.target.tagName === 'BUTTON') return;
      toggleTask(t);
    });
  });

  // ─── Events table (d100) ───
  const EVENTS = [
    `All quiet — an unusually peaceful day in the city`,
    `Market day is in full swing; merchants crowd the square`,
    `Weekly religious services fill the sanctuary`,
    `Traveling minstrels have set up in the square, drawing a crowd`,
    `A wedding procession winds through the main streets`,
    `A funeral procession moves solemnly toward the sanctuary`,
    `A children's festival — bright decorations everywhere`,
    `A tax collector makes rounds; grumbling in the market`,
    `Guards conduct a routine search near the harbor gates`,
    `An artisan wins a coveted commission; celebration in the market`,
    `A visiting dignitary tours the town hall`,
    `A prisoner is publicly pilloried in the square`,
    `A new shipment arrives at the harbor — cargo of unclear origin`,
    `A stray dog has been terrorizing the market stalls`,
    `A minor scuffle between drunkards spills into the streets`,
    `Roof repair on a busy shop blocks a corner`,
    `A traveling merchant offers exotic goods at the market`,
    `A drunk sailor causes a scene at the harbor tavern`,
    `The blacksmith's forge produces a small fire that briefly spreads`,
    `An old woman has set up as a fortune teller near the Inn`,
    `Rats are unusually bold in the market today`,
    `A carriage overturns on the main road; goods scattered`,
    `The bakery's ovens smoke oddly; a sooty haze over the market`,
    `A busker plays haunting melodies near the graveyard`,
    `Fishermen return with an unusually good catch — celebration at the docks`,
    `Packed tonight at the Badger's End — standing room only`,
    `A hooded stranger has been nursing a drink for six hours`,
    `Mr. Hoots appeared silently beside a sleeping patron, staring`,
    `Two faction representatives eat at separate tables, watching each other`,
    `Someone left a locked box at the bar with no note`,
    `A bard arrives and starts a rather pointed ballad about someone present`,
    `A fight broke out in the alley; someone stumbles in bleeding`,
    `Three off-duty guards are deep in their cups and getting loud`,
    `A raven arrives with a message addressed to the party`,
    `Mr. H is humming a Fae melody — he has never done that before`,
    `A traveling scholar seeks lodging and asks strange questions`,
    `An off-duty guard drinks alone in the corner, clearly troubled`,
    `A tavern regular hasn't shown up in days — Mr. H seems worried`,
    `The Head Chef is preparing a special dish tonight — the smells fill the room`,
    `A group of merchants argue loudly over a business deal`,
    `Someone tries to sell "exotic" jewelry at every table`,
    `A drunk tells stories to anyone who'll listen — some of them are true`,
    `A pair of lovers meet secretly at a corner table`,
    `A young hopeful adventurer arrives asking about work`,
    `The Junior Barkeep breaks a rare bottle; Mr. H doesn't react`,
    `The Shield is quietly increasing patrols — something is coming`,
    `The Coin is throwing a lavish banquet; invitations are power`,
    `The Light has declared a holy day; temple bells ring all morning`,
    `The Quill sent a sealed letter to someone at the inn — unopened`,
    `The Shadow's calling card was left on a merchant's door overnight`,
    `The Masked have made a move — but no one knows exactly what`,
    `Captain Wren is off duty and looking for a drink and honest company`,
    `Mira Kael has a "special item" she's showing to trusted customers`,
    `Aldric Fenn's latest experiment has caused a small explosion`,
    `Governor Ashvale is holding an emergency council meeting`,
    `Sister Corvin is tending to an unusual number of wounded tonight`,
    `A Shield deserter is being hunted through the city`,
    `The Coin is short a key merchant — someone is missing`,
    `The Light has received an anonymous donation of extraordinary size`,
    `The Quill has been asking around about ancient ruins nearby`,
    `The Shadow is offering "opportunities" to specific people`,
    `The Masked have left a symbol carved into a public building`,
    `A faction leader is seen entering the tavern in a poor disguise`,
    `Two factions are in open dispute; the city guard mediates poorly`,
    `An unaligned figure gains sudden influence across multiple factions`,
    `Clear and bright — good omen or suspiciously fine`,
    `Dense morning fog off the sea; visibility is poor`,
    `Rain all day — steady and cold, the streets are quiet`,
    `A sudden storm rolls in from the sea; lightning over the harbor`,
    `Unseasonal warmth — people are restless and out in the streets`,
    `Bitter wind from the hills; something smells faintly of smoke`,
    `Overcast and grey — the oppressive kind of afternoon`,
    `A dry, strange wind blows eastward; it carries whispers`,
    `First snow of the season; children play in the streets`,
    `Unusual heat wave — tempers flare across the city`,
    `A merchant offers double pay to find their stolen ledger — no questions asked`,
    `A child tugs at a party member's sleeve: "My da didn't come home last night"`,
    `A letter slipped under someone's door: "They know who you are. Leave now."`,
    `A city guard approaches, clearly nervous: "The captain wants a word. Quietly."`,
    `A cloaked figure drops a coin pouch on the table and walks away without speaking`,
    `The locked box at the bar begins to tick`,
    `One of the anchor NPCs pulls the party aside with an unusual request`,
    `A wanted poster with a familiar face — possibly someone the party has met`,
    `A map fragment falls out of an unconscious drunk's coat`,
    `Mr. Hoots lands on the table and stares toward the docks, unblinking`,
    `A masked messenger delivers a sealed invitation`,
    `A child at the market shows the party a strange coin worth more than she knows`,
    `An unfamiliar sailor asks about a place no map shows`,
    `A body was found near the docks at dawn`,
    `A noble's carriage was robbed on the main road`,
    `Strange lights were seen over the harbor last night`,
    `Tensions between dockworkers and the merchant guild erupt into open dispute`,
    `Curfew has been imposed — the Governor is nervous about something`,
    `Rumors of a plague ship spotted offshore; the harbormaster is hiding it`,
    `A prominent citizen has vanished without trace`,
    `Multiple witnesses report having the same nightmare last night`,
    `A statue in the sanctuary is bleeding — the temple has closed its doors`,
    `A Fae creature has been seen at the woods outside the city`,
    `The Hidden Council leaves a message only the party can read`,
    `Something ancient stirs beneath the city — the earth trembles briefly`,
  ];

  function renderEvents() {
    const left  = document.getElementById('events-tbody-left');
    const right = document.getElementById('events-tbody-right');
    if (!left || !right) return;
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    let leftHTML = '', rightHTML = '';
    EVENTS.forEach((text, i) => {
      const n = i + 1;
      const row = `<tr id="event-row-${n}"><td>${n}</td><td>${esc(text)}</td></tr>`;
      if (n <= 50) leftHTML += row; else rightHTML += row;
    });
    left.innerHTML  = leftHTML;
    right.innerHTML = rightHTML;
  }

  function rollEvent() {
    const resultEl = document.getElementById('events-roll');
    const detailEl = document.getElementById('events-detail');
    document.querySelectorAll('#tab-events .events-table tr.highlighted').forEach(t => t.classList.remove('highlighted'));
    resultEl.classList.add('rolling');
    let ticks = 0;
    const interval = setInterval(() => {
      resultEl.textContent = String(Math.floor(Math.random() * 100) + 1).padStart(2, '0');
      ticks++;
      if (ticks > 10) {
        clearInterval(interval);
        const n = Math.floor(Math.random() * EVENTS.length) + 1;
        resultEl.classList.remove('rolling');
        resultEl.textContent = String(n).padStart(2, '0');
        detailEl.textContent = EVENTS[n - 1];
        detailEl.classList.add('has-result');
        const row = document.getElementById('event-row-' + n);
        if (row) {
          row.classList.add('highlighted');
          row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 55);
  }

  // ─── Chaos table (d100) ───
  const CHAOS = [
    `Someone's drink turns into a completely different beverage between the bar and their lips`,
    `Every dog in the city howls simultaneously for exactly three minutes, then stops`,
    `A patron's hat becomes very slightly too small. Nobody knows why`,
    `The tavern's cat has kittens. Nobody knew there was a cat`,
    `Every candle in the room bows toward the same corner as if in a breeze. There is no breeze`,
    `A random PC's hair grows six inches over the next hour`,
    `The Junior Barkeep speaks only in perfect rhyming couplets for the rest of the night`,
    `Someone bites into their food and finds a single perfect pearl`,
    `The tavern door refuses to open for one specific patron for the next ten minutes`,
    `Every coin in a PC's pocket is now the same denomination — roll d4: 1 copper, 2 silver, 3 electrum, 4 gold`,
    `A courier arrives with a package for a PC that they definitely did not order`,
    `The music from a bard sounds slightly better than they are actually playing`,
    `All the plants in the tavern subtly turn to face a specific patron`,
    `Mr. Hoots is on the ceiling. Upside down. Just… there`,
    `A stray dog wanders in, drops a broken sword at a PC's feet, and leaves without looking back`,
    `Someone across the room laughs. No one is with them`,
    `A random NPC becomes convinced they know a PC from somewhere and won't be dissuaded`,
    `The color of the tavern's hearth-fire turns green for exactly one minute`,
    `A patron sneezes and produces a small burst of butterflies`,
    `The town clock strikes thirteen. Everyone within earshot pretends not to notice`,
    `A PC's shadow lags a half-second behind them for the next hour`,
    `A stranger walks up, hands a PC a folded note reading "you dropped this," and vanishes into the crowd`,
    `Every mirror in the district momentarily reflects a slightly different scene`,
    `A puddle in the street shows the stars, even at noon`,
    `A shop's sign flips itself over between glances`,
    `Everyone at a specific table finishes each other's sentences for the next round of drinks`,
    `A pigeon lands on a PC's shoulder and refuses to leave, no matter what`,
    `Bread at the bakery briefly hums a specific melody when squeezed`,
    `Someone drops a coin. It lands on its edge and stays there`,
    `A cloud shaped exactly like a specific NPC drifts slowly over the city`,
    `The temperature in one specific alley is exactly 20 degrees warmer than everywhere else`,
    `A merchant's scale gives a slightly generous reading all day. They haven't noticed`,
    `A PC receives an unsigned love letter with alarmingly accurate observations about them`,
    `Every rooster in the city crows in perfect unison at midnight`,
    `The rain refuses to fall on one specific PC for the next hour`,
    `A random NPC has clearly stopped aging since the party last saw them`,
    `Two shadows are cast by a single torch. One belongs to no one visible`,
    `The tavern's ale tastes like the drinker's favorite childhood beverage`,
    `A raven has learned to say a PC's name and is quite proud of itself`,
    `A rat delivers a small envelope to a PC and waits for a tip`,
    `Someone's boots trade places with someone else's — same size, wrong owner`,
    `A random NPC's voice sounds exactly like a PC's for one sentence, then reverts`,
    `The temple bells ring for reasons no one at the temple can identify`,
    `A puddle in the market reflects tomorrow's weather instead of today's`,
    `A patron's coin purse is now filled with different coins — same value, wrong currency`,
    `Everyone in the tavern briefly speaks a language they don't know, then forgets it`,
    `A perfectly ordinary loaf of bread appears on a PC's table with no explanation`,
    `The city fountains all run backward for exactly one hour`,
    `A PC's reflection in still water waves at them. They didn't wave first`,
    `A merchant tries to sell a PC something they haven't lost yet`,
    `Every book in the city opens to page 47 simultaneously, then closes`,
    `A specific patron's laugh is now, briefly, the exact sound of wind chimes`,
    `Someone finds a small door in a wall that wasn't there yesterday. It's locked`,
    `A well-known song is playing in the tavern; everyone knows the tune, no one knows the words`,
    `The sky above the harbor turns violet for a moment at dusk`,
    `A cat walks past on its hind legs. Nobody nearby comments`,
    `A PC finds a small key in their pocket. They don't know what it opens`,
    `Somewhere in the city, a lost dog howls the exact tune the bard just finished`,
    `The tavern's front door is now on a completely different wall. It's fine, apparently`,
    `A stranger asks for the time, thanks the party by their true names, and leaves`,
    `The chef's signature dish is subtly perfect tonight; everyone who tries it cries a little`,
    `A PC's weapon feels lighter and warmer than usual. The feeling fades by dawn`,
    `Small floating lights drift through the tavern for a few minutes, then dissipate`,
    `Someone in the crowd is very obviously not blinking. Nobody else has noticed`,
    `A patron's dice keep rolling ones — every roll, all night, no matter the game`,
    `The bar mirror shows one extra person in the room. Turn around: nobody there`,
    `A local fortune teller runs in claiming she's had "the vision," collapses, gets up, orders a drink, and refuses to say more`,
    `A PC's next drink refills itself, quietly, once`,
    `Mr. Hoots is doing an owl equivalent of interpretive dance in the corner. Nobody comments`,
    `Every button on a PC's clothing quietly rearranges itself into a different order`,
    `A stranger at the bar knows a very specific fact about a PC that they've never told anyone`,
    `A patch of grass outside grows a foot tall in a perfect circle overnight`,
    `Someone finds a small golden fish in their soup. Alive. Introduces itself politely`,
    `A PC's boots are now perfectly comfortable — the most comfortable boots they have ever worn`,
    `Every pigeon in the market square lands on the same statue simultaneously, watches nothing, then leaves`,
    `A patron insists they've been sitting for four hours. They arrived twenty minutes ago`,
    `All the fires in the district flicker together, precisely three times`,
    `A local child's toy has come to life. It's polite. It would like a job`,
    `The stars visible tonight are subtly wrong — the constellations don't match the local sky`,
    `A PC hears a familiar voice from an empty room, saying nothing important`,
    `The Head Chef finds an ingredient in the pantry that shouldn't exist here. Uses it anyway`,
    `Water from a specific tavern tap tastes faintly of the sea, no matter how far inland`,
    `A merchant offers a PC a discount for reasons they can't articulate`,
    `The moon looks slightly closer tonight. Only some people notice`,
    `A PC's name is being written in the condensation on a window — as they watch`,
    `Every bell in the city rings once. Not chimed. Rung, as if by a hand`,
    `A perfect double of a PC walks past outside. When looked at directly, it's just someone who resembled them`,
    `A cat brings a PC a gift: a single tarnished ring. It's genuinely magical`,
    `The Fae have marked one PC with an invisible sigil. They'll find out later`,
    `A door opens on its own in the tavern. Nothing comes through. It closes`,
    `Time skips by exactly thirteen seconds. Nobody remembers. The candles are shorter`,
    `A PC dreams a very specific detail and finds it true in the morning`,
    `Something in the basement of the Inn shifts. Mr. H notices. He doesn't mention it`,
    `A song plays from an instrument no one is holding. Everyone hears it. No one comments`,
    `The reflection of the tavern in the window shows a much older version of the building`,
    `A stranger asks a PC a question they've been secretly asking themselves`,
    `A PC receives a letter dated tomorrow. The handwriting is their own`,
    `For one moment, the sky splits and shows another sky beneath it. Then it's gone`,
    `Every patron in the tavern has the same brief, wordless thought at once. Nobody speaks of it`,
    `Mr. Hoots is exactly where he's supposed to be. Everything is fine. Everything is very, very fine`,
  ];

  function renderChaos() {
    const left  = document.getElementById('chaos-tbody-left');
    const right = document.getElementById('chaos-tbody-right');
    if (!left || !right) return;
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    let leftHTML = '', rightHTML = '';
    CHAOS.forEach((text, i) => {
      const n = i + 1;
      const row = `<tr id="chaos-row-${n}"><td>${n}</td><td>${esc(text)}</td></tr>`;
      if (n <= 50) leftHTML += row; else rightHTML += row;
    });
    left.innerHTML  = leftHTML;
    right.innerHTML = rightHTML;
  }

  function rollChaos() {
    const resultEl = document.getElementById('chaos-roll');
    const detailEl = document.getElementById('chaos-detail');
    document.querySelectorAll('#tab-chaos .events-table tr.highlighted').forEach(t => t.classList.remove('highlighted'));
    resultEl.classList.add('rolling');
    let ticks = 0;
    const interval = setInterval(() => {
      resultEl.textContent = String(Math.floor(Math.random() * 100) + 1).padStart(2, '0');
      ticks++;
      if (ticks > 10) {
        clearInterval(interval);
        const n = Math.floor(Math.random() * CHAOS.length) + 1;
        resultEl.classList.remove('rolling');
        resultEl.textContent = String(n).padStart(2, '0');
        detailEl.textContent = CHAOS[n - 1];
        detailEl.classList.add('has-result');
        const row = document.getElementById('chaos-row-' + n);
        if (row) {
          row.classList.add('highlighted');
          row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 55);
  }

  // ─── Weather & Season table (d100) ───
  const WEATHER = [
    `A clear, bright morning; the harbor glitters and gulls wheel overhead`,
    `Mild and overcast — a soft grey sky that never quite commits to rain`,
    `A steady drizzle taps at the inn's windows all afternoon`,
    `Cold and crisp; breath fogs and the cobbles ring underfoot`,
    `Warm and still, the air heavy with tar, salt, and woodsmoke`,
    `A brisk sea wind snaps the banners and rattles loose shutters`,
    `Low fog rolls off the water, softening the docks to grey shapes`,
    `High thin cloud; a pale sun gives light but little warmth`,
    `Bright and blustery — washing lines strain and hats take flight`,
    `Humid and close; tempers fray in the crowded market lanes`,
    `A fine mist hangs in the streets, beading on cloaks and lantern-glass`,
    `Clear skies but a biting wind straight off the northern sea`,
    `Grey and damp, with the smell of rain that never arrives`,
    `A warm front; the day turns unexpectedly golden by noon`,
    `Scattered showers chase people from awning to awning`,
    `Dead calm — not a breath of wind, and the harbor lies like glass`,
    `Frost rimes the rooftops; the first real cold of the season`,
    `A muggy, thundery heaviness builds through the day`,
    `Light snow flurries dust the streets and melt by afternoon`,
    `Sunshine and passing clouds — a genuinely pleasant day, rare enough to note`,
    `Sheeting rain floods the gutters and drums on every roof`,
    `A raw wind carries sleet that stings exposed skin`,
    `Sea fog so thick the far side of the street vanishes`,
    `Blustery and bright, whitecaps crowding the harbor mouth`,
    `An oppressive heat settles; the inn's common room stays shuttered and dim`,
    `Steady rain all day, turning the lower districts to mud`,
    `A clean cold snap; the sky a hard, cloudless blue`,
    `Gusts strong enough to lean into; signs swing and creak`,
    `Drizzle gives way to a startling double rainbow over the bay`,
    `Grey sleet turns to wet snow as the temperature drops`,
    `Morning frost, a bright noon thaw, and an icy dusk`,
    `A warm rain, almost gentle, that everyone secretly enjoys`,
    `Hazy sunshine dimmed by smoke from the smithies and kilns`,
    `The wind swings around to the south, soft and unseasonably mild`,
    `Hard rain and hard wind together — a proper miserable day`,
    `A still, silver fog that seems to swallow every sound`,
    `Bright sun on fresh snow, dazzling enough to make eyes water`,
    `Rolling banks of cloud, brief downpours, sudden shafts of light`,
    `A cold drizzle that works its way into every seam and glove`,
    `Unseasonable warmth; folk shed cloaks and linger in the squares`,
    `A gale rises through the afternoon, driving everyone indoors early`,
    `Thick harbor fog strands three ships outside the mole till it lifts`,
    `Thunder mutters far out to sea, drawing closer by the hour`,
    `Freezing rain glazes the cobbles; the streets turn treacherous`,
    `A dry, dust-laden wind off the inland roads coats everything grey`,
    `Snow falls steadily and settles, hushing the whole city`,
    `A brilliant, cold, windless day — smoke rises dead straight from every chimney`,
    `Squalls march across the bay in ragged grey curtains`,
    `Warm and wet, a clinging fog that never burns off`,
    `The first thunderstorm of the season breaks with a crack overhead`,
    `Rain so heavy the harbor and the sky become one grey wall`,
    `A bitter wind out of the north drops the temperature by the hour`,
    `Fog and drizzle combine into a cold, seeping murk`,
    `Sun breaks through after days of grey, and the city exhales`,
    `A sudden hailstorm rattles down, white stones bouncing on the cobbles`,
    `Sultry and windless; distant heat-lightning flickers after dark`,
    `Sea spray carries over the harbor wall on a rising gale`,
    `A hard frost holds all day; puddles stay locked in ice`,
    `Warm rain and warm wind — the storm has a strange, close feel`,
    `Low cloud presses down until the tallest towers disappear into it`,
    `Gusts tear slates from roofs and send them skating down the lanes`,
    `A cold fog rolls in at dusk and does not lift till morning`,
    `Rain turns to snow turns to rain, the sky unable to decide`,
    `An eerie stillness before a storm; birds fall silent, dogs uneasy`,
    `Driving rain floods the harbor road; carts founder to the axle`,
    `A gale howls in the chimneys all night, keeping the inn awake`,
    `Fog glows faintly at night, lit from within by no clear source`,
    `Snow comes down in fat, silent flakes that muffle the world`,
    `The wind shifts hard and cold, and the temperature plunges at midday`,
    `A sky the colour of a bruise, yellow-grey and swollen with rain`,
    `Lightning walks along the horizon, though no thunder ever comes`,
    `Freezing fog coats every branch and railing in white rime`,
    `A storm surge pushes the tide unusually high against the walls`,
    `Rain falls warm and steady from a strangely bright sky`,
    `The harbor mist tastes of iron and no one says so aloud`,
    `A dry lightning storm crackles overhead without a drop of rain`,
    `Thick snow strands travelers; the inn fills with stranded strangers`,
    `An unseasonable warmth breaks records; the old folk mutter it is wrong`,
    `Wind screams through the harbor rigging like a chorus of voices`,
    `A green tinge to the storm-light sets everyone on edge`,
    `Fog rolls in against the wind, which no sailor likes at all`,
    `Hail large enough to bruise sends the market scattering for cover`,
    `The rain smells of flowers though no season should allow it`,
    `A dead calm falls at noon and the gulls will not land`,
    `Snow falls from a clear, starlit sky, soft and impossible`,
    `The tide goes out far past its mark and is slow to return`,
    `A single black cloud crosses the sun and the day goes briefly cold`,
    `Sheet lightning turns midnight to noon, again and again`,
    `The fog holds shapes that are gone when you look straight at them`,
    `A warm wind carries the sound of distant bells from out at sea`,
    `Frost forms in patterns no one can quite call natural`,
    `The storm arrives from the wrong direction, off the land, not the sea`,
    `Rain falls in one street and not the next, sharp as a drawn line`,
    `The harbor freezes over in a single night, unheard of in living memory`,
    `A red dawn bleeds across the whole sky and lingers far too long`,
    `The wind drops to nothing and the silence has a weight to it`,
    `Snow falls grey, and melts to water that stains the hands faintly`,
    `Thunder rolls with no clouds in a clear, star-strewn sky`,
    `The fog does not lift for three days, and the city learns to live blind`,
    `A stillness like the world holding its breath — even the tide seems to wait`,
  ];

  function renderWeather() {
    const left  = document.getElementById('weather-tbody-left');
    const right = document.getElementById('weather-tbody-right');
    if (!left || !right) return;
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    let leftHTML = '', rightHTML = '';
    WEATHER.forEach((text, i) => {
      const n = i + 1;
      const row = `<tr id="weather-row-${n}"><td>${n}</td><td>${esc(text)}</td></tr>`;
      if (n <= 50) leftHTML += row; else rightHTML += row;
    });
    left.innerHTML  = leftHTML;
    right.innerHTML = rightHTML;
  }

  function rollWeather() {
    const resultEl = document.getElementById('weather-roll');
    const detailEl = document.getElementById('weather-detail');
    document.querySelectorAll('#tab-weather .events-table tr.highlighted').forEach(t => t.classList.remove('highlighted'));
    resultEl.classList.add('rolling');
    let ticks = 0;
    const interval = setInterval(() => {
      resultEl.textContent = String(Math.floor(Math.random() * 100) + 1).padStart(2, '0');
      ticks++;
      if (ticks > 10) {
        clearInterval(interval);
        const n = Math.floor(Math.random() * WEATHER.length) + 1;
        resultEl.classList.remove('rolling');
        resultEl.textContent = String(n).padStart(2, '0');
        detailEl.textContent = WEATHER[n - 1];
        detailEl.classList.add('has-result');
        const row = document.getElementById('weather-row-' + n);
        if (row) {
          row.classList.add('highlighted');
          row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 55);
  }

  // ─── Rumors & Overheard table (d100) ───
  const RUMORS = [
    `"Best stew in Vellmere, and don't let the next tavern tell you different."`,
    `Two dockhands argue over whose ship came in lighter than its manifest`,
    `"Mr. Hoots hasn't blinked once all evening. I counted."`,
    `A merchant complains the Coin's new harbor tariff will ruin honest trade`,
    `Someone swears they saw Captain Wren buying drinks for a stranger in grey`,
    `"The Governor's giving another speech at week's end. Free bread, at least."`,
    `A sailor recounts a reef that wasn't on any chart last season`,
    `Two apprentices whisper about a Quill scholar who hasn't left the archive in days`,
    `"Sister Corvin blessed the whole fishing fleet. Even the leaky one."`,
    `A gambler insists the dice at the Coin's gaming house are weighted`,
    `"Mr. H comped my meal again and I still don't know why."`,
    `Talk of a caravan overdue on the inland road by three days now`,
    `A guard off duty grumbles that patrols have been doubled with no reason given`,
    `"Somebody's been leaving chalk marks on the doors down Shadow way."`,
    `A fishwife swears the catch has been strange near the old breakwater`,
    `Two Coin factors haggle in the corner over a cargo no one will name`,
    `"Aldric Fenn paid his tab in old coin. Really old coin."`,
    `A pilgrim asks the way to the Temple and gets six different answers`,
    `"They fished a locked chest out of the harbor. Guard took it. No one's talking."`,
    `A drunk claims he heard singing under the docks at low tide`,
    `"Mira Kael was asking after you. By name. Thought you'd want to know."`,
    `A merchant's boy runs in breathless with news, then thinks better of saying it`,
    `Two sailors bet on whether the fog tonight will lift by morning`,
    `"The Masked don't exist. That's what a Masked would say, isn't it."`,
    `A carpenter says the new warehouse on the quay has no doors, only walls`,
    `"Governor Ashvale hasn't been seen in daylight this whole month."`,
    `A scholar buys a round to celebrate a discovery she refuses to describe`,
    `Talk that the Shield turned away a ship at the harbor mouth last night`,
    `"Wren's ship came back with fewer crew than she left with. Nobody's asking."`,
    `A beggar outside repeats a name over and over that no one recognizes`,
    `"There's a room upstairs that's been rented a year and never used."`,
    `Two guildsmen argue whether the price of salt is a Coin plot or just weather`,
    `A hooded regular pays double to sit with their back to the wall`,
    `"Heard the Temple bells rang at midnight. Nobody rang them."`,
    `A fisherman describes a light that follows boats home but never reaches shore`,
    `"Mr. Hoots turned his head to watch someone leave. First time I've seen it."`,
    `A courier drops a sealed letter, snatches it back, and won't meet anyone's eye`,
    `Rumor that the archive fire last spring wasn't an accident after all`,
    `"The Coin's buying up debts all over the low district. Cheap. Why now?"`,
    `A soldier home on leave won't say where the garrison marched`,
    `"Somebody carved a symbol into the Badger over the door. Wasn't there yesterday."`,
    `Two women trade whispers about a wedding suddenly, quietly called off`,
    `A map-seller swears his oldest chart of the bay is now missing an island`,
    `"Aldric Fenn asked what I'd take to forget a face. I laughed. He didn't."`,
    `Talk that the tide tables have been off by a full hour for a week`,
    `A guard recognizes a face across the room and very carefully looks away`,
    `"Sister Corvin took in three orphans no one remembers arriving."`,
    `A merchant weeps quietly into his cup and waves off every question`,
    `"They say the Governor signs everything now with a different hand."`,
    `A stranger asks the barkeep, very politely, who owns the Badger's End`,
    `"Mira Kael settled a blood feud with a sentence. Nobody knows which one."`,
    `Two dockworkers found a boat adrift, provisioned, crewed by no one`,
    `A Quill adept mutters equations and flinches at the answers`,
    `"The Shadow called a truce. A real one. That's what frightens me."`,
    `A retired sailor points at the harbor and says it's deeper than it was`,
    `"Captain Wren's been seen three places at once. Can't all be lies."`,
    `A child in the corner draws the same tower over and over, one no one knows`,
    `Talk of a door in the sea wall that opens only on the turning tide`,
    `"The Temple's asking for names of the recently dead. All of them. Why?"`,
    `A moneylender's ledger went missing and he's far too calm about it`,
    `"Mr. H locked the cellar this morning and pocketed the key himself."`,
    `Two guards argue in low voices about an order they've been told to forget`,
    `A trader back from the capital says our name is spoken oddly up there now`,
    `"There's a stain on the Coin house steps that won't wash out. Been a week."`,
    `A woman asks for a room, pays in gemstones, and is gone before dawn`,
    `"The Masked left a chair empty at their own table. On purpose, they say."`,
    `A fisher hauls up a net full of coins, all struck with the same unknown face`,
    `Talk that Governor Ashvale's seal was seen on a writ he swears he never sealed`,
    `"Aldric Fenn's shadow arrived at the inn a moment before he did. I saw it."`,
    `A scholar begs anyone to tell her what day it is and won't say why she's unsure`,
    `"Wren refused a fortune to sail east last week. Wren. Refused."`,
    `Two priests of the Light argue theology until one goes very pale and leaves`,
    `A dockmaster reports a ship on the manifest that no port ever built`,
    `"Someone's been paying the inn's tab of a man who died last winter."`,
    `A guard swears the statue in the square was facing the other way at dawn`,
    `"The Shadow and the Shield drank together last night. End times, surely."`,
    `A merchant's wife recognizes a beggar as a man buried at sea years ago`,
    `Talk that the archive's oldest book has begun, quietly, to change its own text`,
    `"Sister Corvin won't enter the east chapel anymore. Won't say a word about it."`,
    `A sailor describes an island that appears only to those already lost`,
    `"Mira Kael was seen bowing to someone. Kael bows to no one."`,
    `A courier arrives soaked though it hasn't rained in the city for days`,
    `"They're dredging the old harbor. Whatever's down there, the Coin wants it up."`,
    `A stranger orders a meal for two and speaks warmly to the empty seat all night`,
    `"The Governor's tower has one more window than it did. I counted twice."`,
    `Two children swear the well in the low district answered them back`,
    `A guildmaster signs away a fortune and looks, for once, relieved`,
    `"Every clock on the harbor front stopped at the same moment last night."`,
    `A pilgrim arrives asking for a shrine the city tore down a century ago`,
    `"Fenn paid to have a grave dug. Empty. His own name on the stone."`,
    `A fisherman won't go back out and won't say what waved to him from the deep`,
    `"The Masked sent a warning to the Council. The Masked ARE the Council. Aren't they?"`,
    `Talk that last week's fog left footprints on the docks going out, none returning`,
    `A scholar has stopped sleeping and started, very softly, to laugh`,
    `"The Temple sealed a door with wax and prayer. From the outside."`,
    `A merchant sold his ship, his house, his name — and seemed glad to be free of them`,
    `"Wren's charting a course by stars that aren't in the sky yet."`,
    `The tide came in twice one night, and the second tide left things on the shore`,
    `"Ashvale asked the archive for the founding charter. It's blank now. All of it."`,
    `Someone at the bar knows your name, your business, and how tonight ends — and only smiles`,
  ];

  function renderRumors() {
    const left  = document.getElementById('rumors-tbody-left');
    const right = document.getElementById('rumors-tbody-right');
    if (!left || !right) return;
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    let leftHTML = '', rightHTML = '';
    RUMORS.forEach((text, i) => {
      const n = i + 1;
      const row = `<tr id="rumors-row-${n}"><td>${n}</td><td>${esc(text)}</td></tr>`;
      if (n <= 50) leftHTML += row; else rightHTML += row;
    });
    left.innerHTML  = leftHTML;
    right.innerHTML = rightHTML;
  }

  function rollRumors() {
    const resultEl = document.getElementById('rumors-roll');
    const detailEl = document.getElementById('rumors-detail');
    document.querySelectorAll('#tab-rumors .events-table tr.highlighted').forEach(t => t.classList.remove('highlighted'));
    resultEl.classList.add('rolling');
    let ticks = 0;
    const interval = setInterval(() => {
      resultEl.textContent = String(Math.floor(Math.random() * 100) + 1).padStart(2, '0');
      ticks++;
      if (ticks > 10) {
        clearInterval(interval);
        const n = Math.floor(Math.random() * RUMORS.length) + 1;
        resultEl.classList.remove('rolling');
        resultEl.textContent = String(n).padStart(2, '0');
        detailEl.textContent = RUMORS[n - 1];
        detailEl.classList.add('has-result');
        const row = document.getElementById('rumors-row-' + n);
        if (row) {
          row.classList.add('highlighted');
          row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 55);
  }

  // Tab switching
  function showTab(name) {
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.remove('active');
      p.setAttribute('hidden', '');
    });
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    const panel = document.getElementById('tab-' + name);
    const btn   = document.querySelector('.tab-btn[data-tab="' + name + '"]');
    if (panel) { panel.classList.add('active'); panel.removeAttribute('hidden'); }
    if (btn)   { btn.classList.add('active');   btn.setAttribute('aria-selected', 'true'); }
    // Scroll to top of main content on switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadState();
  refreshProgress();
  renderEvents();
  renderChaos();
  renderWeather();
  renderRumors();
