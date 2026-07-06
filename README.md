# bbArch — Babbar &amp; Babbar Architects

A refined, minimalist single-page redesign of [bbarch2.com](http://www.bbarch2.com), built to be dropped straight onto GitHub Pages (or any static host). No build step, no framework, no dependencies — just HTML, CSS and a little vanilla JavaScript.

## Structure

The whole site is one scrolling page — **`index.html`** — with anchored sections: Home, About, Partners, Projects (+ gallery + recognition), Careers, and Contact. The top navigation and footer links scroll smoothly to each section.

`about.html`, `partners.html`, `projects.html`, `careers.html` and `contact.html` are kept only as tiny redirect stubs pointing at the matching section (so any old deep links still work); they can be deleted if you don't need them.

All original text, project lists, partner bios, contact details and links were carried forward from the current site.

### Typography &amp; logo
The site is set in **Lekton** — a free Google Fonts typewriter-style face — used site-wide for headings and body. The **bbArch "bba" logo** appears in the header and footer; it's rendered from `images/logo-mask.png` as a CSS mask so it automatically takes the correct colour (dark on light, light on dark) in every context.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `bbarch-website`).
2. Upload every file in this folder to the repo (keep the folder structure: `css/`, `js/`, `images/`).
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**, select the `main` branch and the `/ (root)` folder, then **Save**.
5. Your site goes live at `https://<username>.github.io/<repo>/` within a minute or two.

The included `.nojekyll` file tells GitHub Pages to serve everything as-is.

### Custom domain (optional)
To use `bbarch.com` (or similar), add a file named `CNAME` containing just your domain, then point your DNS to GitHub Pages per their docs.

## Images

All images are bundled locally in the `images/` folder, so the site is fully self-contained with **no dependency on the old host**. If any image is ever missing, it falls back gracefully to a styled placeholder. To swap a photo, just replace the file in `images/` (keep the same filename) or update the `src` in the relevant `.html` file.

## Contact form

The inquiry form on `contact.html` is wired for [Formspree](https://formspree.io) (free tier). To activate it:
1. Create a form at formspree.io and copy your form ID.
2. In `contact.html`, replace `YOUR_FORM_ID` in the form's `action` with your ID.

Until then, visitors can still reach the studio via the phone number and email shown on the page. The careers page submits through the existing Google Form.

## Customising

- **Colours & type:** edit the CSS variables at the top of `css/style.css` (`--accent`, `--ink`, `--paper`, fonts).
- **Copy:** all text lives directly in the HTML files.
- **Motion:** scroll-reveal and effects are in `js/main.js`; motion is automatically reduced for users who prefer it.

---
© bbArch · ISO 9001:2008 Company · New Delhi
