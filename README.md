# AI Style Assistant proposal site

A one-page React proposal for Hazel (IceyCrew): an AI Style Assistant mobile app for the store's paying VIP members. A member verifies their Shopify order, builds a style profile with a swipe deck and a colour quiz, photographs an outfit and gets a score out of 100 with Fit, Colour, Cohesion and Occasion marks, positives, negatives and tips; a web admin panel edits the prompts, the deck, the limits and the membership provider. Built from the issued proposal document and the discovery call.

## The world
The page is **the Grading Report**: the jeweller's certificate that comes with a graded stone. Every section is a field on the report, inscribed with its code (F-01 to F-12); the milestones are fields M-01 to M-08. The one card family is report stock with a gold micro-rule frame; display numerals and amounts are foil-struck in gold; anything confirmed or included carries the gold seal; the four marks the product gives every outfit (Fit · Colour · Cohesion · Occasion) are the illustration. The close is the acceptance slip, signed, ticked field by field and sealed "Accepted".

Palette: off-white report stock, near-black ink, IceyCrew's gold (#E6B316) for the one action, every amount and the seal (gold as text only in its darker ink), inscription blue for anything verified. Type: Playfair Display / Outfit / JetBrains Mono.

## Commercials
`src/data/proposal.ts` → `COMMERCIALS`. `totalCost` 8000, `timelineMonths` 3, eight milestones at 10/10/15/15/15/15/10/10 percent; every amount on the page derives from these. Support terms: ninety days of free support and maintenance for bug fixes (as the issued document says), then completely optional ($500 a month for up to 15 hours, $30 an hour beyond, opt-in).

## Run
```
npm install
npm run dev          # http://localhost:5304
npm run build
node scripts/audit.mjs      # template detector, contrast, overflow, overlap, scrub, images, vendor names
node scripts/interact.mjs   # clicks every surface
node scripts/shoot.mjs      # screenshots at 320/375/768/1024/1440, both themes
```
`?mock=1` previews every ProductMock screen. `?theme=dark|light` forces a theme.

## Imagery
Bundled under `src/assets/img` with licences in `LICENSES.md`: Unsplash photographs of outfits, a clothes rail, gold jewellery, a store and one portrait standing in for the demo member, all ≤ 300 KB.

## Visitor logging
`src/tracker/tracker.js` posts page views, section views and actions to the Google Apps Script deployed from `apps-script/iceycrew-logger.gs` (sheet "hazel logs", tab "proposal logs"; the same script also serves the clickable prototype's "prototype logs" tab). Localhost and automated browsers never write. The secret is visible in the client bundle: a speed bump, not security, acceptable for a throwaway client demo only. Logging a client's behaviour is something you may want to disclose to them.
