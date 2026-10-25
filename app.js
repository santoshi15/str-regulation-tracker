'use strict';
const main = document.querySelector('main');
const disclaimer = 'This is information only and is not legal advice. Confirm current rules with the city before you buy, list, or renew.';
let cities = [];
let routeVersion = 0;
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const notice = () => `<p class="disclaimer">${disclaimer}</p>`;
function inline(text) {
  const escaped = escapeHTML(text);
  return escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)/g, (match, label, target, bare) => {
    const url = target || bare;
    return `<a href="${url}" rel="noopener noreferrer">${label || url}</a>`;
  }).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const output = [];
  let paragraph = [];
  let list = false;
  const flush = () => { if (paragraph.length) { output.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; } if (list) { output.push('</ul>'); list = false; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*\|/.test(line) && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || '')) {
      flush();
      const cells = row => row.trim().replace(/^\||\|$/g, '').split('|').map(cell => inline(cell.trim()));
      output.push('<div class="table-wrap"><table><thead><tr>' + cells(line).map(cell => `<th scope="col">${cell}</th>`).join('') + '</tr></thead><tbody>');
      i += 2;
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        output.push('<tr>' + cells(lines[i]).map(cell => `<td>${cell}</td>`).join('') + '</tr>'); i++;
      }
      i--; output.push('</tbody></table></div>');
    } else if (/^#{1,6}\s/.test(line)) {
      flush(); const level = line.match(/^#+/)[0].length;
      output.push(`<h${level}>${inline(line.replace(/^#+\s/, ''))}</h${level}>`);
    } else if (/^\s*[-*]\s/.test(line)) {
      if (paragraph.length) flush();
      if (!list) { output.push('<ul>'); list = true; }
      output.push(`<li>${inline(line.replace(/^\s*[-*]\s/, ''))}</li>`);
    } else if (!line.trim()) flush();
    else { if (list) flush(); paragraph.push(line); }
  }
  flush(); return output.join('\n');
}
function sample() {
  return `<div class="teaser"><span class="eyebrow">Sample alert</span><h2>San Diego: Tier 4 applications closed</h2><p>As of October 23, 2026, Tier 4 had zero licenses remaining. Tier 3 had 807 remaining. These are historical source counts, not live availability.</p><p><a href="#/city/san-diego-ca">Read the San Diego research and primary sources</a></p></div>`;
}
function pricing() {
  return `<section class="section" id="pricing"><span class="eyebrow">Pilot pricing</span><h2>A plan for your markets</h2><div class="grid prices">${[['Free','0','City pages and monthly roundup','0'],['Host','9','1 market','90'],['Portfolio','19','Up to 5 markets','190'],['Manager','79','Up to 15 markets','790']].map(([name,price,detail,annual]) => `<div class="card ${name === 'Host' ? 'highlight' : ''}"><h3>${name}</h3><p class="price">$${price}<small>/mo</small></p><p>${detail}</p><p>${price === '0' ? 'Free access' : `$${annual}/year, two months free`}</p><a href="#/signup">Join the ${name} pilot</a></div>`).join('')}</div><p class="note">No card today. Pilot spots are held; a payment link follows by email for paid plans. Signup requests are reviewed by a person.</p></section>`;
}
function signup() {
  return `<section class="section" id="signup"><span class="eyebrow">Help shape the pilot</span><h2>Tell David which markets matter</h2><p>Pilot signups are reviewed by a person. A confirmation email follows within one business day after your request reaches David by email.</p><p class="note">This static site saves your request in this browser only. After saving, open the email draft addressed to the tracker inbox and send it to complete the handoff. No email is sent automatically.</p><form id="signup-form"><label for="name">Name</label><input id="name" name="name" autocomplete="name" maxlength="120" required><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required><fieldset><legend>Markets of interest (select at least one)</legend><div class="markets">${[...cities.map(city => city.name), 'Other'].map((name,i) => `<label for="market-${i}"><input id="market-${i}" type="checkbox" name="markets" value="${escapeHTML(name)}">${escapeHTML(name)}</label>`).join('')}</div></fieldset><label for="tier">Pilot tier</label><select id="tier" name="tier"><option>Free</option><option>Host</option><option>Portfolio</option><option>Manager</option></select><button type="submit">Save pilot request</button><p class="note">Your name, email, selected markets, and tier are saved on this device. Avoid shared browsers.</p><div id="form-result" aria-live="polite"></div><p><a id="email-fallback" href="mailto:david.strtracker@gmail.com?subject=STR%20Regulation%20Tracker%20pilot">Email fallback: open a draft to the tracker inbox</a></p></form></section>`;
}
function home() {
  return `<section class="hero"><span class="eyebrow">Independent research for short term rental hosts</span><h1>Know the rules before your next move.</h1><p class="intro">Permit requirements, rental caps, and tax notes for 10 cities, with primary sources and visible gaps in verification.</p><div class="actions"><a class="button" href="#/signup">Join the pilot</a><a href="#/compare">Compare the launch cities</a></div><span class="badge">Research last verified October 25, 2026</span></section>${notice()}<section class="section"><div class="section-head"><div><span class="eyebrow">The launch collection</span><h2>Find your city</h2><p>Start with the headlines. Open a city for the full source notes.</p></div><div><label for="city-search">Search cities</label><input id="city-search" type="search" placeholder="City or state" aria-controls="city-grid"></div></div><p id="search-count" role="status">10 cities</p><div class="grid" id="city-grid">${cities.map(city => `<article class="card" data-city="${escapeHTML(city.name.toLowerCase())}"><h3><a href="#/city/${city.slug}">${escapeHTML(city.name)}</a></h3><p><strong class="label">Permit</strong>${escapeHTML(city.permit)}</p><p><strong class="label">Cap or waitlist</strong>${escapeHTML(city.cap)}</p><a href="#/city/${city.slug}">Read city research &rarr;</a></article>`).join('')}</div><p id="no-results" hidden>No cities match. Try another city or state.</p></section><section class="section"><span class="eyebrow">How it works</span><h2>Follow the sources, then confirm locally</h2><div class="grid steps"><div><h3>Choose a city</h3><p>Review permits, caps, taxes, and the date of the research.</p></div><div><h3>Check the detail</h3><p>Follow primary source links. UNVERIFIED means the research did not establish that field.</p></div><div><h3>Confirm your address</h3><p>Ask the city about current rules before you buy, list, or renew.</p></div></div></section><section class="section">${sample()}<p><a href="#/sample-alert">See the sample alert</a></p></section>${pricing()}${signup()}<section class="section"><h2>Frequently asked questions</h2><details><summary>Is this legal advice?</summary><p>${disclaimer}</p></details><details><summary>Are these live rules and permit counts?</summary><p>No. Each city file shows a verification date. Counts and rules reflect the cited research snapshot. Confirm current details with the city.</p></details><details><summary>What does UNVERIFIED mean?</summary><p>The primary sources reviewed did not establish the field. The city notes explain the gap. A missing cap figure does not establish permission to operate.</p></details><details><summary>How does pilot signup work?</summary><p>Save your request locally, then send the email draft to David. A person reviews requests and a confirmation follows within one business day of receipt. No card today; paid pilot payment links follow by email.</p></details><details><summary>Can I request another market?</summary><p>Select Other in the signup form and include the market name in your email. Manager covers up to 15 markets; the current launch research covers 10 cities.</p></details></section>`;
}
function bindHome() {
  document.querySelector('#city-search').addEventListener('input', event => {
    const query = event.target.value.trim().toLowerCase(); let count = 0;
    document.querySelectorAll('[data-city]').forEach(card => { card.hidden = !card.dataset.city.includes(query); if (!card.hidden) count++; });
    document.querySelector('#search-count').textContent = `${count} ${count === 1 ? 'city' : 'cities'}`;
    document.querySelector('#no-results').hidden = count !== 0;
  });
  const form = document.querySelector('#signup-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const entry = { name:data.get('name').trim(), email:data.get('email').trim(), markets:data.getAll('markets'), tier:data.get('tier'), createdAt:new Date().toISOString() };
    const result = document.querySelector('#form-result');
    if (!entry.name || !entry.markets.length) { result.innerHTML = '<p role="alert">Please enter your name and select at least one market.</p>'; return; }
    const body = `Pilot signup\nName: ${entry.name}\nEmail: ${entry.email}\nMarkets: ${entry.markets.join(', ')}\nTier: ${entry.tier}`;
    document.querySelector('#email-fallback').href = `mailto:david.strtracker@gmail.com?subject=STR%20Regulation%20Tracker%20pilot&body=${encodeURIComponent(body)}`;
    try {
      const previous = JSON.parse(localStorage.getItem('strt_signups') || '[]');
      if (!Array.isArray(previous)) throw new Error('Invalid saved data');
      previous.push(entry); localStorage.setItem('strt_signups', JSON.stringify(previous));
      result.innerHTML = '<div class="success"><strong>Saved in this browser.</strong><p>Next, open the email fallback below and send your request to the tracker inbox. David reviews pilot signups and sends a confirmation within one business day of receipt. No card today; a payment link for your paid plan follows by email.</p></div>';
    } catch {
      result.innerHTML = '<div class="error" role="alert">Your request could not be saved in this browser. Use the email fallback below to send your details. For support, contact David through the channel where you found this pilot.</div>';
    }
  });
}
async function route() {
  const version = ++routeVersion;
  const path = location.hash.slice(1) || '/';
  document.title = 'STR Regulation Tracker';
  if (['/', '/pricing', '/signup'].includes(path)) {
    main.innerHTML = home(); bindHome();
    if (path !== '/') document.getElementById(path.slice(1)).scrollIntoView(); else window.scrollTo(0,0);
  } else if (path === '/compare') {
    document.title = 'Compare cities | STR Regulation Tracker';
    main.innerHTML = `<section class="page-head compare"><span class="eyebrow">10 launch cities</span><h1>Compare the headlines</h1>${notice()}<div class="table-wrap" role="region" aria-label="City comparison, scroll horizontally" tabindex="0"><table><caption>From INDEX.md. Last verified October 25, 2026. Scroll horizontally on smaller screens.</caption><thead><tr>${['City','Permit type','Cap headline','Tax headline','Flux'].map(text => `<th scope="col">${text}</th>`).join('')}</tr></thead><tbody>${cities.map(city => `<tr><th scope="row"><a href="#/city/${city.slug}">${escapeHTML(city.name)}</a></th>${['permit','cap','tax','flux'].map(key => `<td>${escapeHTML(city[key])}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
  } else if (path === '/sample-alert') {
    document.title = 'Sample alert | STR Regulation Tracker';
    main.innerHTML = `<section class="page-head"><h1>Sample alert</h1>${notice()}${sample()}<p class="note">SAMPLE ALERT: example format only. No live monitoring or email delivery is active on this static site. Research verified October 25, 2026.</p><a href="data/cities/san-diego-ca.md">View the San Diego source file</a></section>`;
  } else if (path.startsWith('/city/')) {
    const city = cities.find(item => path === `/city/${item.slug}`);
    if (!city) { main.innerHTML = `<h1>City not found</h1><p><a href="#/">Browse the launch cities</a></p>${notice()}`; return; }
    main.innerHTML = '<p role="status">Loading city research...</p>';
    try {
      const response = await fetch(`data/cities/${city.file}`);
      if (!response.ok) throw new Error('City file unavailable');
      const markdown = await response.text();
      if (version !== routeVersion) return;
      const verified = markdown.match(/^Last verified:\s*(.+)$/m)?.[1] || 'Not published';
      document.title = `${city.name} | STR Regulation Tracker`;
      main.innerHTML = `<div class="page-head"><a href="#/">All cities</a> / <a href="#/compare">Compare cities</a><p><span class="badge">Last verified: ${escapeHTML(verified)}</span></p>${notice()}</div><article class="document">${renderMarkdown(markdown)}</article>${notice()}`;
    } catch { if (version === routeVersion) main.innerHTML = `<h1>Research could not load</h1><p>Please retry or <a href="data/cities/${city.file}">open the markdown file</a>.</p>${notice()}`; }
  } else { main.innerHTML = `<h1>Page not found</h1><p><a href="#/">Return to the cities</a></p>${notice()}`; }
  if (!['/pricing','/signup'].includes(path)) window.scrollTo(0,0);
  main.focus({preventScroll:true});
}
window.addEventListener('hashchange', route);
fetch('cities.json').then(response => { if (!response.ok) throw new Error('Index unavailable'); return response.json(); }).then(data => { cities = data; return route(); }).catch(() => { main.innerHTML = `<h1>City index could not load</h1><p>Reload this page or <a href="data/cities/INDEX.md">read the source index</a>.</p>${notice()}`; });
