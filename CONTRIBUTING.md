# Contributing

Thank you for helping. This project tells a politically charged story from the documentary record, so the bar for a change is not "is it plausible" but "can a reader follow it to the document". Everything below serves that.

## Ways to help

- **Report an error.** Open a [correction issue](../../issues/new?template=correction.yml). Say what the page claims, what the source says, and link the source.
- **Propose a better source.** If a claim cites press or an archival copy and you know where the official record lives, open a [source issue](../../issues/new?template=source.yml).
- **Fix a bug or improve the code.** Open a pull request. For anything larger than a small fix, open an issue first so we agree on the approach.
- **Translate.** A new language is welcome; see "Languages" below. Partial translations cannot be merged.

## The sourcing rules

These are the project's method. A pull request that changes what the page says must follow them.

1. **Primary sources first.** In order of preference:
   1. the official record itself: laws and decrees, court rulings, parliamentary records, commission reports, declassified government documents, on an official host;
   2. the same document on an established archive (a national library, a university documentary archive, the Internet Archive), labelled as an archival copy;
   3. reports by recognised human-rights organisations, labelled as such;
   4. press, labelled as press, and only for facts no official record carries.
2. **No Wikipedia or other tertiary sources** as a citation. Use them to find the primary document, then cite that. The content check rejects them.
3. **Open the source and read it.** Quote exactly, in the original language. Do not quote from memory, from a summary, or from an AI assistant's answer. If you used an AI tool to find or draft something, you are still the one vouching that the quote is in the document.
4. **Translations are marked.** A quotation translated by us carries "(our translation)" / "(traducción propia)".
5. **Keep allegation, ruling and outcome apart.** "Was accused of", "a court held" and "was convicted of" are different facts. Nobody is described as guilty of something no court found.
6. **Claims about named living people need a court ruling or an official document.** Press reports are not enough.
7. **Show disagreements between sources** instead of choosing one silently. If two records give different dates, say so and say which is which.
8. **Figures are official recognitions.** Use the number the document prints. If you add two official numbers together, say on the page that the sum is ours.
9. **Editorial readings are labelled.** Interpretation is allowed in the copy only when it is marked as an editorial reading and kept apart from the record.
10. **Pin the version.** Laws change. Link the version of the text you are quoting (for Ley Chile, add `idVersion=`).

A change that removes an unsupported claim is as welcome as one that adds a supported one.

## Making a change

```sh
npm ci
npm run dev        # http://localhost:3000
npm run check      # content guardrails (see below)
npm run lint
npm run build
```

Node 24 is expected (see `.node-version`).

### Where things live

- `app/data.js` holds everything that is the same in every language: the order of steps and chapters, the dot counts, the victim figures and **every link**.
- `app/i18n/es.js` and `app/i18n/en.js` hold all visible text, in the same shape and order.
- `app/scenes.js` draws the timeline illustrations; `app/enemy-definer.js` is the dot field.
- A chapter's `cues` pair a phrase of its body with the red tag shown in its panel. If you reword a body, keep its cue phrases word for word (the check tells you when one no longer matches).

### Languages

Spanish is the default; English lives at `/en`. **Every text change must be made in both files in the same pull request.** The content check fails if the two differ in shape. If you are not confident in one of the languages, say so in the pull request and a maintainer will help; do not leave a machine translation unmarked.

### Adding or changing a source

1. Add the link to `sourceBase` in `app/data.js`, in the right group, with the language of the document.
2. Add its `{ title, detail }` at the same position in the `sources` list of **both** language files. The detail says what the source is used for and, if it is not an official host, what kind of copy it is.
3. If a step in the enemy list cites it, the step's `sourceHref` must be the same link.

### What the checks enforce

`npm run check` (also run in CI) fails when:

- the two languages differ in shape, or any text is empty;
- chapters, steps or sources are out of step with `app/data.js`;
- a source link is invalid, duplicated, not https, or from a banned host;
- a step cites a link that is not in the source list;
- the victim figures do not add up, or a figure was changed in one place only.

`npm run check:links` checks that every source still answers. It runs weekly, not on pull requests, because outside servers are unreliable; run it yourself if you add links.

The checks cannot tell whether a quote is accurate. Reviewers will open your sources, so make that easy: give the page, paragraph or article number in the pull request.

## Pull requests

- One topic per pull request. A correction and a redesign are two pull requests.
- Fill in the template, including the source table for any change of fact.
- Do not commit generated files (`.next`, `node_modules`) or anything containing credentials. The project needs no secrets to build.
- By contributing you agree that your contribution is published under the project's licences: MIT for code, CC BY-SA 4.0 for text and illustrations (see `README.md`).

## Conduct

This subject involves real victims and living memory. Read the [code of conduct](CODE_OF_CONDUCT.md). Disagreement about sources is the work; contempt for people is not.
