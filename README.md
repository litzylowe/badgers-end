# Badger's End

A collaborative Dungeons & Dragons campaign set in the port city of **Vellmere** — anchored at the tavern where every faction meets.

**Live site:** https://litzylowe.github.io/badgers-end/

## What's inside

A single-page reference site for the campaign. Every section is a tab:

- **The Vision** — core concept, setting, factions, tone, and how the shared world works across rotating DMs
- **Characters** — profiles for every anchor NPC (established and placeholder), plus the bar staff at Badger's End
- **Locations** — Vellmere and its six faction-aligned quarters, plus the tavern at the heart of it all
- **Events** — a d100 table of session-opening events with an interactive roller
- **Chaos** — an opt-in d100 table for shaking a session up
- **Weather** — a d100 Weather & Season table, mundane atmosphere to eerie omens
- **Rumors** — a d100 Rumors & Overheard table of inn gossip and hooks
- **Art** — the visual gallery: character portraits, city scenes, top-down battle map
- **Set Up Progress** — the running task list of what's built and what's still to come

## Project structure

No build step and no frameworks — plain HTML/CSS/JS served as static files.

```
index.html      # markup and page structure
styles.css      # all styling
app.js          # tab switching, d100 rollers, task-progress state
assets/
  Characters/   # anchor NPC + bar-staff portraits
  Scenes/       # city quarters, tavern interior, opening-scene video
  Maps/         # top-down battle map
  Misc/         # logo and other odds and ends
.nojekyll       # tells GitHub Pages to serve files as-is (skip Jekyll)
```

Images are web-optimized (portraits ~600px, scenes ~1000px, JPEG); the opening-scene
video is a ~1 MB 720p clip. Source-resolution art lives outside the repo.

## Publishing to GitHub Pages

1. Push the repository to GitHub (public, for free Pages hosting).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose `main` and `/ (root)`. Save.
5. Wait a minute or two. The site publishes at `https://<your-username>.github.io/<repo-name>/`.

## Updating

Edit the relevant file (`index.html`, `styles.css`, `app.js`, or the `assets/`), commit, and push.
GitHub Pages redeploys automatically within a minute or so.

- **Add a d100 entry** — edit the `EVENTS` / `CHAOS` / `WEATHER` / `RUMORS` array in `app.js`.
- **Swap an image** — drop the replacement in the matching `assets/` folder and update the `src` if the filename changes.

## Credits

Campaign, world, and art direction by the DM group. Site scaffolded through Claude.
