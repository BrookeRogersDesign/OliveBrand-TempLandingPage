# Olive Branch — Temporary Landing Page

A holding page to run at the client's domain while the full site is built.
Hand-built static HTML/CSS/JS, no build step — open `index.html` and it works.

Built from the Figma frame **"Olive Branch | Temp Landing"** (node `20:587`).

**This is not the real site.** The full build lives in
[OliveBranch](https://github.com/BrookeRogersDesign/OliveBranch) and eventually
becomes a custom WordPress theme on Flywheel. When that launches, point the
domain there and retire this repo.

---

## Structure

```
├── index.html          the whole page
├── css/
│   ├── main.css        the only stylesheet the page links
│   ├── tokens.css      ★ copied from the main build — colours, type, spacing
│   ├── fonts.css       @font-face for the self-hosted Work Sans
│   ├── base.css        reset + global typography
│   ├── layout.css      containers and grids
│   ├── components.css  buttons, fields, footer
│   ├── utilities.css   small helpers
│   └── pages/temp.css  everything specific to this page
├── js/
│   ├── icons.js        inline SVG icon set
│   └── form.js         Formspree submission over fetch
└── assets/             fonts, logos, favicon, social image
```

`tokens.css`, `fonts.css`, `base.css`, `layout.css`, `components.css` and
`utilities.css` are **copied unchanged from the main Olive Branch build**, so
the two share one visual language. If a token changes there, copy it across.

---

## Connecting the form

The form does nothing until a Formspree endpoint is set. Create a form at
[formspree.io](https://formspree.io), then paste the endpoint into the `action`
in `index.html`:

```html
<form class="form temp-contact__form" id="contact-form"
      action="https://formspree.io/f/xxxxxxxx" method="POST" novalidate>
```

Until then the form refuses to submit and says so plainly. It deliberately does
**not** show a success message for a message that went nowhere.

`js/form.js` posts over `fetch`, so the visitor stays on the page and sees the
result inline rather than being bounced to a Formspree confirmation screen.

---

## Fonts

**Work Sans** is self-hosted — one variable `.woff2`, subset to Latin plus the
symbols the copy uses, 89KB covering every weight. Licensed under the SIL OFL;
`assets/fonts/Work-Sans-OFL.txt` must ship alongside it.

**FreightDisp Pro** (the headline face) is licensed through Adobe Fonts. Until
Freight *Display* Pro is added to the kit, the headline falls back to Georgia —
see the notes at the top of `css/fonts.css`.

---

## Deploying

GitHub Pages, deploy from `main` / root. `.nojekyll` is committed and every path
is relative, so it works from a subdirectory or a custom domain unchanged.

The page is set `noindex` so it doesn't compete with the real site in search
results later. Remove that meta tag from `index.html` if the client wants the
holding page findable.
