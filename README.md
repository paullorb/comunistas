# Comunistas

**[comunistas.app](https://comunistas.app)** — a source-led scroll story, in Spanish and English, about how Chile's dictatorship defined its enemy by decree, how a Spanish warrant reached Augusto Pinochet in London in 1998, and why the case ended without a verdict.

The story separates allegations, judicial decisions and the eventual outcome. Pinochet was not extradited to Spain, did not stand trial there and was never convicted. Every claim on the page links to a document; official records come first, and archival copies and press are labelled as such.

It is an independent project, not affiliated with any party or institution.

## Contributing

Corrections and better sources are the most useful contributions. Start with [CONTRIBUTING.md](CONTRIBUTING.md): it sets out the sourcing rules, which matter more here than the code. Please also read the [code of conduct](CODE_OF_CONDUCT.md). Security problems go through [SECURITY.md](SECURITY.md), not public issues.

## Develop

```sh
npm ci
npm run dev          # http://localhost:3000
npm run check        # content guardrails: languages in step, claims linked, figures add up
npm run check:links  # do the sources still answer? (slow, hits outside servers)
npm run lint
npm run build
```

Node 24 (see `.node-version`). The build needs no environment variables or secrets.

## Languages

Spanish is the default (`/`), English lives at `/en` (`/es` redirects to `/`). Routing follows the Next.js internationalization guide: `app/[lang]` with static params, no runtime library.

- Language-independent structure (visuals, dot counts, links) is in `app/data.js`.
- All visible text is in `app/i18n/es.js` and `app/i18n/en.js`, same shape and order; `getContent()` in `app/i18n/index.js` merges them.
- To add a language, add `app/i18n/<code>.js`, register it in `app/i18n/index.js`, and the routes, metadata and switcher follow.

## Site details

- `app/site.js` holds `author` and `contact`. While they are `null` the credits and the "found a mistake?" line leave them out; set them to show them.
- Share images and the Apple icon are generated from `scripts/og/template.html` with `node scripts/og/make.mjs` (needs Playwright).
- `app/scenes.js` draws the ten timeline panels; `app/enemy-definer.js` is the canvas dot field (41,481 dots, one per recognised victim; the figures are in `VICTIMS` in `app/data.js`).

## Sources

The full, annotated list is on the page itself (`sourceBase` in `app/data.js`, titles in `app/i18n/`). Official records come first; archival copies and press are labelled as such. The backbone:

- [House of Lords judgment, 24 March 1999](https://publications.parliament.uk/pa/ld199899/ldjudgmt/jd990324/pino1.htm)
- [House of Lords judgment, 15 January 1999](https://publications.parliament.uk/pa/ld199899/ldjudgmt/jd990115/pino01.htm)
- [House of Commons Hansard, 2 March 2000](https://api.parliament.uk/historic-hansard/commons/2000/mar/02/senator-pinochet)
- [House of Commons Hansard, 12 January 2000](https://api.parliament.uk/historic-hansard/commons/2000/jan/12/senator-pinochet)
- [House of Lords Appeal Committee report](https://publications.parliament.uk/pa/ld199899/ldselect/ldappeal/15/15.pdf)

## For maintainers

- `scripts/github/repo-settings.sh` applies the repository settings the project relies on: squash-only merges, a protected default branch with required checks, secret scanning, Dependabot, restricted Actions and approval for outside contributors' workflow runs. Some of these exist only on public repositories, so run it again after any change of visibility.
- CI runs pull requests from forks on GitHub-hosted runners with a read-only token and no secrets. Keep it that way: do not add `pull_request_target` workflows that check out a contributor's code, and do not give the build secrets.
- Response headers, including the content security policy, are set in `next.config.mjs`. Anything new the page loads from another origin has to be allowed there.
- `app/site.js` holds `repo`, the public repository URL behind the "propose a correction" link under the sources.

## Licence

Two licences, because the project is two things:

- **Code** — everything not listed below — is under the [MIT License](LICENSE).
- **Content** — the text in `app/i18n/`, the illustrations drawn in `app/scenes.js` and the hero, and the images in `public/` — is under [Creative Commons Attribution-ShareAlike 4.0 International](LICENSE-CONTENT) (CC BY-SA 4.0). Reuse it with credit to "Comunistas (comunistas.app)" and a link, and share adaptations under the same licence.

The documents the story cites belong to their own authors and institutions and are not covered by either licence.
