# V1 QA

Verification date: 2026-10-25.

## Executed checks

- [x] Ran python3 build.py successfully. Copied INDEX.md and all 10 city files into data/cities/.
- [x] Parsed cities.json: exactly 10 cities. Generated permit, cap, tax, and flux fields directly from the INDEX.md table.
- [x] Compared every copied city file byte for byte against its source.
- [x] Ran node --check app.js successfully.
- [x] Exercised the markdown renderer in a Node VM: headings, paragraphs, bullets, tables, bold, HTTP links, escaped HTML, and rejection of javascript link schemes.
- [x] Rendered all 11 markdown files and confirmed every UNVERIFIED label remains present.
- [x] Scanned project text files for prohibited em dash characters: none found.
- [ ] Local HTTP check blocked by environment. Free-port discovery failed because socket creation raises PermissionError: Operation not permitted. Also attempted python3 -m http.server 8765 --bind 127.0.0.1 in the background; it exited with the same socket restriction. Curl of / and /data/cities/san-diego-ca.md both failed to connect. Background process was reaped; no server remains running. HTTP success is not claimed.

## Manual checklist verified by reading code

These checks describe code inspection, not browser interaction.

- [x] Home contains headline, promise, 10 city cards, search, how it works, sample teaser, pricing, signup, FAQ, byline, and footer disclaimer.
- [x] Search filters city names and state abbreviations case insensitively and provides count and empty state.
- [x] Hash routes cover home, city, comparison, sample alert, pricing, signup, and unknown routes.
- [x] City lookup is restricted to known slugs, fetches local markdown, shows a last verified badge from the file, and places the disclaimer above and below the document.
- [x] Async city results are ignored after navigation to another view.
- [x] Comparison fields match INDEX.md; table has headers and horizontal overflow on small screens.
- [x] Sample alert clearly labels the sample, gives October 23, 2026 counts of zero Tier 4 and 807 Tier 3, and links to the San Diego file and city view. Historical counts are explicit.
- [x] Pricing matches all four tiers, market limits, annual two months free, and pilot payment terms.
- [x] Signup has labeled name and email fields, 10 city checkboxes plus Other, tier select, and submit.
- [x] Browser email validation and required fields apply. Submission also checks a nonblank name and at least one market.
- [x] Signup appends entries to localStorage under strt_signups. Success explains the email handoff. Storage failures have a support note and populated email fallback.
- [x] No backend or automatic email claims. Manual review and one business day confirmation are explained as starting upon receipt by email.
- [x] No contact address was supplied, so mailto drafts require the visitor to add David's address. This is explicit in the UI and README.
- [x] Every view has the exact disclaimer through the persistent footer, with additional notices in main content.
- [x] System fonts, local CSS and JavaScript, same-origin data fetches, no external assets or automatic external requests.
- [x] Responsive grids, visible focus styles, skip link, semantic navigation, form labels, fieldset legend, and live feedback are defined.
- [x] Byline uses David's first name only.

## Browser checks still to run outside this sandbox

- [ ] Start python3 -m http.server on an available port; curl home and a city file; stop the server.
- [ ] Navigate all routes, use back and forward, and open a direct city hash URL.
- [ ] Exercise search, empty results, FAQ controls, signup validation, repeated saves, blocked storage, and email draft content.
- [ ] Verify keyboard navigation and focus, screen reader feedback, and layouts at phone and desktop widths.
- [ ] Verify actual browser rendering of all city documents and the comparison table.
