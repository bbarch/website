# bbArch — Babbar & Babbar Architects

Production-grade v2 of [bbarch2.com](http://www.bbarch2.com): a dark, cinematic, multi-page static site built for GitHub Pages. No build step, no framework — HTML, CSS and vanilla JavaScript, with CI quality gates.

## Pages

`index.html` · `about.html` · `partners.html` · `projects.html` · `careers.html` · `contact.html` · `404.html`

All original text, project lists, partner bios and contact details carried forward from the current site. Every page has full SEO treatment: unique title & description, canonical URL, Open Graph + Twitter cards, and Schema.org JSON-LD (Organization/ProfessionalService, BreadcrumbList, Person, ItemList).

## Design

Dark cinematic direction: near-black canvas, Fraunces display serif with brass italic accents, Lekton mono for meta, film grain, kinetic line-reveal typography, parallax image bands, magnetic buttons, custom cursor, fullscreen menu. Motion fully disabled for `prefers-reduced-motion`.

Detail imagery in `images/details/` consists of zoomed crops from **bbArch's own photography** (FICCI lattice ceiling, atrium marble, lobby relief, Hotel Park facade) — no third-party buildings. To optionally add true royalty-free stock textures (Unsplash license), run `bash scripts/fetch-stock-details.sh` locally.

All photos ship with WebP counterparts (`<picture>` fallback to JPEG), explicit `width`/`height`, and lazy loading.

## Repository infrastructure

```
.github/
├── workflows/
│   ├── deploy.yml           # builds artifact (excludes archive/dev files) → GitHub Pages
│   ├── html-validation.yml  # W3C HTML + CSS validation on every push/PR
│   ├── lighthouse.yml       # PRs fail if Perf < 90, A11y < 95, SEO < 95
│   ├── link-check.yml       # lychee broken-link check, weekly + on push
│   └── security.yml         # gitleaks secret scan + dependency review
├── ISSUE_TEMPLATE/          # bug report, content update
├── PULL_REQUEST_TEMPLATE.md
├── lighthouserc.json
└── dependabot.yml           # weekly GitHub Actions updates
```

Also included: `robots.txt`, `sitemap.xml`, `llms.txt` (AI readiness), `data/projects.json` (machine-readable project/team/award data), `humans.txt`, `site.webmanifest`, `browserconfig.xml`, favicons, `CNAME` (www.bbarch.com), `.nojekyll`, and `_headers` (CSP/HSTS/etc — inert on GitHub Pages, activates automatically on a future Cloudflare Pages/Netlify migration).

## Deploy

1. Create a GitHub repository and push this folder (the included `deploy.yml` handles publishing — in repo **Settings → Pages** set Source to **GitHub Actions**).
2. Point DNS for `www.bbarch.com` at GitHub Pages (CNAME record → `<username>.github.io`); the `CNAME` file is already in place.
3. Suggested branch model: `main` → production, `beta` → staging (`beta.bbarch.com` via a second repo or Pages environment), `feature/*` for work.

`bbarch2_download/` (the old-site archive) and `scripts/` are excluded from the published site by the deploy workflow.

## Go-live checklist (manual, one-time)

- [ ] **Contact form** — create a free endpoint at [formspree.io](https://formspree.io) and replace `YOUR_FORM_ID` in `contact.html`.
- [ ] **Analytics** — claim code `bbarch` at [goatcounter.com](https://www.goatcounter.com) (or edit the snippet at the bottom of each HTML page). Phone clicks, email clicks and careers applications are tracked as events automatically.
- [ ] **Search engines** — verify the site in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters), then submit `https://www.bbarch.com/sitemap.xml`.

## Customising

Colours and type: CSS variables at the top of `css/style.css` (`--brass`, `--char`, `--bone`, fonts). Copy lives directly in the HTML. Motion and analytics events: `js/main.js`.

---
© bbArch · ISO 9001:2008 Company · New Delhi
