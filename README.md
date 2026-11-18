# Comunistas

A small, source-led scroll story about Augusto Pinochet's arrest in London, the Spanish extradition request, the House of Lords rulings and the case's limits.

## Develop

```sh
npm ci
npm run dev
```

The story separates allegations, judicial decisions and the eventual outcome. Pinochet was not extradited to Spain and did not stand trial there.

## Languages

Spanish is the default (`/`), English lives at `/en` (`/es` redirects to `/`). Routing follows the Next.js internationalization guide: `app/[lang]` with static params, no runtime library.

- Language-independent structure (visuals, dot counts, links) is in `app/data.js`.
- All visible text is in `app/i18n/es.js` and `app/i18n/en.js`, same shape and order; `getContent()` in `app/i18n/index.js` merges them.
- To add a language, add `app/i18n/<code>.js`, register it in `app/i18n/index.js`, and the routes, metadata and switcher follow.

## Site details

- `app/site.js` holds `author` and `contact`. While they are `null` the credits and the "found a mistake?" line leave them out; set them to show them.
- Share images and the Apple icon are generated from `scripts/og/template.html` with `node scripts/og/make.mjs` (needs Playwright).
- `app/scenes.js` draws the ten timeline panels; `app/enemy-definer.js` is the canvas dot field (40,018 dots, one per recognised victim).

## Sources

- [House of Lords judgment, 24 March 1999](https://publications.parliament.uk/pa/ld199899/ldjudgmt/jd990324/pino1.htm)
- [House of Lords judgment, 15 January 1999](https://publications.parliament.uk/pa/ld199899/ldjudgmt/jd990115/pino01.htm)
- [House of Commons Hansard, 2 March 2000](https://api.parliament.uk/historic-hansard/commons/2000/mar/02/senator-pinochet)
- [House of Commons Hansard, 12 January 2000](https://api.parliament.uk/historic-hansard/commons/2000/jan/12/senator-pinochet)
- [House of Lords Appeal Committee report](https://publications.parliament.uk/pa/ld199899/ldselect/ldappeal/15/15.pdf)
